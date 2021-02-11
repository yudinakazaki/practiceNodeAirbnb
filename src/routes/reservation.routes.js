const express = require('express')
const _ = require('lodash')
const Fawn = require('fawn')
const mongoose = require('mongoose')

const authentication = require('../middlewares/authentication')
const { Reservation, validateReservation } = require('../models/reservations')
const { Host } = require('../models/hosts')
const { Guest } = require('../models/guests')

const router = express.Router()

Fawn.init(mongoose)

router.get('/', async (request, response) => {
  const reservations = await Reservation.find()

  return response.send(reservations)
})

router.get('/:id', async (request, response) => {
  const findReservation = await Reservation.findById(request.params.id)
  if(!findReservation) return response.status(404).send('Reservation not found!')

  return response.send(findReservation)
})

router.post('/', authentication, async (request, response) => {
  const { error } = validateReservation(request.body)
  if(error) return response.status(400).send(error.details[0].message)

  const host = await Host.findById(request.body.hostId)
  if(host.isReserved) return response.status(400).send('Host already reserved!')

  const guest = await Guest.findById(request.body.guestId)

  const newReservation = new Reservation({
    host: {
      _id: host._id,
      city: host.city , 
      country: host.country ,
      estate: host.estate ,
      address: host.address ,
      maxPeople: host.maxPeople ,
      isReserved: true,
      price: host.price
    },
    guest: _.pick(guest, ['_id', 'name', 'email']),
    dateIn: request.body.dateIn,
    dateOut: request.body.dateOut
  })

    new Fawn.Task()
      .update('hosts', {_id: host._id }, { isReserved: true })
      .save('reservations', newReservation)
      .run()

  return response.send(newReservation)
})

router.put('/:id', authentication, async (request, response) => {
  const { error } = validateReservation(request.body)
  if(error) return response.status(400).send(error.details[0].message)

  const newGuest = await Guest.findById(request.body.guestId)
  const newHost = await Host.findById(request.body.hostId)
  
  const updatedReservation = await Reservation.findByIdAndUpdate(request.params.id, 
    {$set: {
      host: _.pick(newHost, [
        'city', 
        'country',
        'estate',
        'address',
        'maxPeople',
        'isReserved',
        'price'
      ]),
      guest: _.pick(newGuest, ['name', 'email']),
      dateIn: request.body.dateIn,
      dateOut: request.body.dateOut
    }},
    { new: true }
  )
  
  if(!updatedReservation) return response.status(404).send('Reservation not found!')

  return response.send(updatedReservation)
})

router.delete('/:id', authentication, async (request, response) => {
  const deletedReservation = await Reservation.findById(request.params.id)
 
  const hostId = deletedReservation.host._id
  const guestId = deletedReservation.guest._id

  if(request.user._id != hostId && request.user._id != guestId) 
  return response.status(401).send('You can only delete the reservations that you participate')
  
  new Fawn.Task()
    .update('hosts', {_id: deletedReservation.host._id }, { isReserved: false })
    .remove('reservations', { _id: deletedReservation._id })
    .run()

  return response.send('Reservation deleted successfully!')

})
module.exports = router