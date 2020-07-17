const jwt = require('jsonwebtoken')
require('dotenv')

function auth (req, res, next) {
  const token = req.header('x-auth-token') // get token from header

  // Check for token
  if (!token) { return res.status(401).json({ msg: 'No token, authorizaton denied' }) }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.jwtSecret)

    // Add user from payload
    req.user = decoded
    next()
  } catch (e) {
    res.status(400).json({ msg: 'Token is not valid' })
  }
}

module.exports = auth // export middleware
