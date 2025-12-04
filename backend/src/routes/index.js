
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'FinanceFlow API', timestamp: new Date().toISOString() });
});

router.use('/users', require('./users'));
router.use('/transactions', require('./transactions'));
router.use('/categories', require('./categories'));
router.use('/subcategories', require('./subcategories'));
router.use('/stats', require('./stats'));
router.use('/budgets', require('./budgets'));
router.use('/_debug', require('./debug'));

module.exports = router;

