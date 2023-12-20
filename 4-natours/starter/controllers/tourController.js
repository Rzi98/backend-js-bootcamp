const Tour = require('../models/tourModel'); // import the Tour model
const APIFeatures = require('../utils/apiFeatures'); // import the APIFeatures class
const catchAsync = require('../utils/catchAsync'); // import the catchAsync function
const AppError = require('../utils/appError'); // import the AppError class

// ALIAS MIDDLEWARE FUNCTION //
exports.aliasTopTours = (req, res, next) => {
    // pre-fill the query string object
    req.query.limit = '5'; // add a query string to the request object
    req.query.sort = '-ratingsAverage,price'; // add a query string to the request object
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'; // add a query string to the request object
    next(); // call the next middleware function
};

// MIDDLEWARES FOR TOURS route only //
exports.getAllTours = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Tour.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate(); // create a new APIFeatures object
    const tours = await features.query; // await the query to be executed
    
    // SEND RESPONSE //
    res.status(200).json({  
        status: 'success',
        results: tours.length, 
        data: {                
            tours              
        }
    });
    }
);

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);  

    if (!tour) { // if the tour doesn't exist
        return next(new AppError('No tour found with that ID', 404)); // return a new error
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
    }
);

exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = await Tour.create(req.body); 
        res.status(201).json({   
        status: 'success',
        data: {
            tour: newTour
        }
    });
});

exports.updateTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndUpdate(id=req.params.id, update=req.body, options={
        new: true, // return the new updated document
        runValidators: true // run the validators again
    })

    if (!tour) { // if the tour doesn't exist
        return next(new AppError('No tour found with that ID', 404)); // return a new error
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour: tour // <property>: <object>
            // tour
        }
    });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);

    if (!tour) { // if the tour doesn't exist
        return next(new AppError('No tour found with that ID', 404)); // return a new error
    }

    console.log(tour);
    res.status(204).json({  // 204 won't send any data to the client
        status: 'success',
        data: null,
    });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: {$gte: 4.5} } // filter documents with ratingsAverage >= 4.5
        },
        {
            $group: { // group documents
                // key: {js method: value}
                _id: { $toUpper: '$difficulty' }, // group by difficulty // null: group all documents
                numTours: { $sum: 1 }, // count the number of tours
                numRatings: { $sum: '$ratingsQuantity' }, // sum the ratingsQuantity
                avgRating: { $avg: '$ratingsAverage' }, // average the ratingsAverage
                avgPrice: { $avg: '$price' }, // average the price
                minPrice: { $min: '$price' }, // minimum price
                maxPrice: { $max: '$price' }, // maximum price
            }
        },
        {
            $sort: { avgPrice: 1 } // sort by average price ascending order // name comes from the previous stage in $group
        },
        // {
        //     $match: { _id: { $ne: 'EASY' } } // filter documents with _id != 'EASY'
        // }
    ]);
    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1; // convert string to number
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates' // deconstruct the startDates array // create a document for each element of the array
        },
        {
            $match: { // filter documents
                startDates: { // startDates field
                    $gte: new Date(`${year}-01-01`), // greater than or equal to the first day of the year
                    $lte: new Date(`${year}-12-31`) // less than or equal to the last day of the year
                }
            }
        },
        {
            $group: { // group documents
                _id: { $month: '$startDates' }, // group by month // $month: aggregation pipeline operator
                numTourStarts: { $sum: 1 }, // sum the number of tours // increment by 1
                tours: { $push: '$name' } // push the name of the tours into the tours array
            }
        },
        {
            $addFields: { month: '$_id' } // add a new field month with the value of _id
        },
        {
            $project: { // project the fields
                _id: 0 // 0: exclude the field // 1: include the field
            }
        },
        {
            $sort: { numTourStarts: -1 } // sort by number of tours descending order
        },
        {
            $limit: 12 // limit the number of documents to 12
        }
    ]);
    res.status(200).json({
        status: 'success',
        data: {
            plan
        }
    });
});