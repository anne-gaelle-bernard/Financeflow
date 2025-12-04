const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function signToken(user) {
  const payload = { sub: user._id.toString(), email: user.email }
  const secret = process.env.JWT_SECRET || 'dev_secret_change_me'
  const expiresIn = process.env.JWT_EXPIRES || '7d'
  return jwt.sign(payload, secret, { expiresIn })
}

async function register(req, res) {
  const { firstName, lastName, email, password } = req.body
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ success: false, message: 'Champs requis manquants' })
  }
  const existing = await User.findOne({ email })
  if (existing) {
    return res.status(409).json({ success: false, message: 'Email déjà utilisé' })
  }
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ firstName, lastName, email, passwordHash })
  const token = signToken(user)
  res.status(201).json({ success: true, message: 'Compte créé', data: { token, user: { id: user._id, firstName, lastName, email } } })
}

async function login(req, res) {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email et mot de passe requis' })
  }
  const user = await User.findOne({ email })
  if (!user) return res.status(401).json({ success: false, message: 'Identifiants invalides' })
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ success: false, message: 'Identifiants invalides' })
  const token = signToken(user)
  res.json({ success: true, message: 'Connecté', data: { token, user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email } } })
}

module.exports = { register, login }