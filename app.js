const express = require('express');
const session = require('express-session');

const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const catwaysRouter = require('./routes/catways');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(session({
  secret: 'port-russell-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true
  }
}));

// Route accueil
app.get('/', (req, res) => {
  res.send('API Port Russell fonctionne 🚤');
});

// Routes API
app.use('/users', usersRouter);
app.use('/catways', catwaysRouter);
app.use('/', authRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route introuvable' });
});

module.exports = app;