const Tour = require('../models/tourModel'); // import the Tour model

// MIDDLEWARES FOR TOURS route only //
exports.getAllTours = async (req, res) => {
    try{
        // BUILD THE QUERY //
        const queryObj = {...req.query}; // destructuring: create a shallow copy of the query object 
        const excludedFields = ['page', 'sort', 'limit', 'fields']; // fields to exclude from the query object
        excludedFields.forEach(el => delete queryObj[el]); // delete the fields from the query object

        // console.log(`ORIGINAL QUERY: ${JSON.stringify(req.query)}`); // query string
        // console.log(`ACTUAL OBJECT: ${JSON.stringify(queryObj)}`); // object
        // console.log(queryObj)
        
        // METHOD 1 //
        const query = Tour.find(queryObj); // find all documents in the database

        // METHOD 2: Mongoose chain//
        // const query = await Tour.find()
        //     .where('duration')
        //     .equals(5)
        //     .where('difficulty')
        //     .equals('easy'); // chaining multiple queries

        // EXECUTE THE QUERY //
        const tours = await query; // await the query to be executed

        // SEND RESPONSE //
        res.status(200).json({  
            status: 'success',
            results: tours.length, 
            data: {                
                tours              
            }
        });
    }
    catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

exports.getTour = async (req, res) => {
    try{
        const tour = await Tour.findById(req.params.id);  
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    }
    catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

exports.createTour = async (req, res) => {
    try{

        const newTour = await Tour.create(req.body); 
        
        // sent to the client
        res.status(201).json({   
            status: 'success',
            data: {
                tour: newTour
            }
        });
    }
    catch(err){
        res.status(400).json({
            status: 'fail',
            message: err
        });
    }
}

exports.updateTour = async (req, res) => {
    try{
        const tour = await Tour.findByIdAndUpdate(id=req.params.id, update=req.body, options={
            new: true, // return the new updated document
            runValidators: true // run the validators again
        })
        res.status(200).json({
            status: 'success',
            data: {
                tour: tour // <property>: <object>
                // tour
            }
        });
    }
    catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}

exports.deleteTour = async (req, res) => {
    try{
        const tour = await Tour.findByIdAndDelete(req.params.id);
        res.status(204).json({  // 204 won't send any data to the client
            status: 'success',
            data: null,
        });
    }
    catch(err){
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
}