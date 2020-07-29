const multer = require('multer')
const cloudinary = require('cloudinary').v2

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, `${__dirname}/../public/uploads`)
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + '.jpg')
  }
})
var upload = multer({ storage: storage })

cloudinary.config({
  cloud_name: process.env.cloudinary_cloud_name,
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret
})

exports.upload = upload
exports.cloudinary = cloudinary
