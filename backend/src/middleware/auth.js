const jwt = require('jsonwebtoken')

function auth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ success: false, message: 'Non autorisé' })
  try {
    const secret = process.env.JWT_SECRET || 'dev_secret_change_me'
    const payload = jwt.verify(token, secret)
    req.user = { id: payload.sub, email: payload.email }
    next()
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token invalide' })
  }
}

module.exports = { auth }