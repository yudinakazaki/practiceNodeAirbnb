const jwt = require('jsonwebtoken')

module.exports = (request, response, next) => {
  const token = request.header('x-auth-token')
  if(!token) return response.status(401).send('You need to be logged to do this!')

  try {
    const decoded = jwt.verify(token, process.env.JWTSECRETKEY)
    request.user = decoded
    next()
  } catch {
    return response.send('Invalid token!')
  }
}