const Campground = require("../models/campground"); //importing campground.js for schema
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
	const campground = await Campground.findById(req.params.id); //finding the campground from parameters
	const rating = parseInt(req.body.rating);

	const review = new Review({
		rating,
		body: req.body.body,
		author : req.user._id  
	}); // making new review
	
	campground.reviews.push(review); // pushing in the reviews array
	await review.save();
	await campground.save();

	req.flash("success", "successfully created a review");
	res.redirect(`/campgrounds/${campground._id}`); //redirecting to the campground show page
};
module.exports.deleteReview = async (req, res) => {
	const { id, reviewId } = req.params;
	await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //using pull mongoose opreator to actally target only one thing form the collection
	await Review.findByIdAndDelete(reviewId);
	req.flash("success", "successfully deleted a review");
	res.redirect(`/campgrounds/${id}`);
};
