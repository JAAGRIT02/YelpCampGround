const express = require('express');
const router = express.Router({mergeParams:true}); //merging the params from app.js

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

const Campground = require("../models/campground"); //importing campground.js for schema
const Review = require("../models/review");

const catchAsync = require("../Utils/catchAsync");
const expressError = require("../Utils/Express-Error");


  router.post('/',validateReview,isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id); //finding the campground from parameters
    const review = new Review(req.body.review);  // making new review
    review.author = req.user._id;
    campground.reviews.push(review);  // pushing in the reviews array
    await review.save();
    await campground.save();
    // console.log(req.body)
    req.flash('success','successfully created a review')
    res.redirect(`/campgrounds/${campground._id}`); //redirecting to the campground show page
  }))
  
  router.delete('/:reviewId',isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //using pull mongoose opreator to actally target only one thing form the collection
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','successfully deleted a review')
    res.redirect(`/campgrounds/${id}`);
  }))
  
module.exports = router;
  