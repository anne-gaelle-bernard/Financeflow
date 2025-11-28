const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/statsController');

// Solde global
router.get('/balance', ctrl.balance);

// Totaux par catégorie
router.get('/totals', ctrl.totalsByCategory);

// Séries mensuelles pour graphiques
router.get('/series', ctrl.chartSeries);

module.exports = router;