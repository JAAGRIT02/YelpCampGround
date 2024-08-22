const express = require('express');
const router = express.Router();

const Campground = require("../models/campground"); 
const {campgroundSchema} = require('../schemas')

const catchAsync = require("../Utils/catchAsync");
const expressError = require("../Utils/Express-Error");



const validateCampground = (req,res,next)=>{
  const {error} = campgroundSchema.validate(req.body)
  if(error){
      const msg =error.details.map(el=>el.message).join(',')
      throw new expressError(msg,400)
      }else{
          next()
      }
}
  

//CRUD functionality started
router.get("/",catchAsync(async (req, res) => {
    //directory for the index page
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds }); //index.ejs created
  })
);

//this route can not be after the id one because then browser will treat "new" as an id .order matters
router.get("/new", (req, res) => {
  //directory to add new campgrounds
  res.render("campgrounds/new"); //new.ejs created
});

router.post("/",validateCampground,catchAsync(async (req, res, next) => {
    //post request to post data in campground
    // if (!req.body.Campground)throw new expressError("invalid campground data", 400);  //throwing error if data is incomplete (from postman as normally validator will not allow that)
    
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success','successfully made a campground')
    res.redirect(`/campgrounds/${campground._id}`); //redirecting to newly created campground
  })
);

router.get("/:id",catchAsync(async (req, res) => {
    //showing a particular campground detail by using id.
    const campground = await Campground.findById(req.params.id).populate('reviews'); // order matters
    // console.log(campground)
    if(!campground){
      req.flash('error','Can not find that campground')
      return res.redirect('/campgrounds')
    }
    res.render("campgrounds/show", { campground }); //show.ejs created
  })
);

router.get("/:id/edit",catchAsync(async (req, res) => {
    //directory for editing the campground
    const campground = await Campground.findById(req.params.id);
    if(!campground){
      req.flash('error','Can not find that campground')
      return res.redirect('/campgrounds')
    }
    res.render("campgrounds/edit", { campground }); //edit.ejs created
  })
);

router.put("/:id",validateCampground,catchAsync(async (req, res) => {
    //put request to update the campground
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    }); //spread op used
    req.flash('success','successfully updated the campground')
    res.redirect(`/campgrounds/${campground._id}`); //redirecting to the particular id to see update
  })
);

router.delete("/:id",catchAsync(async (req, res) => {
    //deleting of a particular campground
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','successfully deleted a campground')
    res.redirect("/campgrounds"); //redirecting to the index page of
  })
);



module.exports =router;