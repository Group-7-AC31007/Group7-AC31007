"use strict";

const express = require("express");
const config = require("./config");
const apiRouter = require("./routes");
const cors = require("cors");

const app = express();

app.use(cors())
app.use(express.json());
app.use("/", apiRouter);

app.listen(3001, () => {
	console.log("API Server up");
});