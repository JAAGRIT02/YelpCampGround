const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({       //schema for the campground
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews :[{
        type:Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

// deleting campground reviews when campground is deleted

CampgroundSchema.post('findOneAndDelete', async function (doc) {  //mongoose middleware
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema); //exporting the schema