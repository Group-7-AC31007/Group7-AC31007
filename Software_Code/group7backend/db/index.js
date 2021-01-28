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

database.signin = (req) => {
	return new Promise((resolve, reject) => {
		const { email, hashPassword } = req;
		pool.query(`SELECT * FROM sign_in WHERE email='${email}'`, (err, results) => {
			if (err) {
				return reject("NO SUCH USER");
			}
			if (results[0].hashPassword != hashPassword) {
				return reject("NOMATCH PASS")
			}
			return resolve("LOGGED IN")
		});
	});
};

database.createQuiz = (req) => {
	return new Promise((resolve, reject) => {
		const { researchNo, projectID, questions } = req;

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
						return reject("COULD NOT CREATE RESPONSE")
					}
				});
			}
			return resolve("CREATED QUESTIONNAIRE")
		};
		
		let insertQuestions = (error, results) => {
			if (error) {
				console.log(error);
				return reject("COULD NOT CREATE QUESTIONNAIRE");
			}
			console.log(results);
			let questionnaireID = results[0][Object.keys(results[0])[0]];
			
			console.log(questions);

			for (let i in questions) {
				if (questions[i].type === "PredefinedList") {
					pool.query(`SELECT insert_question(${questionnaireID}, ` +
					`'${questions[i].type}', '${questions[i].value.question}', '${questions[i].id}');`,
					(err, res) => insertResponses(err, res, questions[i], questionnaireID));
				} else {
					pool.query(`SELECT insert_question(${questionnaireID}, ` +
					`'${questions[i].type}', '${questions[i].value}', '${questions[i].id}');`,
					(err, res) => insertResponses(err, res, questions[i], questionnaireID));
				}
			}
		};

		pool.query(`SELECT insert_questionnaire(${projectID}, ${researchNo});`, (err, res) => insertQuestions(err, res));
	});
};

module.exports = database;
