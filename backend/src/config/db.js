const mongoose = require('mongoose');
require('dotenv').config();

async function connect() {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/financeflow';
    await mongoose.connect(uri);
    console.log('MongoDB connecté ');
  } catch (err) {
    console.error('Erreur de connexion MongoDB ', err);
  }
}

module.exports = { connect };