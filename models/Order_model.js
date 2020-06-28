const mongoose = require('mongoose')
const Joi = require('@hapi/joi')
const { UserSchema } = require('../models/User_model')
const { ProductSchema } = require('../models/Product_model')

const Schema = new mongoose.Schema({
  by: {
    type: UserSchema,
    required: true
  },
  product: {
    type: ProductSchema,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }

},
{ timestamps: { createdAt: 'created_at' } }
)

const Order = mongoose.model('orders', Schema)

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

module.exports.validate = validate
module.exports.Order = Order
