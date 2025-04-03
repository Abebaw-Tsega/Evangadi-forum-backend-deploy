const db = require("../db/dbConfig")
const { StatusCodes, getStatusCode } = require("http-status-codes")

//create answer
async function createAnswer(req, res) {
  const { questionid, answer } = req.body;
  const { userid } = req.user;
  if (!questionid || !answer) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "provide all fields" })
  }
  try {
    await db.query("insert into answers (questionid, userid, answer) values (?,?,?)", [questionid, userid, answer]);
    return res.status(StatusCodes.OK).json({ msg: "Answer posted successfully" })
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "something went wrong" })
  }
}
//get answer
async function getAnswer(req, res) {
  const { questionid } = req.params;

  try {
    const [answers] = await db.query("select * from answers where questionid= ? ", [questionid]);
    if (answers.length == 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "answer not found" })
    }
    return res.status(StatusCodes.OK).json({ answers })
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: "something went wrong" })
  }
}

module.exports = { createAnswer, getAnswer };