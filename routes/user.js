const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/user");
const catchAsync = require("../Utils/catchAsync");

const users = require("../controllers/users");
//register page
router.get("/register", users.renderRegister);

router.post("/register", catchAsync(users.register));

//login page
router.get("/login", users.renderLogin);

router.post(
	"/login",
	passport.authenticate("local", {
		failureFlash: true,
		failureRedirect: "/login",
	}),
	users.login
);

//logout
router.get("/logout", users.logout);

module.exports = router;
