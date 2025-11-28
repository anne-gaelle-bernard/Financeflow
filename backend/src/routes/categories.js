const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const router = express.Router();
const ctrl = require('../controllers/categoriesController');

router.get('/', ctrl.list);
router.get('/:id', ctrl.get);

router.post(
  '/',
  [
    body('name').isString().trim().notEmpty(),
    body('type').optional().isIn(['expense','income']),
    body('color').optional().isString(),
    body('userId').optional().isString()
  ],
  validate,
  ctrl.create
);

router.put(
  '/:id',
  [
    body('name').optional().isString().trim().notEmpty(),
    body('type').optional().isIn(['expense','income']),
    body('color').optional().isString(),
    body('userId').optional().isString()
  ],
  validate,
  ctrl.update
);

router.delete('/:id', ctrl.remove);

module.exports = router;
