const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate"); //used to make boilerplate
const methodOverride = require("method-override");
const { title } = require("process");

const catchAsync = require("./Utils/catchAsync");
const expressError = require("./Utils/Express-Error");
const {campgroundSchema,reviewSchema} = require('./schemas')
const Campground = require("./models/campground"); //importing campground.js for schema
const Review = require("./models/review");

const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')


mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  //connection with mongoose
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection; //  shorten up our code and to make it readable
db.on("error", console.error.bind(console, "connection error:")); //database connection
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs"); //setup for ejs and views directory
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true })); //used to parse when creating new data
app.use(methodOverride("_method"));




//express router
app.use('/campgrounds',campgrounds);
app.use('/campgrounds/:id/reviews',reviews);


app.get("/", (req, res) => {
  res.render("home"); //home.ejs created
});





app.all("*", (req, res, next) => {
  next(new expressError("page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "something went wrong";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});


