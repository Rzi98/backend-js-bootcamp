const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router(); 

// param middleware // 
// router.param('id', checkID); 

router
    .route('/') 
    .get(tourController.getAllTours)
    .post(tourController.createTour); // chain multiple middleware functions -> checkBody first, then createTour

router
    .route('/:id') 
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(tourController.deleteTour);

module.exports = router;  // use module.export if you want to export a single function or object