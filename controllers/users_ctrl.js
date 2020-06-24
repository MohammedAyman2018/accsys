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
 * @param { RequestInfo } req
 * @param { Response } res
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

  let user = new User({ name, tel, password, adress, image, email, fbid, goid, city });

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

          jwt.sign({ id: user._id }, process.env.jwtSecret, { expiresIn: 3600 }, (err, token) => {
            if (err) return res.status(400).json(err);

            res.status(200).json({
              token,
              user: {
                userid: user.userid,
                id: user.id,
                admin: user.admin,
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                lang: user.lang,
              }
            });
          });
        })
        .catch(err => {
          res.status(400).json(err)
        });
    })
  })


};

/** Edit user */
exports.edit_user = async (req, res) => {
  if (!req.file) {
    console.log(req.file);
    await User.updateOne({ _id: req.params.id }, { $set: req.body })
      .then(user => res.json({ success: true }))
      .catch(err => res.status(404).json({ success: false }));
  } else {
    let image;
    console.log(req.file.path);

    await cloudinary.uploader.upload(req.file.path,
      { resource_type: "auto", folder: "accsys", public_id: `user-${req.params.id}` },
      async function (error, result) {
        /** Uploaded? */
        if (error) return res.status(400).json(error);
        /** Create the new product */
        image = result.url;
      });
    console.log(image);

    await User.updateOne({ _id: req.params.id }, { $set: { ...req.body, image } })
      .then(user => res.json({ success: true }))
      .catch(err => res.status(404).json({ success: false }));
  }
}

exports.login = async (req, res) => {
  const { email, password, tel } = req.body;

  console.log(req.body);
  console.log(!(!!email || !!tel));

  if (!(!!email || !!tel) || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  let query;
  if (tel) query = { tel }
  else if (email) query = { email }

  // Check for existing user
  await User.findOne(query)
    .then(user => {
      if (!user) return res.status(400).json({ msg: 'User Does not exist' });

      // Validate password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

          jwt.sign(
            { id: user._id },
            process.env.jwtSecret,
            { expiresIn: 36000 },
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                user: {
                  name: user.name,
                  tel: user.tel,
                  adress: user.adress,
                  image: user.image,
                  email: user.email,
                  fbid: user.fbid,
                  goid: user.goid,
                  city: user.city,
                  admin: user.admin,
                  superAdmin: user.superAdmin
                }
              });
            }
          )
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
