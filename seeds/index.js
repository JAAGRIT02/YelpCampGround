//making us of cities.js and seedHelper.js .we will run it whenever we need to seed our database (not often).
const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground"); //double dots because models folder is 2 folder up,imported for schema
const dbConnect = require("../Utils/dbConnect");
const User = require("../models/user");

const sample = (array) => array[Math.floor(Math.random() * array.length)]; //to get random places and descriptor

const seedDB = async () => {
	// console.log("dsajbdja");

	await dbConnect();
	// await Campground.deleteMany();

	for (let i = 0; i < 50; i++) {
		const random1000 = Math.floor(Math.random() * 1000);

		const price = Math.floor(Math.random() * 20) + 10;

		await Campground.create({
			author: "66c8ced3b8eca206b4c42314",
			location: `${cities[random1000].city}, ${cities[random1000].state}`, //location is city,state
			title: `${sample(descriptors)} ${sample(places)}`,

			// image: "https://picsum.photos/200/300", //added image from unsplash

			description:
				"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!",

			price,

			images: [
				{
					url: "https://res.cloudinary.com/dwu4dvbf8/image/upload/v1725084300/yelp-camp/segoqlshbblvfpsbxdet.jpg",
					filename: "yelp-camp/segoqlshbblvfpsbxdet",
				},
				{
					url: "https://res.cloudinary.com/dwu4dvbf8/image/upload/v1725084302/yelp-camp/rjtstg7lxjcdgmsf173q.jpg",
					filename: "yelp-camp/rjtstg7lxjcdgmsf173q",
				},
			],
		});
	}
	await mongoose.connection.close();
};
// };

seedDB();
