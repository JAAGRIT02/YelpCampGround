const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');   //used to make boilerplate
const methodOverride = require('method-override');
const Campground = require('./models/campground');            //importing campground.js for schema 

mongoose.connect('mongodb://localhost:27017/yelp-camp', {     //connection with mongoose
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;                                     //  shorten up our code and to make it readable
db.on("error", console.error.bind(console, "connection error:"));   //database connection
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');                     //setup for ejs and views directory
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));  //used to parse when creating new data
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.render('home')          //home.ejs created
});

//CRUD functionality started
app.get('/campgrounds', async (req, res) => {       //directory for the index page
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds }) //index.ejs created
});

//this route can not be after the id one because then browser will treat "new" as an id .order matters
app.get('/campgrounds/new', (req, res) => {         //directory to add new campgrounds
    res.render('campgrounds/new');                  //new.ejs created
})

app.post('/campgrounds', async (req, res) => {                  //post request to post data in campground
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)               //redirecting to newly created campground
})

app.get('/campgrounds/:id', async (req, res,) => {                 //showing a particular campground detail by using id.
    const campground = await Campground.findById(req.params.id)     // order matters
    res.render('campgrounds/show', { campground });                     //show.ejs created
});

app.get('/campgrounds/:id/edit', async (req, res) => {              //directory for editing the campground
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });                 //edit.ejs created
})

app.put('/campgrounds/:id', async (req, res) => {                     //put request to update the campground
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }); //spread op used 
    res.redirect(`/campgrounds/${campground._id}`)                                             //redirecting to the particular id to see update
});

app.delete('/campgrounds/:id', async (req, res) => {            //deleting of a particular campground 
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');                           //redirecting to the index page of 
})



app.listen(3000, () => {
    console.log('Serving on port 3000')
})









//ignore this commit