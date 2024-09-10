const Campground = require("../models/campground");
const {cloudinary} = require("../cloudinary")

module.exports.index = async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
	res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
	const campground = new Campground(req.body.campground);
	campground.images = req.files.map((f) => ({url: f.path,filename: f.filename,}));
	campground.author = req.user._id;
	await campground.save();
	// console.log(campground);

	req.flash("success", "Successfully made a new campground!");
	res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
	const campground = await Campground.findById(req.params.id)
		.populate({
			//populating reviews and author of review
			path: "reviews",
			populate: {
				path: "author",
			},
		})
		.populate("author"); //populating author of the review
	// console.log(campground);
	if (!campground) {
		req.flash("error", "Cannot find that campground!");
		return res.redirect("/campgrounds");
	}
	res.render("campgrounds/show", { campground });
};

module.exports.renderEditForm = async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findById(id);
	if (!campground) {
		req.flash("error", "Cannot find that campground!");
		return res.redirect("/campgrounds");
	}
	res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
	const { id } = req.params;
	console.log(req.body);
	// Update the campground details
	const campground = await Campground.findById(id);
	if (!campground) {
	  req.flash("error", "Campground not found!");
	  return res.redirect("/campgrounds");
	}
	// Update campground data with new form data
	campground.title = req.body.campground.title;
	campground.price = req.body.campground.price;
	campground.description = req.body.campground.description;
	campground.location = req.body.campground.location;
	
	// Map over uploaded files to create an array of image objects
	const imgs = req.files.map((f) => ({
	  url: f.path,
	  filename: f.filename,
	}));
	// Add new images to the existing images array
	campground.images.push(...imgs);
	// Save the updated campground
	await campground.save();
	
	if (req.body.deleteImages && req.body.deleteImages.length > 0) {
		for(let filename of req.body.deleteImages){
			await cloudinary.uploader.destroy(filename);
		}
	  // Ensure 'deleteImages' is an array
	  const deleteImages = Array.isArray(req.body.deleteImages) ? req.body.deleteImages : [req.body.deleteImages];	
	  // Remove selected images from the campground's images array
	  campground.images = campground.images.filter(img => !deleteImages.includes(img.filename));
	  // Save the updated campground after deletion
	  await campground.save();
  
	  console.log("Deleted images:", deleteImages);  // Log the filenames to be deleted
	} else {
	  console.log("No images selected for deletion.");
	}
  
	req.flash("success", "Successfully updated campground!");
	res.redirect(`/campgrounds/${campground._id}`);
  };
   

exports.deleteCampground = async (req, res) => {
	const { id } = req.params;
	await Campground.findByIdAndDelete(id);
	req.flash("success", "Successfully deleted campground");
	res.redirect("/campgrounds");
};
