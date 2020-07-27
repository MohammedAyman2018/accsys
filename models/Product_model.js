const mongoose = require('mongoose')
const Joi = require('@hapi/joi')

const Schema = new mongoose.Schema({
  barcode: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: null,
    required: true
  },
  amount: {
    type: Number,
    default: 0
  }
},
{ timestamps: { createdAt: 'created_at' } }
)

const Cosmatics = mongoose.model('Cosmatics', Schema)
const Makups = mongoose.model('Makups', Schema)

const Medical = mongoose.model('medical', Schema)
const Papers = mongoose.model('papers', Schema)
const Others = mongoose.model('others', Schema)

const allProducts = mongoose.model('all', Schema)

function validate (product) {
  const productSchema = Joi.object({
    barcode: Joi.string().required(),
    name: Joi.string().required(),
    price: Joi.string().required(),
    brand: Joi.string().required(),
    date: Joi.date().required(),
    amount: Joi.number()
  })

  return productSchema.validate(product, { abortEarly: false })
};

function validateUpdate (product) {
  const productSchema = Joi.object({
    brand: Joi.string().required(),
    name: Joi.string().required(),
    price: Joi.string().required(),
    old_barcode: Joi.string().required(),
    new_barcode: Joi.string(),
    date: Joi.date().required(),
    amount: Joi.number()
  })

  return productSchema.validate(product, { abortEarly: false })
};
module.exports.validate = validate
module.exports.validateUpdate = validateUpdate

module.exports.ProductSchema = Schema

module.exports.Cosmatics = Cosmatics
module.exports.Makups = Makups
module.exports.Medical = Medical
module.exports.Papers = Papers
module.exports.Others = Others
module.exports.allProducts = allProducts
