"use strict";

const express = require("express");
const db = require("../db");

const router = express.Router();

let sendResponse = async (req, res, sqlpoint) => {
	try {
		console.log(req);
		//req = req.body
		if(req.method=='GET'){
			req = req.query
		} else {
			req = req.body
		}
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

router.post("/signup", async (req, res) => {
	sendResponse(req, res, db.signup);
})

router.post("/signin", async (req, res) => {
	sendResponse(req, res, db.signin);
});

router.post("/create_quiz", async (req, res) => {
	sendResponse(req, res, db.createQuiz);
});

router.post("/get_project_list", async (req, res) => {
	sendResponse(req, res, db.getProjectList);
});

router.post("/get_quiz_list", async (req, res) => {
	sendResponse(req, res, db.getQuizList);
});

router.post("/get_quiz", async (req, res) => {
  sendResponse(req, res, db.getQuiz);
});

router.post("/get_user_quiz_list", async(req, res) => {
	sendResponse(req, res, db.getUsersQuizList);
});

router.post("/get_user_project_list", async(req, res) => {
	sendResponse(req, res, db.getUsersProjectList);
});

router.post("/get_qvisualization", async(req, res) => {
	sendResponse(req, res, db.getQVisualization);
});

router.get("/get_complete_quiz_list", async(req,res) =>{
	sendResponse(req, res, db.getCompleteQuizList)
})

router.post("/complete_quiz", async (req, res) => {
	sendResponse(req, res, db.completeQuiz);
});

router.post("/create_task", async (req, res) => {
	sendResponse(res, res, db.createTask);
})

router.post("/get_task_list", async(req, res) => {
	sendResponse(req, res, db.getTaskList);
});

router.post("/get_task_completion", async(req, res) => {
	sendResponse(req, res, db.getTaskCompletion);
});

router.post("/set_task_completion", async(req, res) => {
	sendResponse(req, res, db.setTaskCompletion);
});

router.post("/update_task", async(req, res) => {
	sendResponse(req, res, db.updateTask);
});

router.post("/delete_task", async(req, res) => {
	sendResponse(req, res, db.deleteTask);
});

router.get("/get_users", async (req, res) => {
	sendResponse(req, res, db.getUsers)
})
router.post("/update_user",async(req,res)=>{
	sendResponse(req,res,db.updateUser)
})
router.post("/delete_user",async(req,res)=>{
	sendResponse(req,res,db.deleteUser)
})
router.post("/update_password",async(req,res)=>{
	sendResponse(req,res,db.updatePassword)
})
module.exports = router;