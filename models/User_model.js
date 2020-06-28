const mongoose = require('mongoose')

const Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String
  },

  tel: {
    type: String
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
)

const User = mongoose.model('users', Schema)

module.exports.UserSchema = Schema
module.exports.User = User
