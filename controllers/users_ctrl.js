const
  { validate, User } = require("../models/User_model"),
  cloudinary = require('cloudinary').v2,
  jwt = require('jsonwebtoken'),
  bcrypt = require('bcrypt');

require('dotenv');

cloudinary.config({
  cloud_name: process.env.cloudinary_cloud_name,
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret
});

/** Get All Data
 * @param { RequestInfo } req
 * @param { Response } res
 */
exports.get_all_users = async (req, res) => {
  res.status(200).json(await User.find({}));
}

/** Get one user
 * @param { RequestInfo } req
 * @param { Response } res
 */
exports.get_one_user = async (req, res) => {
  const { tel, email, fbid, goid } = req.body

  let query = {}

  if (tel) query = { tel };
  else if (email) query = { email };
  else if (fbid) query = { fbid };
  else query = { goid };

  await User.findOne(query)
    .then(user => res.status(200).json(user))
    .catch(err => res.status(400).json({ "msg": err }));
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
exports.add_user = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ "msg": error.details[0].message });

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
  } = req.body;

  let user = await User.find({ $or: [{ tel }, { email }, { fbid }, { goid }] });
  if (user) return res.status(400).json({ "msg": "This user existes before" })

  user = new User({ name, tel, password, adress, image, email, fbid, goid, city });

  if (req.file) {
    await cloudinary.uploader.upload(req.file.path,
      { resource_type: "auto", folder: "accsys", public_id: `user-${user._id}` },
      async function (error, result) {
        /** Uploaded? */
        if (error) return res.status(400).json(error);
        /** Create the new product */
        user.image = result.url;
      });
  }

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, async (err, hash) => {
      if (err) throw err;
      user.password = hash;

      await user.save()
        .then(user => {
          delete user.password;
          res.status(200).json(user);
        })
        .catch(err => res.status(400).json(err));
    })
  })
};

/** Edit user */
exports.edit_user = async (req, res) => {
  if (!req.file) {
    console.log(req.file);
    await User.updateOne({ _id: req.params.id }, { $set: req.body })
      .then(user => res.json({ success: true }))
      .catch(err => res.status(404).json({ "msg": err }));
  } else {
    let image;

    await cloudinary.uploader.upload(req.file.path,
      { resource_type: "auto", folder: "accsys", public_id: `user-${req.params.id}` },
      async function (error, result) {
        /** Uploaded? */
        if (error) return res.status(400).json(error);
        /** Create the new product */
        image = result.url;
      });

    await User.updateOne({ _id: req.params.id }, { $set: { ...req.body, image } })
      .then(user => res.json({ success: true }))
      .catch(err => res.status(404).json({ "msg": err }));
  }
}

exports.login = async (req, res) => {
  const { email, password, fbid, goid, tel } = req.body;

  let noEmailORTel = (!(!!email || !!tel) || !password);
  let noFbORGo = (!!fbid || !!goid);

  if (noEmailORTel || noEmailORTel) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  let query;
  if (tel) query = { tel }
  else if (email) query = { email }
  else if (fbid) query = { fbid };
  else query = { goid };

  // Check for existing user
  await User.findOne(query)
    .then(user => {
      if (!user) return res.status(400).json({ msg: 'User Does not exist' });

      // Validate password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
          delete user.password;
          res.json(user);
        })
    })
}


/** Delete user
 * @param { RequestInfo } req
 * @param { Response } res
*/
exports.delete_one = async (req, res) => {
  await User.deleteOne(req.params.id)
    .then(user => {
      res.status(200).json({ success: true })
    })
    .catch(err => res.status(404).json({ "msg": err.message }));

}

/** Delete All
 * @param { RequestInfo } req
 * @param { Response } res
*/
exports.delete_all = async (req, res) => {
  try {
    await User.deleteMany({});
    res.status(200).json({ "msg": "done" });

  } catch (error) {
    res.status(200).json(error);
  }
}
