"use strict";

const express = require("express");
const config = require("./config");
const apiRouter = require("./routes");
const cors = require("cors");

const app = express();

const connectHistoryApiFallback = require('connect-history-api-fallback');
const path = require('path')

app.use(connectHistoryApiFallback({
	verbose: false
  }));
app.use(cors())
app.use(express.json());
app.use(apiRouter);
app.use(express.static(path.join(__dirname,"/group7app/build")));


app.listen(process.env.PORT || 6969, () => {
	console.log("API Server up");
});