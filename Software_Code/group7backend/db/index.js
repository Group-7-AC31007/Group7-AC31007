"use strict";

const mysql = require("mysql");
const config = require("../config");

const pool = mysql.createPool(config.mysql);

let database = {};

// sanitize a string
let sanitize = (str) => {
	return str
	.replace("\'", "\\\'")
	.replace("\"", "\\\"")
	.replace("\`", "\\\`");
}

// For testing if we're connected to the database
database.test = () => {
	return new Promise((resolve, reject) => {
		pool.query("SELECT * FROM testing",
		(err, res) => {
			if (err) {
				return reject(err);
			}
			return resolve(res);
		});
	});
};

// Make a new entry in the Users table
database.signup = (req) => {
	return new Promise((resolve, reject) => {
		let keys = Object.keys(req);
		let vals = Object.values(req);
		vals.forEach((element, ind) => {
			vals[ind] = typeof (element) == "string" ? `'${sanitize(element)}'` : element;
		});

		pool.query(
		`INSERT INTO Users (${keys.join(",")}) VALUES (${vals.join(",")});`,
		(err, res) => {
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
		pool.query(`SELECT * FROM Users WHERE email='${email}'`,
		(err, res) => {
			console.log(res);
			if (err || res[0] == undefined) {
				return reject("NO SUCH USER");
			}
			if (res[0].hashPassword != hashPassword) {
				return reject("NOMATCH PASS");
			}
			return resolve(res[0]);
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
				pool.query(
				`INSERT INTO Responses ` +
				`(questionnairesID, questionID, responseValue, orderID) ` +
				`VALUES (${questionnaireID},${questionID},` +
				`'${sanitize(response.value)}',${response.id});`,
				(err, res) => {
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
					pool.query(
					`SELECT insert_question(${questionnaireID}, ` +
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
		pool.query(
		`SELECT insert_questionnaire(${projectID}, ${questionnaireNo});`,
		(err, res) => insertQuestions(err, res));
	});
};

// Get list of projects currently available to the user
database.getProjectList = (req) => {
	return new Promise((resolve, reject) => {
		const { usersID, projectAccessLevel } = req;
		let sql = `SELECT * FROM projectAccess WHERE usersID=${usersID} AND ` +
		`projectAccessLevel=${projectAccessLevel};`
		console.log(sql);
		pool.query(sql,
		(err, res) => {
			if (err) {
				return reject("COULD NOT GET LIST OF PROJECTS");
			}
			console.log(res);
			return resolve(res);
		});
	});
};

// Get the list of questionnaires available for the project
database.getQuizList = (req) => {
	return new Promise((resolve, reject) => {
		console.log(req);
		const {projectID} = req;
		pool.query(`SELECT * FROM Questionnaires WHERE projectID=${projectID}`,
		(err, res) => {
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
					pool.query(
					`SELECT * FROM Responses` +
					`WHERE questionID=${question.questionID};`,
					(err, res) => {
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
							console.log("RESPONSES", questionData.responses);
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

		pool.query(
		`SELECT * FROM Questions WHERE questionnairesID=${questionnairesID}`,
		(err, res) => buildJson(err, res));
	});
};

// Insert answers to a questionnaire in the Answers table
database.completeQuiz = (req) => {
	return new Promise((resolve, reject) => {
		const { userID, questions } = req;
		for (let i in questions) {
			questionID = questions[i].id;
			answer = question.answer;
			pool.query(
			`INSERT INTO QuestionAnswers (questionID, userID, answer) ` +
			`VALUES (${questionID}, ${userID}, ${answer});`,
			(err, res) => {
				if (err) {
					return reject("COULD NOT SEND COMPLETION");
				}
			});
		}
		return resolve("QUESTIONNAIRE COMPLETED");
	});
};

database.getTaskList = (req) => {
	return new Promise((resolve, reject) => {
		const { projectsID } = req;
		let sql = `SELECT * FROM Tasks WHERE projectsID=${projectsID};`;
		console.log(sql);
		pool.query(sql,
		(err, res) => {
			if (err) {
				return reject(err);
			}
			return resolve(res);
		});
	});
};

database.getTaskCompletion = (req) => {
	return new Promise((resolve, reject) => {
		const { tasksID, usersID } = req;
		let sql = `SELECT * FROM TaskCompletions ` +
		`WHERE tasksID=${tasksID} AND usersID=${usersID};`
		console.log(sql);
		pool.query(sql,
		(err, res) => {
			if (err) {
				return reject(err);
			}
			return resolve(res);
		});
	});
};

database.setTaskCompletion = (req) => {
	return new Promise((resolve, reject) => {
		const { checked, tasksID, usersID } = req;
		let insertTaskCompletion = () => {
			let sql = `INSERT INTO TaskCompletions (tasksID, usersID) ` +
			`VALUES (${tasksID}, ${usersID});`;
			console.log(sql);
			pool.query(sql, 
			(err, res) => {
				if (err) {
					return reject("COULD NOT SET COMPLETION");
				}
				return resolve("COMPLETION SET");
			});
		};

		let deleteTaskCompletion = () => {
			let sql = `DELETE FROM TaskCompletions ` +
			`WHERE tasksID=${tasksID} AND usersID=${usersID};`;
			console.log(sql);
			pool.query(sql,
			(err, res) => {
				if (err) {
					return reject("COULD NOT SET COMPLETION");
				}
				return resolve("COMPLETION SET");
			});
		};
		
		database.getTaskCompletion(req).then(res => {
			if (res.length == 0 && checked == true) {
				insertTaskCompletion();
			} else if (res.length > 0 && checked == false) {
				deleteTaskCompletion();
			}
		});
	});
};

module.exports = database;
