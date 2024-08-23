const express = require("express");
const app = express();
const path = require("path");
const session = require('express-session')
const flash = require('connect-flash')
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate"); //used to make boilerplate
const methodOverride = require("method-override");
const { title } = require("process");

const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user');

const catchAsync = require("./Utils/catchAsync");
const expressError = require("./Utils/Express-Error");
const {campgroundSchema,reviewSchema} = require('./schemas')
const Campground = require("./models/campground"); //importing campground.js for schema
const Review = require("./models/review");

const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/user')


mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  //connection with mongoose
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify:false
});

const db = mongoose.connection; //  shorten up our code and to make it readable
db.on("error", console.error.bind(console, "connection error:")); //database connection
db.once("open", () => {
  console.log("Database connected");
});


app.engine("ejs", ejsMate);
app.set("view engine", "ejs"); //setup for ejs and views directory
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true })); //used to parse when creating new data
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,'public')));


const sessionConfig = {
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true, //making away deprication warning
  cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,  //setting expiration date on the cookie
      maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

app.use(session(sessionConfig))
app.use(flash());

//passport for authentication
app.use(passport.initialize());
app.use(passport.session());  //should be below sessions
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());  //store in session
passport.deserializeUser(User.deserializeUser());//unstore in session

app.use((req, res, next) => {
  console.log(req.session)
  res.locals.currentUser = req.user;  //to get data of the current user
  res.locals.success = req.flash('success'); //for success
  res.locals.error = req.flash('error');
  next();
})

app.get('/fakeUser', async(req,res)=>{
  const user = new User({email:'jaax@gmail.com',username:'jaax'})
  const newUser = await User.register(user,'jaxx');  //setting password
  res.send(newUser);
})


//express router
app.use('/',userRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);


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


