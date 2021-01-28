"use strict";

const { query } = require("express");
const mysql = require("mysql");
const config = require("../config");
const Connection = mysql.createConnection(config.mysql);

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
			vals[ind] = typeof(element) == "string" ?  `'${element.replace("'", "\\'")}'` : element;
		});

		pool.query(`INSERT INTO Users (${keys.join(",")}) VALUES (${vals.join(",")});`, (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve("SIGNUP SUCCESS");
		});
	});
};

// Check if entered email and hashPassword matches ones in the DB
database.signin = (req) => {
	return new Promise((resolve, reject) => {
		const {email, hashPassword} = req;
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

module.exports = database;
