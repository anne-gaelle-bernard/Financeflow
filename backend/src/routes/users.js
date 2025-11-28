const express = require('express');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const router = express.Router();
const ctrl = require('../controllers/userController');

// Inscription
router.post(
  '/register',
  [
    body('firstName').isString().trim().notEmpty(),
    body('lastName').isString().trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('passwordConfirm').custom((val, { req }) => {
      if (val !== req.body.password) throw new Error('Les mots de passe ne correspondent pas');
      return true;
    })
  ],
  validate,
  ctrl.register
);

// Connexion
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isString().notEmpty()
  ],
  validate,
  ctrl.login
);

module.exports = router;