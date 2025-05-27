const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const authenticateToken = require('../middleware/authMiddleware');

// endpoints for resarvation
router.post('/', authenticateToken, reservationController.createReservation);
router.get('/user', authenticateToken, reservationController.getUserReservations);
router.put('/:id', authenticateToken, reservationController.updateReservation);
router.delete('/:id', authenticateToken, reservationController.deleteReservation);

module.exports = router;