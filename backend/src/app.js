const express = require('express');
const cors = require('cors');
const app = express();
const { connect } = require('./config/db');

app.use(cors());
app.use(express.json());

// Initialise la connexion MongoDB
connect().catch(() => {
  // En cas d'erreur de connexion, l'API démarre mais répondra 500 aux accès DB
});

const apiRouter = require('./routes');

app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.send('Hello world');
});

module.exports = app;