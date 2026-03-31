const Catway = require('../models/Catway');

exports.getAllCatways = async (req, res) => {
  try {
    const catways = await Catway.find().sort({ catwayNumber: 1 });
    res.status(200).json(catways);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.getCatwayById = async (req, res) => {
  try {
    const catway = await Catway.findOne({ catwayNumber: Number(req.params.id) });

    if (!catway) {
      return res.status(404).json({ message: 'Catway introuvable' });
    }

    res.status(200).json(catway);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.createCatway = async (req, res) => {
  try {
    const { catwayNumber, catwayType, catwayState } = req.body;

    const existingCatway = await Catway.findOne({ catwayNumber });

    if (existingCatway) {
      return res.status(409).json({ message: 'Ce numéro de catway existe déjà' });
    }

    const newCatway = new Catway({
      catwayNumber,
      catwayType,
      catwayState
    });

    await newCatway.save();

    res.status(201).json({ message: 'Catway créé', catway: newCatway });
  } catch (error) {
    res.status(400).json({ message: 'Erreur création catway', error: error.message });
  }
};

exports.updateCatway = async (req, res) => {
  try {
    const { catwayState } = req.body;

    const updatedCatway = await Catway.findOneAndUpdate(
      { catwayNumber: Number(req.params.id) },
      { catwayState },
      { new: true, runValidators: true }
    );

    if (!updatedCatway) {
      return res.status(404).json({ message: 'Catway introuvable' });
    }

    res.status(200).json({ message: 'Catway mis à jour', catway: updatedCatway });
  } catch (error) {
    res.status(400).json({ message: 'Erreur mise à jour', error: error.message });
  }
};

exports.deleteCatway = async (req, res) => {
  try {
    const deletedCatway = await Catway.findOneAndDelete({
      catwayNumber: Number(req.params.id)
    });

    if (!deletedCatway) {
      return res.status(404).json({ message: 'Catway introuvable' });
    }

    res.status(200).json({ message: 'Catway supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur suppression', error: error.message });
  }
};