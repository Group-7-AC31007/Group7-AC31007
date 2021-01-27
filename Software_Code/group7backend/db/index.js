const { query } = require("express");
const mysql = require("mysql");
const config = require("../config");
const Connection = mysql.createConnection(config.mysql);

const pool = mysql.createPool(config.mysql);

let database = {};

database.all = () => {
	return new Promise((resolve, reject) => {
		pool.query("SELECT * FROM testing", (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};

database.login = (req) => {
	return new Promise((resolve, reject) => {
		const {username, password} = req;
		pool.query(`SELECT * FROM Users WHERE forename='${username}'`, (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};

module.exports = database;
