//making us of cities.js and seedHelper.js .we will run it whenever we need to seed our database (not often).
const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground"); //double dots because models folder is 2 folder up,imported for schema
const { default: dbConnect } = require("../Utils/dbConnect");

const sample = (array) => array[Math.floor(Math.random() * array.length)]; //to get random places and descriptor

const seedDB = async () => {
    await dbConnect();
  await Campground.deleteMany({}); //delete everything in database ,then starting from scratch
  for (let i = 0; i < 50; i++) {
    //gives us 50 new campgrounds eith location and title
    const random1000 = Math.floor(Math.random() * 1000); //generating random 50 locations out of 1000 cities(by creating random numbers form 1to 1000)
    const price = Math.floor(Math.random() * 20) + 10; // random price genrator

    const camp = new Campground({
      author: "66c877550877bb2a144898df",
      location: `${cities[random1000].city}, ${cities[random1000].state}`, //location is city,state
      title: `${sample(descriptors)} ${sample(places)}`, //title is combination of descriptor and places
      image: "https://picsum.photos/200/300", //added image from unsplash
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!",
      price,
    });
    
    await camp.save();
    await mongoose.connection.close();
  }
};

seedDB();