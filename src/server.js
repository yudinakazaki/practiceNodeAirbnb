const express = require('express')
const winston = require('winston')

const app = express()

require('./startup/logging')()
require('./startup/db')()
require('./startup/config')()
require('../src/startup/routes')(app)
require('./startup/validation')()

const port = process.env.PORT || 3000
app.listen(port, () => winston.info(`Server is running on port ${port}`))