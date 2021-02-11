const Joi = require('joi')
const mongoose = require('mongoose')
const { hostSchema } = require('../models/hosts')

const Reservation = mongoose.model('Reservation', new mongoose.Schema({
  host: new mongoose.Schema(hostSchema),
  guest: new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
    }
  }),
  dateIn: {
    type: Date,
    required: true
  },
  dateOut: {
    type: Date,
    required: true
  }
}))

function validateReservation(reservation){  
  const reservationJoiSchema = Joi.object({
    hostId: Joi.objectId().required(),
    guestId: Joi.objectId().required(),
    dateIn: Joi.date().required(),
    dateOut: Joi.date().required()
  })

  return reservationJoiSchema.validate(reservation)
}

module.exports.Reservation = Reservation
module.exports.validateReservation = validateReservation