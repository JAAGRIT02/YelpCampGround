const express = require('express');
const router = express.Router({mergeParams:true}); //merging the params from app.js

const Campground = require("../models/campground"); //importing campground.js for schema
const Review = require("../models/review");

const {reviewSchema} = require('../schemas')

const catchAsync = require("../Utils/catchAsync");
const expressError = require("../Utils/Express-Error");


const validateReview = (req,res,next) =>{
    const {error} = reviewSchema.validate(req.body)
    if(error){
      const msg =error.details.map(el=>el.message).join(',')
      throw new expressError(msg,400)
      }else{
        next()
        }
};




  router.post('/',validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id); //finding the campground from parameters
    const review = new Review(req.body.review);  // making new review
    campground.reviews.push(review);  // pushing in the reviews array
    await review.save();
    await campground.save();
    // console.log(req.body)
    res.redirect(`/campgrounds/${campground._id}`); //redirecting to the campground show page
  }))
  
  router.delete('/creviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //using pull mongoose opreator to actally target only one thing form the collection
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  }))
  
module.exports = router;
  