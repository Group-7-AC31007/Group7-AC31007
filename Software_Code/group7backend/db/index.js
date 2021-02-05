"use strict"

const mysql = require("mysql");
const { resolve } = require("path");
const config = require("../config");

const pool = mysql.createPool(config.mysql)

let database = {}

// sanitize a string
let sanitize = (str) => {
	return str
		.replace("\'", "\\\'")
		.replace("\"", "\\\"")
		.replace("\`", "\\\`")
}

// For testing if we're connected to the database
database.test = () => {
	return new Promise((resolve, reject) => {
		let sql = `SELECT * FROM testing;`

		console.log("test_sql", sql)

		pool.query(sql, (err, res) => {
			if (err) {
				console.log("test_err", err)
				return reject(err)
			}
			console.log("test_res", res)
			return resolve(res)
		})
	})
}

// Make a new entry in the Users table
database.signup = (req) => {
	return new Promise((resolve, reject) => {
		let keys = Object.keys(req)
		let vals = Object.values(req)
		vals = vals.map(element => `'${sanitize(element)}'`)
		let sql = `INSERT INTO Users (${keys.join(",")}) ` +
			`VALUES (${vals.join(",")});`

		console.log("signup_sql", sql)

		pool.query(sql, (err, res) => {
			if (err) {
				console.log("signup_err", err)
				return reject(err)
			}
			console.log("signup_res", res)
			return resolve("SIGNUP SUCCESS")
		})
	})
}

// Check if a user exists in the database and if the password hashes match
database.signin = (req) => {
	return new Promise((resolve, reject) => {
		const { email, hashPassword } = req
		let sql = `SELECT * FROM Users WHERE email='${sanitize(email)}';`

		console.log("signin_sql", sql)

		pool.query(sql, (err, res) => {
			if (err || res[0] == undefined) {
				console.log("signin_err", err)
				return reject("NO SUCH USER")
			}
			if (res[0].hashPassword != sanitize(hashPassword)) {
				console.log("signin_nomatch")
				return reject("NOMATCH PASS")
			}
			console.log("signin_res", res[0])
			return resolve(res[0])
		})
	})
}

database.getUsers = () => {
	return new Promise((resolve, reject) => {
		let sql = `SELECT usersID, forename, surname, email,` +
			`phoneNumber, position, locked FROM Users;`

		console.log("getUsers_sql", sql)

		pool.query(sql, (err, res) => {
			if (err || res[0] == undefined) {
				console.log("getUsers_err", err)
				return reject("UNABLE TO GET USERS")
			}
			console.log("getUsers_res", res)
			return resolve(res)
		})
	})
}

// Insert into the Responses table
let insertResponses = (results, question, questionnaireID) => {
	return new Promise((resolve, reject) => {
		console.log("insertResponses_results", results)

		let questionID = results[0][Object.keys(results[0])[0]]
		let promiseArray = []

		for (let i in question.value.responses) {
			promiseArray.push(new Promise((loop_resolve, loop_reject) => {
				let response = question.value.responses[i]
				let sql = `INSERT INTO Responses ` +
					`(questionnairesID, questionID, responseValue, orderID) ` +
					`VALUES (${questionnaireID},${questionID},` +
					`'${sanitize(response.value)}',${response.id});`

				console.log("insertResponses_loop_response", response)
				console.log("insertPromises_loop_sql", sql)

				pool.query(sql, (err, res) => {
					if (err) {
						console.log("insertResponses_loop_err", err)
						return loop_reject("COULD NOT CREATE RESPONSE")
					}
					console.log("insertResponses_loop_res", res)
					return loop_resolve()
				})
			}))
		}

		Promise.all(promiseArray)
			.then(() => { return resolve() })
			.catch((promise_err) => { return reject(promise_err) })
	})
}

