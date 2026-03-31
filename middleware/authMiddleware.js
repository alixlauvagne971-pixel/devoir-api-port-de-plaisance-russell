function authMiddleware(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Accès non autorisé' });
  }

  next();
}

module.exports = authMiddleware;