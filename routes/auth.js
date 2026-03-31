const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const User = require('../models/User');

// POST /login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email et mot de passe obligatoires',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: 'Email incorrect' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    res.json({
      message: 'Connexion réussie',
      user: req.session.user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /logout
router.get('/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({ message: 'Erreur lors de la déconnexion' });
    }

    res.clearCookie('connect.sid');
    res.json({ message: 'Déconnexion réussie' });
  });
});

module.exports = router;