// Insert into the Questions table and get each questionsID
// Call insertResponses for each predefinedList type question
let insertQuestions = (questionnairesID, questions) => {
	return new Promise((resolve, reject) => {
		console.log("insertQuestions_questions", questions)

		let promiseArray = []

		for (let i in questions) {
			promiseArray.push(new Promise((loop_resolve, loop_reject) => {
				let question = questions[i]
				let predefList = question.type === "PredefinedList"
				let questionText = predefList ? question.value.question : question.value
				let sql = `SELECT insert_question(${questionnairesID},` +
					`'${question.type}', '${sanitize(questionText)}', '${question.id}');`

				console.log("insertQuestions_loop_question", question)
				console.log("insertQuestions_loop_sql", sql)

				pool.query(sql, (err, res) => {
					if (err) {
						console.log("insertQuestions_loop_err", err)
						return loop_reject("COULD NOT CREATE QUESTION")
					}
					console.log("insertQuestions_loop_res", res)
					if (predefList) {
						insertResponses(res, question, questionnairesID)
							.then(() => { return loop_resolve() })
							.catch((promise_err) => { return loop_reject(promise_err) })
					} else {
						return loop_resolve()
					}
				})
			}))
		}

		Promise.all(promiseArray)
			.then(() => { return resolve() })
			.catch((promise_err) => { return reject(promise_err) })
	})
}

// Make new entries in the appropriate questionnaire tables
database.createQuiz = (req) => {
	return new Promise((resolve, reject) => {
		const { host, researcherID, projectID, questions } = req
		let sql = `SELECT insert_questionnaire(${projectID}, ${researcherID});`

		console.log("createQuiz_sql", sql)

		// Insert into the questionnaires table and get the questionnairesID
		pool.query(sql, (err, res) => {
			if (err) {
				console.log("createQuiz_err", err)
				return reject("COULD NOT CREATE QUESTIONNAIRE")
			}
			console.log("createQuiz_res", res)

			let questionnairesID = res[0][Object.keys(res[0])[0]]
			let url = host + `/share?id=${questionnairesID}`

			database.createTask({
				text: `Complete this questionnaire ${url}`,
				projectsID: projectID
			}).then(() => {
				insertQuestions(questionnairesID, questions)
					.then(() => { return resolve("CREATED QUESTIONNAIRE") })
					.catch(promise_err => { return reject(promise_err) })
			}).catch(promise_err => { return reject(promise_err) })
		})
	})
}

// Get list of projects currently available to the user
database.getProjectList = (req) => {
	return new Promise((resolve, reject) => {
		const { usersID, projectAccessLevel } = req
		let sql = `SELECT * FROM projectAccess WHERE usersID=${usersID} AND ` +
			`projectAccessLevel=${projectAccessLevel};`

		console.log("getProjectList_sql", sql)

		pool.query(sql, (err, res) => {
			if (err) {
				console.log("getProjectList_err", err)
				return reject("COULD NOT GET LIST OF PROJECTS")
			}
			console.log("getProjectList_res", res)
			return resolve(res)
		})
	})
}

// Get the list of questionnaires available for user based on projectAccess
database.getQVisualization = (req) => {
	return new Promise((resolve, reject) => {
		const { questionnairesID } = req;
		console.log("WAAAAAGH");
		pool.query(`SELECT * FROM Qtesting WHERE questionnairesID=${questionnairesID}`, (err, res) => {
			if (err) {
				console.log("REEEEE");
				return reject("COULD NOT GET LIST FOR CHARTS")
			}
			console.log("AAAAAAAAAAAAAAH");
			return resolve(res);
		});
	});
}

// Get the list of questionnaires available for the project
database.getQuizList = (req) => {
	return new Promise((resolve, reject) => {
		const { usersID } = req
		let sql = `SELECT questionnairesID, questionnairesName ` +
			`FROM user_questionnaires WHERE usersID=${usersID};`

		console.log("getQuizList_sql", sql)

		pool.query(sql, (err, res) => {
			if (err) {
				console.log("getQuizList_err", err)
				return reject("COULD NOT GET LIST OF QUESTIONNAIRES")
			}
			console.log("getQuizList_res", res)
			return resolve(res)
		})
	})
}

database.getUsersQuizList = (req) => {
	return new Promise((resolve, reject) => {
		console.log(req);
		const {userID} = req;
		pool.query(`SELECT * FROM Questionnaire_access WHERE usersID=${userID}`, (err, res) => {
			if (err) {
				return reject("COULD NOT GET LIST OF QUESTIONNAIRES");
			}
			return resolve(res);
		});
	});
};

