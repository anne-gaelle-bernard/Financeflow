const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const router = express.Router();
const ctrl = require('../controllers/budgetsController');

// Liste avec filtres optionnels category/subcategory
router.get('/', ctrl.list);

// Créer un budget
router.post(
  '/',
  [
    body('category').isString().trim().notEmpty(),
    body('subcategory').optional().isString(),
    body('limit').isNumeric(),
    body('userId').optional().isString()
  ],
  validate,
  ctrl.create
);

// Mettre à jour un budget
router.put(
  '/:id',
  [
    body('category').optional().isString().trim().notEmpty(),
    body('subcategory').optional().isString(),
    body('limit').optional().isNumeric(),
    body('userId').optional().isString()
  ],
  validate,
  ctrl.update
);

// Supprimer un budget
router.delete('/:id', ctrl.remove);

module.exports = router;