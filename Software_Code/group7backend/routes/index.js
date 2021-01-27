"use strict";

const express = require("express");
const db = require("../db");

const router = express.Router();

let sendResponse = async (req, res, sqlpoint) => {
	try {
		req = req.body
		console.log("Request:", req)
		let results = await sqlpoint(req);
		res.json(results);
	} catch (e) {
		console.log("Error:", e);
		res.sendStatus(500);
	}
};


router.get("/", async (req, res) => {
	try {
		res.send("API DEFAULT LANDING")
	} catch (e) {
		console.log("Error:", e);
		res.sendStatus(500);
	}
});

router.get("/test", async (req, res) => {
	sendResponse(req, res, db.test)
});

router.post("/signup", async(req, res) => {
	sendResponse(req, res, db.signup)
})

router.post("/signin", async(req, res) => {
	sendResponse(req, res, db.signin)
});


module.exports = router;
