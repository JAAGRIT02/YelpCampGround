const express = require("express");
const router = express.Router({ mergeParams: true }); //merging the params from app.js

const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

const Campground = require("../models/campground"); 
const Review = require("../models/review");

const catchAsync = require("../Utils/catchAsync");

const reviews = require("../controllers/reviews");

router.post("/", validateReview, isLoggedIn, catchAsync(reviews.createReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
