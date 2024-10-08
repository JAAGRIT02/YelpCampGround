const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
	body: String,
	rating: Number,
	author: {
		type: Schema.Types.ObjectId,           //author of the campgorund 
		ref: "User",
	},
});

const Review = mongoose.model.Review || mongoose.model("Review", reviewSchema);
module.exports = Review;
