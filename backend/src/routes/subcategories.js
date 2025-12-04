const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const router = express.Router();
const ctrl = require('../controllers/subcategoriesController');

router.get('/', ctrl.list);

router.post(
  '/',
  [
    body('name').isString().trim().notEmpty(),
    body('categoryId').isString().trim().notEmpty(),
    body('userId').optional().isString()
  ],
  validate,
  ctrl.create
);

router.put(
  '/:id',
  [
    body('name').optional().isString().trim().notEmpty(),
    body('categoryId').optional().isString(),
    body('userId').optional().isString()
  ],
  validate,
  ctrl.update
);

router.delete('/:id', ctrl.remove);

module.exports = router;