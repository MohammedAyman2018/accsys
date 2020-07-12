const mongoose = require('mongoose')
// const Joi = require('@hapi/joi')
// const { UserSchema } = require('../models/User_model')

const Schema = new mongoose.Schema({
  by: { // الاوردر لمين
    type: Object,
    required: true
  },
  products: { // المنتجات و كميتها
    type: [Object],
    required: true
  },
  total: [Number],
  delivery: { // رد على الزبون ولا لا
    type: Boolean,
    default: false
  },
  deliveryAt: { // تاريخ الرد على الزبون
    type: Date,
    default: null
  },
  paid: { // اتدفع ولا لا
    type: Boolean,
    default: false
  },
  paidAt: { // تاريخ دفع الحساب
    type: Date,
    default: null
  }
},
{ timestamps: { createdAt: 'created_at' } }
)

const Order = mongoose.model('orders', Schema)

module.exports.Order = Order
