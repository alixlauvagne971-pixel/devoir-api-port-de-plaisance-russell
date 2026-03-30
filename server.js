require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')

const catwayRoutes = require('./routes/catways')

const app = express()

// Middleware
app.use(cors())
app.use(bodyParser.json())

// Route test
app.get('/', (req, res) => {
  res.send('API Port Russell fonctionne 🚤')
})

// Routes
app.use('/catways', catwayRoutes)

// Connexion MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connecté'))
  .catch((err) => console.log(err))

// Port
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Serveur lancé sur port ${PORT}`)
})