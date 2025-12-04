const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const { auth } = require('../middleware/auth');
const router = express.Router();
const ctrl = require('../controllers/transactionsController');

// Toutes les routes transactions nécessitent une authentification
router.use(auth);
// Liste filtrable & triable
router.get('/', ctrl.list);

// Récupérer une transaction par id
router.get('/:id', ctrl.get);

// Créer une transaction
router.post(
  '/',
  [
    body('title').isString().trim().notEmpty(),
    body('amount').isNumeric(),
    body('date').optional().isISO8601(),
    body('location').isString().trim().notEmpty(),
    body('categoryId').optional().isString(),
    body('subcategoryId').optional().isString(),
    body('description').optional().isString(),
    body('userId').optional().isString()
  ],
  validate,
  ctrl.create
);

// Mettre à jour une transaction
router.put(
  '/:id',
  [
    body('title').optional().isString().trim().notEmpty(),
    body('amount').optional().isNumeric(),
    body('date').optional().isISO8601(),
    body('location').optional().isString().trim().notEmpty(),
    body('categoryId').optional().isString(),
    body('subcategoryId').optional().isString(),
    body('description').optional().isString(),
    body('userId').optional().isString()
  ],
  validate,
  ctrl.update
);

// Supprimer une transaction
router.delete('/:id', ctrl.remove);

module.exports = router;