database.getUsersProjectList = (req) => {
	return new Promise((resolve, reject) => {
		console.log(req);
		const {userID} = req;
		pool.query(`SELECT * FROM User_projects WHERE usersID=${userID}`, (err, res) => {
			if (err) {
				return reject("COULD NOT GET LIST OF PROJECTS");
			}
			return resolve(res);
		});
	});
};

database.getCompleteQuizList = () => {
	return new Promise((resolve, reject) => {
		pool.query(`SELECT * FROM Questionnaires`, (err, res) => {
			if (err) {
				return reject("COULD NOT GET LIST OF QUESTIONNAIRES");
			}
			return resolve(res);
		});
	});
}

let buildJson = (results) => {
	return new Promise((resolve, reject) => {
		let promiseArray = []
		let questionnaire = []

		console.log("buildJson_results", results)

		for (let i in results) {
			promiseArray.push(new Promise((loop_resolve, loop_reject) => {
				let question = results[i]
				let questionData = {}
				let sql = `SELECT * FROM Responses ` +
					`WHERE questionID=${question.questionID};`
				Object.assign(questionData, question)

				console.log("buildJson_loop_sql", sql)

				pool.query(sql, (err, res) => {
					if (err) {
						console.log("buildJson_loop_err", err)
						return loop_reject("COULD NOT GET RESPONSES")
					}
					console.log("buildJson_loop_res", res)
					if (res.length != 0) {
						questionData.responses = [...res]
						for (let j in questionData.responses) {
							let response = {}
							Object.assign(response, questionData.responses[j])
							questionData.responses[j] = response
						}
					}
					questionnaire.push(questionData)
					return loop_resolve()
				})
			}))
		}

		Promise.all(promiseArray)
			.then(() => { return resolve(questionnaire) })
			.catch(promise_err => { return reject(promise_err) })
	})
}

// Get a questionnaire from the database
database.getQuiz = (req) => {
	return new Promise((resolve, reject) => {
		const { questionnairesID } = req
		let sql = `SELECT * FROM Questions ` +
			`WHERE questionnairesID=${questionnairesID};`

		console.log("getQuiz_sql", sql)

		pool.query(sql, (err, res) => {
			if (err) {
				console.log("getQuiz_err", err)
				return reject("COULD NOT GET QUESTIONS")
			}
			console.log("getQuiz_res", res)
			buildJson(res)
				.then(questionnaire => { return resolve(questionnaire) })
				.catch(promise_err => { return reject(promise_err) })
		})
	})
}

// Insert answers to a questionnaire in the Answers table
database.completeQuiz = (req) => {
	return new Promise((resolve, reject) => {
		const { userID, questions } = req
		let promiseArray = []

		for (let i in questions) {
			promiseArray.push(new Promise((loop_resolve, loop_reject) => {
				let questionID = questions[i].id
				let answer = questions[i].answer
				let sql = `INSERT INTO QuestionAnswers (questionID, userID, answer) ` +
					`VALUES (${questionID}, ${userID}, '${sanitize(answer)}');`

				console.log("completeQuiz_loop_sql", sql)

				pool.query(sql, (err, res) => {
					if (err) {
						console.log("completeQuiz_err", err)
						return loop_reject("COULD NOT SEND COMPLETION")
					}
					console.log("completeQuiz_res", res)
					return loop_resolve()
				})
			}))
		}

		Promise.all(promiseArray)
			.then(() => {
				return resolve("QUESTIONNAIRE COMPLETED")
			})
			.catch(promise_err => { return reject(promise_err) })
	})
}

database.createTask = (req) => {
	return new Promise((resolve, reject) => {
		const { projectsID, text } = req
		let sql = `INSERT INTO Tasks (projectsID, text) ` +
		`VALUES (${projectsID}, '${sanitize(text)}')`

		console.log("createTask_sql", sql)

		pool.query(sql, (err, res) => {
			if (err) {
				console.log("createTask_err", err)
				return reject("COULD NOT CREATE TASK")
			}
			console.log("createTask_res", res)
			return resolve("CREATED TASK")
		})

	})
}

