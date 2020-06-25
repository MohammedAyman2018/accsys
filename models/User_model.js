const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const { array } = require('@hapi/joi');


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
  email: {
    type: String,
    unique: true
  },
  fbid: String,
  goid: String,
  
  adress: String,
  image: String,
  city: String,
  
  fav: [String],
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
    fbid: Joi.string().allow('').allow(null).min(0),
    goid: Joi.string().allow('').allow(null).min(0),
    city: Joi.string(),
    admin: Joi.boolean(),
    fav: Joi.array(),
    superAdmin: Joi.boolean()
  });

  return userSchema.validate(user, { abortEarly: false });
};


module.exports.validate = validate;
module.exports.User = User;
