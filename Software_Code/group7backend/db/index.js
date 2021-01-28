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
		
		let insertAnswer = (error, results, question, questionnaireID) => {
			if (error) {
				console.log(error);
				return reject("COULD NOT CREATE QUESTION");
			}
			console.log(results);
			let questionID = results[0].questionID;

			for (i in question.responses) {
				response = question.responses[i];
				pool.query(`INSERT INTO Responses (questionnaireID, questionID, responseValue, orderID) 
				VALUES (${questionnaireID}, ${questionID}, ${response.value}, ${response.id});`);
			}
		};
		
		let insertQuestions = (error, results) => {
			if (error) {
				console.log(error);
				return reject("COULD NOT CREATE QUESTIONNAIRE");
			}
			console.log(results);
			let questionnaireID = results[0].questionnairesID;

			for (i in questions) {
				pool.query(`CALL insert_question(${questionnaireID}, 
					'${questions[i].type}', '${question[i].value.question}', '${question[i].id}');`,
					(err, res) => insertAnswer(err, res, questions[i], questionnaireID));
			}
		};

		pool.query(`SELECT insert_questionnaire(${projectID}, ${researchNo});`, (err, res) => insertQuestions(err, res));
	});
};

module.exports = database;
