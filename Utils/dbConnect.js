const mongoose = require("mongoose");
const User = require("../models/user");
const Campground = require("../models/campground");
const Review = require("../models/review");
const dotenv = require("dotenv");
dotenv.config(); //to view env file
const { MONGO_URI } = process.env;

let isConnected = false;

async function dbConnect() {
	console.log("WORkS");

	if (isConnected) return;

	try {
		// console.log(process.env.MONGO_URI);

		if (!MONGO_URI) throw new Error("MONGO_URI not detected");
		const db = await mongoose.connect(MONGO_URI, {
			// useNewUrlParser: true,
			// useUnifiedTopology: true,
			// useFindAndModify: false,
			// useCreateIndex: true,
		}); // connecting to the db

		if (!mongoose.models.User) mongoose.model("User", User.schema);
		if (!mongoose.models.Campground)
			mongoose.model("Campground", Campground.schema);
		if (!mongoose.models.Review) mongoose.model("Review", Review.schema);

		// the contiguous lines above ensure the initialization of all the models used. This will prevent the crash which happens when we try to do some operation which involves reffering to another schema while accessing a schema. Ig that mongoose automatically initializes a schema when used but doesn't when another schema's ref is given which leads to an app-level-crash. Initializing all in advance solves this problem

		isConnected = db.connections[0].readyState === 1; // marks the connection var to true, preventing the whole "connecting to the db and initializing schemas" everytime they've been already performed
	} catch (error) {
		console.error("Could not connect to MongoDB", error);
		throw new Error("Could not connect to MongoDB");
	}
}

// console.log(MONGO_URI);
module.exports = dbConnect;
