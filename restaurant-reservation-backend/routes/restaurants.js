const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const authenticateToken = require('../middleware/authMiddleware');
// restaurant endpoints
router.get('/', authenticateToken, restaurantController.getAllRestaurants);
router.post('/', restaurantController.createRestaurant);         
router.put('/:id', restaurantController.updateRestaurant);       
router.delete('/:id', restaurantController.deleteRestaurant);    

module.exports = router;