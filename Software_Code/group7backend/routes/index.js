"use strict";

const express = require("express");
const db = require("../db");

const router = express.Router();

let sendResponse = async (req, res, sqlpoint) => {
	try {
		req = req.body
		console.log("Request:", req)
		let results = await sqlpoint(req);
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
		res.json(results);
	} catch (e) {
		console.log("Error:", e);
		res.json(e);
	}
};


router.get("/", async (req, res) => {
	try {
		res.send("API DEFAULT LANDING");
	} catch (e) {
		console.log("Error:", e);
		res.json(e);
	}
});

router.get("/test", async (req, res) => {
	sendResponse(req, res, db.test);
});

router.post("/auth/signup", async(req, res) => {
	sendResponse(req, res, db.signup);
})

router.post("/auth/signin", async(req, res) => {
	sendResponse(req, res, db.signin);
});

router.post("/quiz/add", async(req, res) => {
	sendResponse(req, res, db.addQuiz);
});


module.exports = router;
