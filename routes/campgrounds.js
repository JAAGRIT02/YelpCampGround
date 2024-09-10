const express = require("express");
const router = express.Router();
const catchAsync = require("../Utils/catchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");
const Campground = require("../models/campground");
const multer = require("multer");
const{storage}=require('../cloudinary')
const upload = multer({ storage });

router.route("/")
	.get(catchAsync(campgrounds.index))
	.post( isLoggedIn, upload.array("image"),validateCampground, catchAsync(campgrounds.createCampground));
	
	// .post(upload.array("image"), (req, res) => {         //using multer for image upload
	// 	console.log(req.files,req.body)
    //     res.send('it worked')
	// });

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.route("/:id")
	.get(catchAsync(campgrounds.showCampground))
	.put(isLoggedIn,isAuthor,upload.array("image"),validateCampground,catchAsync(campgrounds.updateCampground))
	.delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get("/:id/edit",isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm));

module.exports = router;
