const express = require('express');
const router = express.Router();

const catwaysController = require('../controllers/catwaysController');
const reservationsController = require('../controllers/reservationsController');

// Catways
router.get('/', catwaysController.getAllCatways);
router.get('/:id', catwaysController.getCatwayById);
router.post('/', catwaysController.createCatway);
router.put('/:id', catwaysController.updateCatway);
router.delete('/:id', catwaysController.deleteCatway);

// Reservations liées aux catways
router.get('/:id/reservations', reservationsController.getReservationsByCatway);
router.get('/:id/reservations/:idReservation', reservationsController.getReservationById);
router.post('/:id/reservations', reservationsController.createReservation);
router.put('/:id/reservations/:idReservation', reservationsController.updateReservation);
router.delete('/:id/reservations/:idReservation', reservationsController.deleteReservation);

module.exports = router;