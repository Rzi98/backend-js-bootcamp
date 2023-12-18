const express = require('express'); // 3rd-party module
const morgan = require('morgan'); // 3rd-party middleware function

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARES //

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); 
}

app.use(express.json());

app.use(express.static(`${__dirname}/public`)); // built-in middleware function // public folder (locally) is now available to everyone

app.use((req, res, next) => {   // custom middleware function: always same arguments
    console.log('Hello from the middleware 👋');
    next(); // next() is needed to move on to the next middleware function in the stack
});
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString(); // YYYY-MM-DDTHH:mm:ss.sssZ
    next();
});

// MOUNTING ROUTES //
app.use('/api/v1/tours', tourRouter); // Mounting a new router on a route
app.use('/api/v1/users', userRouter);

module.exports = app; 