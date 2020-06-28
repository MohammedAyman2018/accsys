const multer = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, `${__dirname}/../public/uploads`)
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + '.jpg')
  }
})

var upload = multer({ storage: storage })

exports.upload = upload
