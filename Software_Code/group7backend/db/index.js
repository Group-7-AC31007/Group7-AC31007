"use strict";

const { query } = require("express");
const mysql = require("mysql");
const config = require("../config");
const Connection = mysql.createConnection(config.mysql);

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

database.signup = (req) => {
	return new Promise((resolve, reject) => {
		// INSERT INTO Users (${req.keys().join(",")}) VALUES
		// console.log(Object.keys(req).join(","))

		let keys = Object.keys(req);
		let vals = Object.values(req);
		vals.forEach((element, ind) => {
			vals[ind] = "'" + element + "'";
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
		const {email, password} = req;
		pool.query(`SELECT * FROM Users WHERE email='${email}'`, (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};

module.exports = database;
