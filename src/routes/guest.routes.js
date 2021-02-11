const express = require('express')
const _ = require('lodash')
const bcrypt = require('bcrypt')

const authentication = require('../middlewares/authentication')
const { Guest, validateGuest } = require('../models/guests')


const router = express.Router()

router.get('/', async (request, response) => {
  const guests = await Guest.find()

  return response.send(guests)
})

router.get('/:id', async (request, response) => {
  const findGuest = await Guest.findById(request.params.id)
  if(!findGuest) return response.status(404).send('Guest not found!')

  return response.send(findGuest)
})

router.get('/me', authentication, async (request, response) => {
  const findGuest = Guest.findById(request.user._id).select('-password')

  return response.send(findGuest)
})

router.post('/', async (request, response) => {
  const { error } = validateGuest(request.body)
  if(error) return response.status(400).send(error.details[0].message)

  const guest = await Guest.findOne({ email: request.body.email })
  if(guest) return response.status(400).send('E-mail already registered!')

  const newGuest = new Guest({
    name: request.body.name,
    email: request.body.email,
    password: request.body.password
  })

  const salt = await bcrypt.genSalt(10)
  newGuest.password = await bcrypt.hash(newGuest.password, salt)

  await newGuest.save()

  const token = newGuest.generateAuthToken()

  return response.header('x-auth-token', token).send(_.pick(newGuest, ['_id', 'name', 'email']))
})

router.put('/:id', async (request, response) => {
  const { error } = validateGuest(request.body)
  if(error) return response.status(400).send(error.details[0].message)
  
  const updatedGuest = Guest.findByIdAndUpdate(request.params.id, {
    $set: _.pick(request.body, ['name', 'email', 'password'])
  })

  if(!updatedGuest) return response.status(404).send('Guest not found!')

  const salt = await bcrypt.genSalt(10)
  updatedGuest.password = await bcrypt.hash(updatedGuest.password, salt)

  return response.send(_.pick(updatedGuest, ['_id', 'name', 'email']))
})

router.delete('/:id', async (request, response) => {
  const deletedGuest = Guest.findByIdAndRemove(request.params.id)
  if(!deletedGuest) return response.status(404).send('Guest not found')

  return response.send('Guest deleted successfully!')
})



module.exports = router