const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
	try {
		res.send("API DEFAULT LANDING")
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

router.get("/test/", async (req, res) => {
	try {
		let results = await db.all();
		res.json(results);
	} catch (e) {
		console.log(e);
		res.sendStatus(500);
	}
});

module.exports = router;