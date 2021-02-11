const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Joi = require('joi')

const guestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})


guestSchema.methods.generateAuthToken = function(){
  const token = jwt.sign({ _id: this._id, name: this.name }, process.env.JWTSECRETKEY)
  return token
}

const Guest = mongoose.model('Guest', guestSchema)

function validateGuest(user) {
  const guestJoiSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })

  return guestJoiSchema.validate(user)
}

module.exports.Guest = Guest
module.exports.validateGuest = validateGuest