const express = require('express')
const router = express.Router()
const Catway = require('../models/Catway')
const Reservation = require('../models/Reservation')

// GET /catways -> lister tous les catways
router.get('/', async (req, res) => {
  try {
    const catways = await Catway.find().sort({ catwayNumber: 1 })
    res.status(200).json(catways)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
})

// GET /catways/:id -> détail d'un catway par son numéro
router.get('/:id', async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: Number(req.params.id) })

    if (!catway) {
      return res.status(404).json({ message: 'Catway introuvable' })
    }

    res.status(200).json(catway)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
})

// POST /catways -> créer un catway
router.post('/', async (req, res) => {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body

    const existingCatway = await Catway.findOne({ catwayNumber })
    if (existingCatway) {
      return res.status(409).json({ message: 'Ce numéro de catway existe déjà' })
    }

    const newCatway = new Catway({
      catwayNumber,
      catwayType,
      catwayState
    })

    await newCatway.save()
    res.status(201).json({ message: 'Catway créé', catway: newCatway })
  } catch (error) {
    res.status(400).json({ message: 'Erreur création catway', error: error.message })
  }
})

// PUT /catways/:id -> modifier uniquement catwayState
router.put('/:id', async (req, res) => {
  try {
    const { catwayState } = req.body

    const updatedCatway = await Catway.findOneAndUpdate(
      { catwayNumber: Number(req.params.id) },
      { catwayState },
      { new: true, runValidators: true }
    )

    if (!updatedCatway) {
      return res.status(404).json({ message: 'Catway introuvable' })
    }

    res.status(200).json({ message: 'Catway mis à jour', catway: updatedCatway })
  } catch (error) {
    res.status(400).json({ message: 'Erreur mise à jour', error: error.message })
  }
})

// DELETE /catways/:id -> supprimer un catway
router.delete('/:id', async (req, res) => {
  try {
    const deletedCatway = await Catway.findOneAndDelete({
      catwayNumber: Number(req.params.id)
    })

    if (!deletedCatway) {
      return res.status(404).json({ message: 'Catway introuvable' })
    }

    res.status(200).json({ message: 'Catway supprimé' })
  } catch (error) {
    res.status(500).json({ message: 'Erreur suppression', error: error.message })
  }
})

// GET /catways/:id/reservations -> lister les réservations d'un catway
router.get('/:id/reservations', async (req, res) => {
  try {
    const catwayNumber = Number(req.params.id)

    const catway = await Catway.findOne({ catwayNumber })
    if (!catway) {
      return res.status(404).json({ message: 'Catway introuvable' })
    }

    const reservations = await Reservation.find({ catwayNumber }).sort({ startDate: 1 })
    res.status(200).json(reservations)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
})

// GET /catways/:id/reservations/:idReservation -> détail d'une réservation
router.get('/:id/reservations/:idReservation', async (req, res) => {
  try {
    const catwayNumber = Number(req.params.id)
    const reservation = await Reservation.findOne({
      _id: req.params.idReservation,
      catwayNumber
    })

    if (!reservation) {
      return res.status(404).json({ message: 'Réservation introuvable' })
    }

    res.status(200).json(reservation)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
})

// POST /catways/:id/reservations -> créer une réservation
router.post('/:id/reservations', async (req, res) => {
  try {
    const catwayNumber = Number(req.params.id)
    const { clientName, boatName, startDate, endDate } = req.body

    const catway = await Catway.findOne({ catwayNumber })
    if (!catway) {
      return res.status(404).json({ message: 'Catway introuvable' })
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'La date de fin doit être après la date de début' })
    }

    const newReservation = new Reservation({
      catwayNumber,
      clientName,
      boatName,
      startDate,
      endDate
    })

    await newReservation.save()
    res.status(201).json({ message: 'Réservation créée', reservation: newReservation })
  } catch (error) {
    res.status(400).json({ message: 'Erreur création réservation', error: error.message })
  }
})

// PUT /catways/:id/reservations/:idReservation -> modifier une réservation
router.put('/:id/reservations/:idReservation', async (req, res) => {
  try {
    const catwayNumber = Number(req.params.id)
    const { clientName, boatName, startDate, endDate } = req.body

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'La date de fin doit être après la date de début' })
    }

    const updatedReservation = await Reservation.findOneAndUpdate(
      { _id: req.params.idReservation, catwayNumber },
      { clientName, boatName, startDate, endDate },
      { new: true, runValidators: true }
    )

    if (!updatedReservation) {
      return res.status(404).json({ message: 'Réservation introuvable' })
    }

    res.status(200).json({ message: 'Réservation mise à jour', reservation: updatedReservation })
  } catch (error) {
    res.status(400).json({ message: 'Erreur mise à jour réservation', error: error.message })
  }
})

// DELETE /catways/:id/reservations/:idReservation -> supprimer une réservation
router.delete('/:id/reservations/:idReservation', async (req, res) => {
  try {
    const catwayNumber = Number(req.params.id)

    const deletedReservation = await Reservation.findOneAndDelete({
      _id: req.params.idReservation,
      catwayNumber
    })

    if (!deletedReservation) {
      return res.status(404).json({ message: 'Réservation introuvable' })
    }

    res.status(200).json({ message: 'Réservation supprimée' })
  } catch (error) {
    res.status(500).json({ message: 'Erreur suppression réservation', error: error.message })
  }
})

module.exports = router