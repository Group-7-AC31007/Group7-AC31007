"use strict";

const express = require("express");
const db = require("../db");

const router = express.Router();

let sendResponse = async (req, res, sqlpoint) => {
	try {
		// console.log(req);
		req = req.body
		console.log("Request:", req)
		let results = await sqlpoint(req);
		
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
		res.setHeader('Access-Control-Allow-Headers', '*')
		res.setHeader('Access-Control-Allow-Credentials', true)

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

router.post("/signup", async(req, res) => {
	sendResponse(req, res, db.signup);
})

router.post("/signin", async(req, res) => {
	sendResponse(req, res, db.signin);
});

router.post("/create_quiz", async(req, res) => {
	sendResponse(req, res, db.createQuiz);
});

router.get("/get_quiz", async(req, res) => {
	sendResponse(req, res, db.getQuiz);
});

router.post("/complete_quiz", async(req, res) => {
	sendResponse(req, res, db.completeQuiz);
});

module.exports = router;
