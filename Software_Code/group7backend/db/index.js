const { query } = require("express");
const mysql = require("mysql");
const config = require("../config");
const Connection = mysql.createConnection(config.mysql);

const pool = mysql.createPool(config.mysql);

let mydb = {};

mydb.all = () => {
	return new Promise((resolve, reject) => {
		pool.query("SELECT * FROM testing", (err, results) => {
			if (err) {
				return reject(err);
			}
			return resolve(results);
		});
	});
};

module.exports = mydb;