const
  { User } = require('../models/User_model')
const cloudinary = require('cloudinary').v2
const bcrypt = require('bcrypt')

require('dotenv')

cloudinary.config({
  cloud_name: process.env.cloudinary_cloud_name,
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret
})

/** Get All Data
 * @param { RequestInfo } req
 * @param { Response } res
 */
exports.getAllUsers = async (req, res) => {
  res.status(200).json(await User.find({}))
}

/** Get one user
 * @param { RequestInfo } req
 * @param { Response } res
 */
exports.getOneUser = async (req, res) => {
  await User.findById(req.params.id)
    .then(user => res.json(200).json(user))
    .catch(err => res.status(400).json(err))
}

/** Add users
 * @param { String } name
 * @param { String } tel
 * @param { String } adress
 * @param { String } image
 * @param { String } password
 * @param { String } email
 * @param { String } fbid
 * @param { String } goid
 * @param { String } city
 * @param { Boolean } admin
 * @param { Boolean } superAdmin
 */
exports.addUser = async (req, res) => {
  if (!req.body.fbid) delete req.body.fbid
  if (!req.body.goid) delete req.body.goid
  if (!req.body.tel) delete req.body.tel
  // const { error } = validate(req.body);
  // if (error) return res.status(400).json({ "msg": error.details[0].message });

  const {
    name,
    tel,
    adress,
    image,
    password,
    email,
    fbid,
    goid,
    city
  } = req.body

  const query = [{ email }]
  if (tel) query.push({ tel })

  if (fbid) query.push({ fbid: fbid })
  else if (goid) query.push({ goid: goid })

  console.log('query: ', query)

  let user = await User.find({ $or: query })

  if (user.length > 0) return res.status(400).json({ msg: 'This user existes before' })

  user = new User({ name, tel, password, adress, image, email, fbid, goid, city })

  if (req.file) {
    await cloudinary.uploader.upload(req.file.path,
      { resource_type: 'auto', folder: 'accsys', public_id: `user-${user._id}` },
      async function (error, result) {
        /** Uploaded? */
        if (error) return res.status(400).json(error)
        /** Create the new product */
        user.image = result.url
      })
  }

  if (password) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, async (err, hash) => {
        if (err) throw err
        user.password = hash

        await user.save()
          .then(user => {
            delete user.password
            res.status(200).json(user)
          })
          .catch(err => res.status(400).json(err))
      })
    })
  } else {
    await user.save()
      .then(user => {
        delete user.password
        res.status(200).json(user)
      })
      .catch(err => res.status(400).json(err))
  }
}

/** Edit user */
exports.editUser = async (req, res) => {
  if (!!req.body.password && req.body.password != null) {
    let password = req.body.password
    console.log(password)

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) throw err
        password = hash

        delete req.body.password
        console.log({ ...req.body, password })

        /** Get the product and update it */
        await User.findOneAndUpdate({ _id: req.params.id }, { $set: { ...req.body, password } }, { new: true }, (err, user) => {
          if (err) res.status(400).json(err)
          res.status(200).json(user)
        })
      }).catch(err => res.status(400).json({ msg: err.message }))
    })
  } else {
    if (!req.file) {
      await User.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true }, (err, user) => {
        if (err) res.status(400).json(err)
        res.status(200).json(user)
      })
    } else {
      let image

      await cloudinary.uploader.upload(req.file.path,
        { resource_type: 'auto', folder: 'accsys', public_id: `user-${req.params.id}` },
        async function (error, result) {
          /** Uploaded? */
          if (error) return res.status(400).json(error)
          /** Create the new product */
          image = result.url
        })

      await User.findOneAndUpdate({ _id: req.params.id }, { $set: { ...req.body, image } }, { new: true }, (err, user) => {
        if (err) res.status(400).json(err)
        res.status(200).json(user)
      })
    }
  }
}

exports.login = async (req, res) => {
  const { email, password, fbid, goid, tel } = req.body

  let query
  if (tel) query = { tel }
  else if (email) query = { email }
  else if (fbid) query = { fbid }
  else query = { goid }

  // Check for existing user
  await User.findOne(query)
    .then(user => {
      if (!user) return res.status(400).json({ msg: 'User Does not exist' })

      if (email && (!goid || !fbid)) {
        if (!password) return res.status(400).json({ msg: 'No password provided' })
        // Validate password
        bcrypt.compare(password, user.password)
          .then(isMatch => {
            if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' })
            delete user.password
            res.status(200).json(user)
          })
      } else {
        delete user.password
        res.status(200).json(user)
      }
    })
}

/** Delete user
 * @param { RequestInfo } req
 * @param { Response } res
*/
exports.deleteOne = async (req, res) => {
  await User.deleteOne({ _id: req.params.id })
    .then(result => res.status(200).json(result))
    .catch(err => res.status(404).json({ msg: err.message }))
}

/** Delete All
 * @param { RequestInfo } req
 * @param { Response } res
*/
exports.deleteAll = async (req, res) => {
  try {
    await User.deleteMany({})
    res.status(200).json({ msg: 'done' })
  } catch (error) {
    res.status(200).json(error)
  }
}
