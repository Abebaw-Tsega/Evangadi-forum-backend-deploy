const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../Middleware/authMiddleware");

//user controllers
const { register, login, checkUser } = require("../controller/userController");

//register route
router.post("/register", register)

//login user
router.post("/login", login)

//check user
router.get("/check", authMiddleware, checkUser)

module.exports = router;