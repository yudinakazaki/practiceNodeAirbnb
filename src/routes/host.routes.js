const express = require('express')
const _ = require('lodash')
const { Host, validateHost } = require('../models/hosts')

const router = express.Router()

router.get('/', async (request, response) => {
  const hosts = await Host.find()

  return response.send(hosts)
})

router.get('/:id', async (request, response) => {
  const findHost = await Host.findById(request.params.id)
  if(!findHost) return response.status(404).send('Host not found!')

  return response.send(findHost)
})

router.get('/me', async (request, response) => {
  const findHost = Host.findById(request.user._id)

  return (findHost)
})

router.post('/', async (request, response) => {
  const { error } = validateHost(request.body)
  if(error) return response.status(400).send(error.details[0].message)

  const newHost = new Host(_.pick(request.body, [
    'city', 
    'country',
    'estate',
    'address',
    'maxPeople',
    'isReserved',
    'price'
  ]))

  await newHost.save()
 
  return response.send(newHost)
})

router.put('/:id', async (request, response) => {
  const { error } = validateHost(request.body)
  if(error) return response.status(400).send(error.details[0].message)
  
  const updateHost = await Host.findOneAndUpdate(request.params.id, 
    { $set: _.pick(request.body, [
      'city', 
      'country',
      'estate',
      'address',
      'maxPeople',
      'isReserved',
      'price'
    ])
    },
    { new: true }
  )
  if(!updateHost) return response.status(404).send('Host not found')

  return response.send(updateHost)
})

router.delete('/:id', async (request, response) => {
  const deleteHost = await Host.findByIdAndRemove(request.params.id)
  if(!deleteHost) return response.status(404).send('Host not found')

  return response.send('Host deleted successfully!')
})

module.exports = router