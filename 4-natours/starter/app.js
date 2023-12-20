const express = require('express'); // 3rd-party module
const morgan = require('morgan'); // 3rd-party middleware function

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorControlller');

const app = express();

// MIDDLEWARES //

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); 
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`)); // built-in middleware function // public folder (locally) is now available to everyone


app.use((req, res, next) => {
    req.requestTime = new Date().toISOString(); // YYYY-MM-DDTHH:mm:ss.sssZ
    next();
});

// MOUNTING ROUTES //
app.use('/api/v1/tours', tourRouter); // Mounting a new router on a route
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => { // *: all http methods // 404: not found
    // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    // err.statusCode = 404;
    // err.status = 'fail';

    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)); // pass the error to the next middleware function // skip all the other middlewares
});

app.use(globalErrorHandler); // error handling middleware function

module.exports = app; 