// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');

// Create a schema: template for the document
const tourSchema = new mongoose.Schema({ // create a schema
  name: {
    type: String,
    trim: true, 
    required: [true, 'A tour must have a name'], // validator
    unique: true // must be unique
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty']
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0 // default value
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },
  priceDiscount: Number, // discount price
  summary: {
    type: String,
    trim: true, 
    required: [true, 'A tour must have a description']
  },
  description: {
    type: String,
    trim: true // remove all the white spaces in the beginning and end
  },
  imageCover: {
    type: String, // name of the image, reference of the image is stored in the database
    required: [true, 'A tour must have a cover image']
  },
  images: [String], // array of strings
  createdAt: {
    type: Date,
    default: Date.now() // current date
  },
  startDates: [Date] // array of dates
});

// Create a model
const Tour = mongoose.model('Tour', tourSchema); // create a model based on the schema

module.exports = Tour;