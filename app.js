if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}
// console.log(process.env.CLOUDINARY_SECRET);
// console.log(process.env.CLOUDINARY_KEY);
// console.log(process.env.CLOUDINARY_CLOUD_NAME);

const express = require("express");
const app = express();
const path = require("path");
const session = require('express-session')
const flash = require('connect-flash')
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate"); //used to make boilerplate
const methodOverride = require("method-override");
const mongoSanitize = require('express-mongo-sanitize');  //for security
const helmet = require('helmet') //for security

const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user');

const expressError = require("./Utils/Express-Error");


const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/user');
const dbConnect  = require("./Utils/dbConnect");
const { name } = require('ejs');


// MVC-models views controllers

dbConnect();
app.engine("ejs", ejsMate);
app.set("view engine", "ejs"); //setup for ejs and views directory
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true })); //used to parse when creating new data
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,'public')));
app.use(mongoSanitize({
  replaceWith: '_',
}));
app.use (helmet());
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
      directives: {
          defaultSrc: [],
          connectSrc: ["'self'", ...connectSrcUrls],
          scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
          styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
          workerSrc: ["'self'", "blob:"],
          objectSrc: [],
          imgSrc: [
              "'self'",
              "blob:",
              "data:",
              "https://res.cloudinary.com/dwu4dvbf8/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
              "https://images.unsplash.com/",
          ],
          fontSrc: ["'self'", ...fontSrcUrls],
      },
  })
);


const sessionConfig = {
  name:'session',
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
  // console.log(req.session)
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


