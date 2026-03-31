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
  .then(async () => {
    console.log('MongoDB connecté')
    console.log('Base active :', mongoose.connection.name)

    const collections = await mongoose.connection.db.listCollections().toArray()
    console.log('Collections :', collections.map(c => c.name))

    const catwaysCount = await mongoose.connection.db.collection('catways').countDocuments()
    const reservationsCount = await mongoose.connection.db.collection('reservations').countDocuments()

    console.log('Nombre catways :', catwaysCount)
    console.log('Nombre reservations :', reservationsCount)
  })
  .catch((err) => console.log('Erreur MongoDB :', err))

// Port
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Serveur lancé sur port ${PORT}`)
})