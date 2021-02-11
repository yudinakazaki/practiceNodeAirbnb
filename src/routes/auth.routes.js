const express = require('express')
const Joi = require('joi')
const bcrypt = require('bcrypt')

const { Guest } = require('../models/guests')

const router = express.Router()

router.post('/', async(request, response) => {
  const { error } = validateLogin(request.body)
  if(error) return response.status(400).send(error.details[0].message)

  const user = await Guest.findOne({ email: request.body.email})
  if(!user) return response.status(400).send('Invalid e-mail or password')

  const validPassword = await bcrypt.compare(request.body.password, user.password)
  if(!validPassword) return response.status(400).send('Invalid e-mail or password')

  const token =  user.generateAuthToken()

  return response.send(token)
})


function validateLogin(login){
  const loginJoiSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })

  return loginJoiSchema.validate(login)
}

module.exports = router