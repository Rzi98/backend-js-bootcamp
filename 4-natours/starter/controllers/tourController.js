const fs = require('fs'); 

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')   
    );

exports.checkID = (req, res, next, val) => { // val is the value of the parameter, first argument is the name of the parameter (/:<params>)
    console.log(`Tour id is: ${val}`); // Tour id is: 5
    if (req.params.id * 1 > tours.length) { 
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID'
        });
    }

    next();
}

exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {  // no request body name or no price
        return res.status(400).json({
            status: 'fail',
            message: 'Missing name or price'
        });
    }

    next();
}

// MIDDLEWARES FOR TOURS route only //
exports.getAllTours = (req, res) => {
    console.log(`REQUEST TIME: ${req.requestTime}`); // req.requestTime is available because of middleware function -> REQUEST TIME: 2023-12-17T12:28:15.973Z
    res.status(200).json({  // ends the request-response cycle
        status: 'success',
        requestedAt: req.requestTime,
        results: tours.length, 
        data: {                
            tours              
        }
    });
};

exports.getTour = (req, res) => {
    const id = req.params.id * 1; 
    const tour = tours.find(el => el.id === id); 

    res.status(200).json({
        status: 'success',
        data: { tour }
    });
}

exports.createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;      
    const newTour = Object.assign({ id: newId }, req.body); 

    tours.push(newTour);
    
    // writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => { 
    //     res.status(201).json({   
    //         status: 'success',
    //         data: {
    //             tour: newTour
    //         }
    //     });
    // });

    res.status(201).json({   
        status: 'success',
        data: {
            tour: newTour
        }
    });
}

exports.updateTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            tour: '<Updated tour here...>'
        }
    });
}

exports.deleteTour = (req, res) => {
    res.status(204).json({ 
        status: 'success',
        data: null
    });
}