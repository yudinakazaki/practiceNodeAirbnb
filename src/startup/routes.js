const express = require('express')

const error = require('../middlewares/error')
const home = require('../routes/home.routes')
const host = require('../routes/host.routes')
const guest = require('../routes/guest.routes')
const reservations = require('../routes/reservation.routes')
const auth = require('../routes/auth.routes')

module.exports = function(app) {
  app.use(express.json())

  app.use('/', home)
  app.use('/api/hosts', host)
  app.use('/api/guests', guest)
  app.use('/api/reservations', reservations)
  app.use('/auth', auth)
  app.use(error)
}