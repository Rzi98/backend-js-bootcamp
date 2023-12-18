const express = require('express');
const tourController = require('../controllers/tourController');

const {checkID, checkBody, getAllTours, getTour, createTour, updateTour, deleteTour} = tourController;

const router = express.Router(); 

// param middleware // 
router.param('id', checkID); 

router
    .route('/') 
    .get(getAllTours)
    .post(checkBody, createTour); // chain multiple middleware functions -> checkBody first, then createTour

router
    .route('/:id') 
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

module.exports = router;  // use module.export if you want to export a single function or object