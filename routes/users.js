const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// GET /users
router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ username: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /users/:email
router.get('/:email', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne(
      { email: req.params.email.toLowerCase() },
      '-password'
    );

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /users
router.post('/', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: 'username, email et password sont obligatoires',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(400).json({ message: 'Cet email existe déjà' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: {
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /users/:email
router.put('/:email', authMiddleware, async (req, res) => {
  try {
    const currentEmail = req.params.email.toLowerCase();
    const { username, email, password } = req.body;

    const user = await User.findOne({ email: currentEmail });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    if (username) user.username = username;

    if (email) {
      const newEmail = email.toLowerCase();

      if (newEmail !== currentEmail) {
        const emailAlreadyUsed = await User.findOne({ email: newEmail });
        if (emailAlreadyUsed) {
          return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }
      }

      user.email = newEmail;
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({
      message: 'Utilisateur modifié avec succès',
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /users/:email
router.delete('/:email', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOneAndDelete({
      email: req.params.email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;