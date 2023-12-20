module.exports = fn => { // catchAsync: function that returns a new function
    return (req, res, next) => { // new function
        fn(req, res, next).catch(next); // call the function and pass the next function to it // catch the error
    }
}