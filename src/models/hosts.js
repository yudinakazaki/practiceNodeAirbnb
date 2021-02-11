const mongoose = require('mongoose')
const Joi = require('joi')

const hostSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true
  },
  estate: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  address:  {
    type: String,
    required: true
  },
  maxPeople: {
    type: Number,
    require: true
  },
  isReserved: {
    type: Boolean,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
})

const Host = mongoose.model('Host', hostSchema)

function validateHost(host) {
  const hostJoiSchema = Joi.object({
    city: Joi.string().required(),
    estate: Joi.string().required(),
    country: Joi.string().required(),
    address: Joi.string().required(),
    maxPeople: Joi.number().min(1).required(),
    isReserved: Joi.boolean().required(),
    price: Joi.number().min(0).required()
  })

  return hostJoiSchema.validate(host)
}

module.exports.Host = Host
module.exports.hostSchema = hostSchema
module.exports.validateHost = validateHost