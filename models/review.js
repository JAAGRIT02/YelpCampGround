const { string, number } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  body: String,
  review: Number,
});

module.exports = mongoose.model('Review',reviewSchema)