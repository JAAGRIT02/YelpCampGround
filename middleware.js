const { campgroundSchema, reviewSchema } = require("./schemas.js");
const ExpressError = require("./Utils/Express-Error.js");
const Campground = require("./models/campground");
const Review = require("./models/review");

//making passport middleware to find that is user logged in
module.exports.isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		// console.log(req.path,req.originalUrl)
		req.session.returnTo = req.originalUrl; //store the url they are requesting
		req.flash("error", "You must be signed in first!");
		return res.redirect("/login");
	}
	next();
};

module.exports.validateCampground = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

module.exports.isAuthor = async (req, res, next) => {
	const { id } = req.params;
	const campground = await Campground.findById(id); //finding campground
	if (!campground.author.equals(req.user._id)) {
		//if author is not the user then no permission
		req.flash("error", "You do not have permission to do that!");
		return res.redirect(`/campgrounds/${id}`);
	}
	next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
	//to check the permission of the review author
	const { id, reviewId } = req.params;
	const review = await Review.findById(reviewId); //finding the review
	if (!review.author.equals(req.user._id)) {
		req.flash("error", "You do not have permission to do that!");
		return res.redirect(`/campgrounds/${id}`);
	}
	next();
};

module.exports.validateReview = (req, res, next) => {
    console.log("validateReview : ", {...req.body, rating: parseInt(req.body.rating)});      
	const { error } = reviewSchema.validate({...req.body, rating: parseInt(req.body.rating)}); 
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};
