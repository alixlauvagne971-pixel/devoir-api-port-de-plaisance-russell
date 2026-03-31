const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    req.session.user = {
      email: user.email,
      username: user.username
    };

    res.json({ message: "Connexion réussie" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Déconnexion réussie" });
  });
};