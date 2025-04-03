const express = require("express")
const route = express.Router();
const { createAnswer, getAnswer } = require("../controller/answerController")

route.post("/",  createAnswer )

route.get("/:questionid", getAnswer)

module.exports = route;