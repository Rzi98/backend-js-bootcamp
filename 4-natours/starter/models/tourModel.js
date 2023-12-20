// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
const slugify = require('slugify'); // import the slugify package 
const validator = require('validator'); // import the validator package

// Create a schema: template for the document
const tourSchema = new mongoose.Schema({ // create a schema
  name: {
    type: String,
    trim: true, 
    required: [true, 'A tour must have a name'], // validator
    unique: true, 
    maxlength: [40, 'A tour name must have less or equal than 40 characters'], // validator
    minlength: [10, 'A tour name must have more or equal than 10 characters'], // validator
    // validate: [validator.isAlpha, 'Tour name must only contain characters'] // validator
  },
  slug: String, // URL-friendly version of the name
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
    required: [true, 'A tour must have a difficulty'],
    enum: { // validator (only for strings)
      values: ['easy', 'medium', 'difficult'], // possible values
      message: 'Difficulty is either: easy, medium, difficult' // error message
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'Rating must be above or equal to 1.0'], // validator
    max: [5, 'Rating must be below or equal to 5.0'], // validator
  },
  ratingsQuantity: {
    type: Number,
    default: 0 // default value
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function(val){ // validator function
        // this only points to current doc on NEW document creation
        return val < this.price; // return true or false
      },
      message: 'Discount price ({VALUE}) should be below regular price' // error message
    }
  },
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
    default: Date.now(), // current date
    select: false
  },
  startDates: [Date], // array of dates
  secretTour: {
    type: Boolean,
    default: false
  }
}, { // options
  toJSON: { virtuals: true }, // show virtual properties in the output
  toObject: { virtuals: true }
});

tourSchema.virtual('durationWeeks').get(function(){ // create a virtual property
  return this.duration / 7; // use a regular function to use 'this' as the current document
});

// DOCUMENT MIDDLEWARE/HOOK: runs before .save() and .create() // this: current document // NOT .insertMany()
tourSchema.pre('save', function(next){ // pre: before the event // save: save the document
  this.slug = slugify(string=this.name, options={ lower: true }); // create a slug property
  next(); // call the next middleware
});

// QUERY MIDDLEWARE/HOOK: runs before .find() // this: query object
tourSchema.pre(/^find/, function(next){ // pre: before the event // find: find the document // regex find all the methods that start with find
  this.find({ secretTour: { $ne: true } }); // find all documents that have secretTour not equal to true
  this.start = Date.now(); // add a property to the current query object
  next(); // call the next middleware
});

tourSchema.post(/^find/, function(docs, next){ // post: after the event // find: find the document
  console.log(`Query took ${Date.now() - this.start} milliseconds!`); // log a message
  next(); // call the next middleware
});

// AGGREGATION MIDDLEWARE/HOOK: runs before .aggregate() // this: aggregation object
tourSchema.pre('aggregate', function(next){ // pre: before the event // aggregate: aggregate the document')
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); // add a match stage to the beginning of the pipeline
  console.log(this.pipeline()); // log the pipeline
  next(); // call the next middleware
});

// Create a model
const Tour = mongoose.model('Tour', tourSchema); // create a model based on the schema

module.exports = Tour;