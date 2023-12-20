// global error handling middleware function
const sendErrorDev = (err, res) => { // development mode
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack // stack trace
    }); 
};

const sendErrorProd = (err, res) => { // production mode
    // Operational, trusted error: send message to client
    if (err.isOperational) { // operational error
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        }); 
    }
    // Programming or other unknown error: don't leak error details
    else { // programming error
        // 1) Log error
        console.error('ERROR', err);

        // 2) Send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!'
        }); 
    }
};

module.exports = ((err, req, res, next) => { // error handling middleware function
    err.statusCode = err.statusCode || 500; // default status code
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') { // development mode
        sendErrorDev(err, res);
    }
    else if (process.env.NODE_ENV === 'production') {
        sendErrorProd(err, res);
    }
});
