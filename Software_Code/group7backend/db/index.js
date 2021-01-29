"use strict";

const mysql = require("mysql");
const config = require("../config");

const pool = mysql.createPool(config.mysql);

let database = {};

// Testing endpoint. Pretty much there to check if the database is live
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
		pool.query(`SELECT * FROM sign_in WHERE email='${email}'`, (err, results) => {
			console.log(results);
			if (err || results[0] == undefined) {
				return reject("NO SUCH USER");
			}
			if (results[0].hashPassword != hashPassword) {
				return reject("NOMATCH PASS");
			}
			return resolve("LOGGED IN");
		});
	});
};

// Make new entries in the appropriate questionnaire tables
database.createQuiz = (req) => {
	return new Promise((resolve, reject) => {
		const { researchNo, projectID, questions } = req;

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
							return reject("COULD NOT CREATE QUESTION")
						}
						return resolve("CREATED QUESTIONNAIRE")
					});
				}
			}
		};

		// Insert into the questionnaire table and get the questionnairesID
		pool.query(`SELECT insert_questionnaire(${projectID}, ${researchNo});`, (err, res) => insertQuestions(err, res));
	});
};

// Get a questionnaire from the database
database.getQuiz = (req) => {
	return new Promise((resolve, reject) => {
		const { researchNo, projectID, questions} = req;
	});
};

// Insert answers to a questionnaire in the Answers table
database.completeQuiz = (req) => {
	return new Promise((resolve, reject) => {
		const { researchNo, projectID, questions } = req;
	});
};

module.exports = database;
