const mongoose = require('mongoose')
const winston = require('winston')

module.exports = function() {
  mongoose.connect('mongodb://localhost/airbnb', {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false
  }).then(() => winston.info('Connect to MongoDB'))
}