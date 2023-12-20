const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router(); 

// router.param('id', checkID); 

router.route('/top-5-cheap')
    .get(tourController.aliasTopTours, tourController.getAllTours); // alias middleware function

router.route('/tour-stats')
    .get(tourController.getTourStats);

router.route('/get-monthly-plan/:year') // accept the year parameter
    .get(tourController.getMonthlyPlan);

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