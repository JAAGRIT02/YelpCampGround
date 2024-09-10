const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
		url: String,
		filename: String,
})
ImageSchema.virtual('thumbnail').get(function(){
	return this.url.replace('/upload','/upload/w_200'); //to make thumbnail of the images
})

const CampgroundSchema = new Schema({
	//schema for the campground
	title: String,
	images: [ImageSchema],
	price: Number,
	description: String,
	location: String,
	author: {
		type: Schema.Types.ObjectId, //author of the campground
		ref: "User",
	},
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: "Review",
		},
	],
});

// deleting campground reviews when campground is deleted

CampgroundSchema.post("findOneAndDelete", async function (doc) {
	//mongoose middleware
	if (doc) {
		await Review.deleteMany({
			_id: {
				$in: doc.reviews,
			},
		});
	}
});

const Campground =
	mongoose.model.Campground || mongoose.model("Campground", CampgroundSchema);
module.exports = Campground;
