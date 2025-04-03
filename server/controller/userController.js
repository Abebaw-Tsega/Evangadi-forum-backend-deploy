//db connection
const e = require("express");
const dbConnection = require("../db/dbConfig")
const bcrypt = require("bcrypt")
const {StatusCodes} = require("http-status-codes")
const jwt = require("jsonwebtoken")
require('dotenv').config();

//register user
async function register(req, res) {
  const { username, firstname, lastname, email, password } = req.body;

  if (!email || !password || !firstname || !lastname || !username) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "please provide all required information" })
  }
  try {
    const [user] = await dbConnection.query("select username, userid from users where username =? or userid =?", [username, email])
    if (user.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "you already registered!" })
    }
    if (password.length < 8) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: "password must be at least 8 characters" })
    }

    //encrypt password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    await dbConnection.query("INSERT INTO users (username, firstname, lastname, email, password) VALUES (?,?,?,?,?) ", [username, firstname, lastname, email, hashedPassword])
    return res.status(StatusCodes.CREATED).json({ msg: "user registered successfully" })
  } catch (error) {
    console.log(error.message)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      { msg: "something want wrong please try again" }
    )
  }

}
//login user
async function login(req, res) {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({ 
      msg: "Please provide email and password" 
    });
  }

  try {
    // Check if user exists
    const [user] = await dbConnection.query(
      "SELECT userid, username, password FROM users WHERE email = ?",
      [email]
    );

    if (user.length === 0) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ 
        msg: "Invalid credentials" 
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ 
        msg: "Invalid credentials" 
      });
    }

    // Check if JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        msg: "Server configuration error. Please contact support."
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userid: user[0].userid, 
        username: user[0].username 
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.status(StatusCodes.OK).json({
      msg: "Login successful",
      token,
      user: {
        userid: user[0].userid,
        username: user[0].username
      }
    });

  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      msg: "Something went wrong, please try again later"
    });
  }
}
//check user
async function checkUser(req, res) {
  const username = req.user.username;
  const userid = req.user.userid;
  res.status(StatusCodes.OK).json({ 
    msg: "User found",
    user: { 
      username, 
      userid 
    }
  });
}


module.exports = { register, login, checkUser }