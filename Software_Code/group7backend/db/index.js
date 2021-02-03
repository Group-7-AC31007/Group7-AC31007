"use strict";

const mysql = require("mysql");
const config = require("../config");

const pool = mysql.createPool(config.mysql);

let database = {};

database.test = () => {
	return new Promise((resolve, reject) => {
		pool.query("SELECT * FROM testing", (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};

// Make a new entry in the Users table
database.signup = (req) => {
	return new Promise((resolve, reject) => {
		let keys = Object.keys(req);
		let vals = Object.values(req);
		vals.forEach((element, ind) => {
			vals[ind] = typeof (element) == "string" ? `'${element.replace("'", "\\'")}'` : element;
		});

		pool.query(`INSERT INTO Users (${keys.join(",")}) VALUES (${vals.join(",")});`, (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve("SIGNUP SUCCESS");
		});
	});
};


// Check if a user exists in the database and if the password hashes match
database.signin = (req) => {
	return new Promise((resolve, reject) => {
		const { email, hashPassword } = req;
		pool.query(`SELECT * FROM Users WHERE email='${email}'`, (err, results) => {
			console.log(results);
			if (err || results[0] == undefined) {
				return reject("NO SUCH USER");
			}
			if (results[0].hashPassword != hashPassword) {
				return reject("NOMATCH PASS");
			}
			return resolve(results[0]);
		});
	});
};
database.getUsers = () => {
	return new Promise((resolve, reject) => {
		pool.query(`SELECT usersID, forename, surname, email, phoneNumber, position, locked FROM Users`, (err, results) => {
			console.log(results);
			if (err || results[0] == undefined) {
				return reject("UNABLE TO GET USERS");
			}
			return resolve(results);
		});
	});
};

// Make new entries in the appropriate questionnaire tables
database.createQuiz = (req) => {
	return new Promise((resolve, reject) => {
		const { questionnaireNo, projectID, questions } = req;

		// Insert into the Responses table
		let insertResponses = (error, results, question, questionnaireID) => {
			if (error) {
				console.log(error);
				return reject("COULD NOT CREATE QUESTION");
			}
			console.log(results);
			let questionID = results[0][Object.keys(results[0])[0]];

			for (let i in question.value.responses) {
				let response = question.value.responses[i];
				console.log(response);
				pool.query(`INSERT INTO Responses (questionnairesID, questionID, responseValue, orderID) ` +
					`VALUES (${questionnaireID}, ${questionID}, '${response.value.replace("\'", "\\\'").replace("\"", "\\\"").replace("\`", "\\\`")}', ${response.id});`, (err, res) => {
						if (err) {
							return reject("COULD NOT CREATE RESPONSE");
						}
					});
			}
			return resolve("CREATED QUESTIONNAIRE");
		};

		// Insert into the Questions table and get each questionsID for use with responses
		let insertQuestions = (error, results) => {
			if (error) {
				console.log(error);
				return reject("COULD NOT CREATE QUESTIONNAIRE");
			}
			console.log(results);
			let questionnaireID = results[0][Object.keys(results[0])[0]];

			console.log(questions);

			// For each question
			for (let i in questions) {
				if (questions[i].type === "PredefinedList") {
					// If the question type is a predefined list, insert appropriate responses available
					pool.query(`SELECT insert_question(${questionnaireID}, ` +
						`'${questions[i].type}', '${questions[i].value.question}', '${questions[i].id}');`,
						(err, res) => insertResponses(err, res, questions[i], questionnaireID));
				} else {
					pool.query(`SELECT insert_question(${questionnaireID}, ` +
						`'${questions[i].type}', '${questions[i].value}', '${questions[i].id}');`,
						(err, res) => {
							if (err) {
								return reject("COULD NOT CREATE QUESTION");
							}
							return resolve("CREATED QUESTIONNAIRE");
						});
				}
			}
		};

		// Insert into the questionnaire table and get the questionnairesID
		pool.query(`SELECT insert_questionnaire(${projectID}, ${questionnaireNo});`, (err, res) => insertQuestions(err, res));
	});
};

database.getProjectList = (req) => {
	return new Promise((resolve, reject) => {
		const { userID } = req;
		pool.query(`SELECT * FROM Projects WHERE userID=${userID}`, (err, res) => {
			if (err) {
				return reject("COULD NOT GET LIST OF PROJECTS");
			}
			return resolve(res);
		});
	});
};

// Get the list of questionnaires available for user based on projectAccess
database.getQuizList = (req) => {
	return new Promise((resolve, reject) => {
		console.log(req);
		const { usersID } = req;
		pool.query(`SELECT questionnairesID, questionnairesName FROM user_questionnaires WHERE usersID = ${usersID}`, (err, res) => {
			if (err) {
				return reject("COULD NOT GET LIST OF QUESTIONNAIRES");
			}
			return resolve(res);
		});
	});
};

// Get a questionnaire from the database

database.getQuiz = (req) => {
	return new Promise((resolve, reject) => {
		const { questionnairesID } = req;
		let buildJson = (error, results) => {
			if (error) {
				console.log(error);
				return reject("COULD NOT GET QUESTIONS");
			}
			let promiseArray = [];
			let questionnaire = [];
			console.log(results);
			for (let i in results) {
				promiseArray.push(new Promise((inner_resolve, inner_reject) => {
					let question = results[i];
					let questionData = {};
					Object.assign(questionData, question);
					pool.query(`SELECT * FROM Responses WHERE questionID=${question.questionID};`, (err, res) => {
						if (err) {
							inner_reject("COULD NOT GET RESPONSES");
						}
						if (res.length != 0) {
							questionData.responses = [...res];
							for (let j in questionData.responses) {
								let response = {};
								Object.assign(response, questionData.responses[j]);
								questionData.responses[j] = response;
							}
							console.log("XDDDDDDDDDDDDDDDDDD", questionData.responses);
						}
						questionnaire.push(questionData);
						inner_resolve();
					});
				}));
			}
			Promise.all(promiseArray).then(() => {
				console.log("XDDDDD", questionnaire);
				return resolve(questionnaire);
			});
		};

		pool.query(`SELECT * FROM Questions WHERE questionnairesID=${questionnairesID}`, (err, res) => buildJson(err, res));
	});
};

// Insert answers to a questionnaire in the Answers table
database.completeQuiz = (req) => {
	return new Promise((resolve, reject) => {
		const { userID, questions } = req;
		console.log(req);
		for (let i in questions) {
			console.log(i);
			let questionID = questions[i].id;
			let answer = questions[i].answer;
			console.log(questionID, userID, answer);
			pool.query(`INSERT INTO QuestionAnswers (questionID, userID, answer) VALUES (${questionID}, ${userID}, '${answer}');`, (err, res) => {
				console.log(res);
				console.log(err);
				if (err) {
					return reject("COULD NOT SEND COMPLETION");
				}
			});
		}
		return resolve("QUESTIONNAIRE COMPLETED");
	});
};
database.updateUser = (req) => {
	return new Promise((resolve, reject) => {
		const { usersID, changed } = req;

		console.log(usersID, changed);

		let queryString = ``
		for (let x in changed) {
			if (x != 0) {
				queryString += " ,"
			}
			queryString += `${changed[x].key} =`
			queryString += changed[x].key == "position" ? " " + changed[x].new : `\"${changed[x].new}\"`


		}
		console.log(queryString);
		//return
		pool.query(`UPDATE users SET ${queryString} WHERE usersID = ${usersID};`), (err, res) => {
			console.log(res);
			console.log(err);
			if (err) {
				return reject("COULD NOT UPDATE USER");
			}
		};

		return resolve("USER UPDATED");
	});
};
database.deleteUser = (req) => {
	return new Promise((resolve, reject) => {
		const { usersID } = req;
		pool.query(`UPDATE users SET hashPassword = \"DELETED${usersID}\", email= \"DELETED${usersID}\", forename = \"DELETED${usersID}\", surname = \"DELETED${usersID}\", phoneNumber = \"DELETED${usersID}\", locked = 1 WHERE usersID = ${usersID};`), (err, res) => {
			console.log(res);
			console.log(err);
			if (err) {
				return reject("COULD NOT DELETE USER");
			}
			
		};
		return resolve("USER DELETED");
	}
	)
}
database.updatePassword = (req) => {
	return new Promise((resolve, reject) => {
		const { usersID, newPassword } = req;
		console.log(req);
		pool.query(`UPDATE users SET hashPassword = \"${newPassword}\" WHERE usersID = ${usersID};`), (err, res) => {
			console.log(res);
			console.log(err);
			if (err) {
				return reject("COULD NOT UPDATE USER PASSWORD");
			}
		};

		return resolve("USER PASSWORD UPDATED");
	});
};
module.exports = database;