database.getTaskList = (req) => {
	return new Promise((resolve, reject) => {
		const { projectsID } = req
		let sql = `SELECT * FROM Tasks WHERE projectsID=${projectsID};`

		console.log("getTaskList_sql", sql)

		pool.query(sql, (err, res) => {
			if (err) {
				console.log("getTaskList_err", err)
				return reject(err)
			}
			console.log("getTaskList_res", res)
			return resolve(res)
		})
	})
}

database.getTaskCompletion = (req) => {
	return new Promise((resolve, reject) => {
		const { tasksID, usersID } = req
		let sql = `SELECT * FROM TaskCompletions ` +
			`WHERE tasksID=${tasksID} AND usersID=${usersID};`

		console.log("getTaskCompletion_sql", sql)

		pool.query(sql, (err, res) => {
			if (err) {
				console.log("getTaskCompletion_err", err)
				return reject(err)
			}
			console.log("getTaskCompletion_res", res)
			return resolve(res)
		})
	})
}

database.setTaskCompletion = (req) => {
	return new Promise((resolve, reject) => {
		const { checked, tasksID, usersID } = req

		database.getTaskCompletion(req).then(res => {
			let sql = ``

			if (res.length == 0 && checked == true) {
				sql = `DELETE FROM TaskCompletions ` +
					`WHERE tasksID=${tasksID} AND usersID=${usersID};`
			} else if (res.length > 0 && checked == false) {
				sql = `INSERT INTO TaskCompletions (tasksID, usersID) ` +
					`VALUES (${tasksID}, ${usersID});`
			}

			console.log("setTaskComplete_sql", sql)

			pool.query(sql, (err, res) => {
				if (err) {
					console.log("setTaskComplete_err", err)
					return reject("COULD NOT SET COMPLETION")
				}
				console.log("setTaskComplete_res", res)
				return resolve("COMPLETION SET")
			})
		})
	})
}

database.updateTask = (req) => {
	return new Promise((resolve, reject) => {
		const { tasksID, text } = req

		let sql = `UPDATE Tasks SET text='${sanitize(text)}' ` +
			`WHERE tasksID=${tasksID};`

		pool.query(sql, (err, res) => {
			if (err) {
				console.log("updateTask_err", err)
				reject(err)
			}
			console.log("updateTask_res", res)
			resolve("TASK UPDATED")
		})
	})
}

database.deleteTask = (req) => {
	return new Promise((resolve, reject) => {
		const { tasksID } = req

		let sql = `DELETE FROM Tasks WHERE tasksID=${tasksID};`

		pool.query(sql, (err, res) => {
			if (err) {
				console.log("deleteTask_err", err)
				reject(err)
			}
			console.log("deleteTask_res", res)
			resolve("TASK DELETED")
		})
	})
}

database.updateUser = (req) => {
	return new Promise((resolve, reject) => {
		const { usersID, changed } = req

		let pairs = changed.map(element => `${element.key}='${element.new}'`)
			.join(", ")
		console.log(pairs)

		pool.query(`UPDATE users SET ${pairs} WHERE usersID = ${usersID};`), (err, res) => {
			console.log(res)
			console.log(err)
			if (err) {
				return reject("COULD NOT UPDATE USER")
			}
		}

		return resolve("USER UPDATED")
	})
}

database.deleteUser = (req) => {
	return new Promise((resolve, reject) => {
		const { usersID } = req
		pool.query(`UPDATE users SET hashPassword = \"DELETED${usersID}\", email= \"DELETED${usersID}\", forename = \"DELETED${usersID}\", surname = \"DELETED${usersID}\", phoneNumber = \"DELETED${usersID}\", locked = 1 WHERE usersID = ${usersID};`), (err, res) => {
			console.log(res)
			console.log(err)
			if (err) {
				return reject("COULD NOT DELETE USER")
			}

		}
		return resolve("USER DELETED")
	}
	)
}

database.updatePassword = (req) => {
	return new Promise((resolve, reject) => {
		const { usersID, newPassword } = req
		console.log(req)
		pool.query(`UPDATE users SET hashPassword = \"${newPassword}\" WHERE usersID = ${usersID};`), (err, res) => {
			console.log(res)
			console.log(err)
			if (err) {
				return reject("COULD NOT UPDATE USER PASSWORD")
			}
		}

		return resolve("USER PASSWORD UPDATED")
	})
}

module.exports = database
