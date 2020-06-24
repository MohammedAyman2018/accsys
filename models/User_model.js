const mongoose = require('mongoose');
const Joi = require('@hapi/joi');


const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  tel: {
    type: String,
    unique: true
  },
  adress: String,
  image: String,
  email: String,
  fbid: {
    type: String,
    unique: true
  },
  goid: {
    type: String,
    unique: true
  },
  city: String,
  admin: {
    type: Boolean,
    default: false
  },
  superAdmin: {
    type: Boolean,
    default: false
  }
},
  { timestamps: { createdAt: 'created_at' } }
);

let User = mongoose.model('users', Schema);

function validate(user) {
  const userSchema = Joi.object({
    name: Joi.string().required(),
    password: Joi.string().required(),
    tel: Joi.string(),
    adress: Joi.string(),
    email: Joi.string().email(),
    fbid: Joi.string(),
    goid: Joi.string(),
    city: Joi.string(),
    admin: Joi.boolean(),
    superAdmin: Joi.boolean()
  });

  return userSchema.validate(user, { abortEarly: false });
};


module.exports.validate = validate;
module.exports.User = User;
