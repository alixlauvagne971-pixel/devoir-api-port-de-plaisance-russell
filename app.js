const express = require('express');
const session = require('express-session');

const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const catwaysRouter = require('./routes/catways');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'port-russell-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true
  }
}));

app.get('/', (req, res) => {
  res.send('API Port Russell fonctionne 🚤');
});

app.use('/users', usersRouter);
app.use('/catways', catwaysRouter);
app.use('/', authRouter);

module.exports = app;