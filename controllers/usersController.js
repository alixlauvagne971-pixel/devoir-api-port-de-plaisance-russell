const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "username, email et password sont obligatoires"
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(400).json({
        message: "Cet email existe déjà"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({
      message: "Utilisateur créé",
      user: {
        username: newUser.username,
        email: newUser.email
      }
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne(
      { email: req.params.email.toLowerCase() },
      "-password"
    );

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.params.email.toLowerCase()
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const { username, email, password } = req.body;

    if (username) user.username = username;
    if (email) user.email = email.toLowerCase();

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({ message: "Utilisateur modifié" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({
      email: req.params.email.toLowerCase()
    });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.json({ message: "Utilisateur supprimé" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};