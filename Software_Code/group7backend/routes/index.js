const express = require("express");
const db = require("../db");

const router = express.Router();

sendResponse = async (req, res, sqlpoint) => {
	try {
		req = req.query
		console.log(req)
		let results = await sqlpoint(req);
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
}


router.get("/", async (req, res) => {
	try {
		res.send("API DEFAULT LANDING")
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

router.get("/test", async (req, res) => {
	sendResponse(req, res, db.all)
});

router.get("/login", async(req, res) => {
	sendResponse(req, res, db.login)
});


module.exports = router;
