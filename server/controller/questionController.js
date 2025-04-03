const db = require('../db/dbConfig');
const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require('uuid');

// Create question
async function createQuestion(req, res) {
    const { title, description, tag } = req.body;
    const { userid } = req.user;
    if (!title || !description) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: "provide all required fields" });
    }
    try {
        const questionid = uuidv4();
        await db.query(
            'INSERT INTO questions (questionid, title, description, userid, tag) VALUES (?, ?, ?, ?, ?)',
            [questionid, title, description, userid, tag || null]
        );
        return res.status(StatusCodes.CREATED).json({ msg: "question created", questionid });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Server Error" });
    }
}

// Single question
async function singleQuestion(req, res) {
    const { questionid } = req.params;
    try {
        const [questions] = await db.query('SELECT * FROM questions WHERE questionid = ?', [questionid]);
        if (questions.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ msg: "Question not found" });
        }
        return res.status(StatusCodes.OK).json({ questions });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Server Error" });
    }
}

// All questions
async function allQuestion(req, res) {
    try {
        const [questions] = await db.query("SELECT * FROM questions");
        return res.status(StatusCodes.OK).json({ questions });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "Server Error" });
    }
}

module.exports = { createQuestion, singleQuestion, allQuestion };