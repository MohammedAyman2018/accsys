const
  { validate, validateUpdate } = require('../models/Product_model')
const cloudinary = require('cloudinary').v2
require('dotenv')

cloudinary.config({
  cloud_name: process.env.cloudinary_cloud_name,
  api_key: process.env.cloudinary_api_key,
  api_secret: process.env.cloudinary_api_secret
})

/** Get All Data
 * @returns { object } All products
 */
exports.getAllProducts = async (req, res, theClass) => {
  await theClass.find({})
    .then(products => res.status(200).json(products))
    .catch(err => res.status(200).json(err))
}

/** Get All data with pagenation
 * @param { Number } page The page number
 * @returns { object } All products
 */
exports.getWithPagenation = async (req, res, theClass) => {
  var perPage = 9
  var page = req.params.page || 1

  await theClass
    .find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(async (err, products) => {
      await theClass.countDocuments().exec(function (err, count) {
        if (err) return res.status(200).json({ msg: err })
        res.status(200).json({
          products: products,
          current: page,
          pages: Math.ceil(count / perPage)
        })
      })
    })
}

/** Get one product
 * @param { Number } barcode
 * @returns { object } The product
 */
exports.getOneProduct = async (req, res, theClass) => {
  await theClass.findOne({ barcode: req.params.barcode })
    .then(async product => {
      if (!product) return res.status(400).json({ msg: 'There is no product.' })
      res.status(200).json({
        product: product,
        samilier: await theClass.find({ brand: product.brand }).limit(9)
      })
    })
    .catch(err => {
      console.log({ msg: err.message })
      res.status(400).json({ msg: err.message })
    })
}

/** Filter
 * @param { String } name
 * @param { String } barcode
 * @param { ClassDecorator } theClass
 */
exports.filter = async (req, res, theClass) => {
  const { name, barcode } = req.body

  if (name && !barcode) {
    const reg = new RegExp(`^${name}`)
    await theClass.find({ name: { $regex: reg } })
      .then(products => res.status(200).json(products))
      .catch(err => res.status(400).json({ msg: err.message }))
  } else if (!name && barcode) {
    const reg = new RegExp(`^${barcode}`)
    await theClass.find({ barcode: { $regex: reg } })
      .then(products => res.status(200).json(products))
      .catch(err => res.status(400).json({ msg: err.message }))
  } else {
    await theClass.find({ barcode: barcode, name: name })
      .then(products => res.status(200).json(products))
      .catch(err => res.status(400).json({ msg: err.message }))
  }
}

/** Add Products
 * @param { RequestInfo } req
 * @param { Response } res
 * @param { ClassDecorator } theClass
 */
exports.addProduct = async (req, res, theClass) => {
  console.log(req.body)

  /** Check For Errors */
  const { error } = validate(req.body)
  if (error) return res.status(400).json(error)

  /** Get req.body */
  const { barcode, name, price, brand, date, amount } = req.body

  /** Check if the barcaode exists before */
  await theClass.findOne({ barcode: barcode })
    .then(async productWithSameBarcode => {
      /** Existed */
      if (productWithSameBarcode) return res.status(400).json({ msg: 'existed Before' })
      /** Not Existed */
      else {
        let product
        await cloudinary.uploader.upload(req.file.path,
          { resource_type: 'auto', folder: 'accsys' },
          async function (error, result) {
            /** Uploaded? */
            if (error) return res.status(400).json(error)
            /** Create the new product */
            product = Reflect.construct(theClass, [{ barcode, name, price, brand, image: result.url, date, amount }])

            /** Save the new product */
            await product.save()
            res.status(200).json(product)
          })
      }
    })
    .catch(err => res.status(400).json({ msg: err.message }))
}

/** Edit Product */
exports.editProduct = async (req, res, theClass) => {
  console.log(req.body)

  /** Check For Errors */
  const { error } = validateUpdate(req.body)
  if (error) return res.status(400).json(error)

  /** Get req.body */
  const { newBarcode, oldBarcode, name, price, brand, date, amount } = req.body

  /** Check if the new oldBarcode is existed before */
  if (newBarcode) {
    const existedBefore = await theClass.findOne({ barcode: newBarcode })
    if (existedBefore) return res.status(400).json({ msg: 'newBarcode existed Before' })
  };

  /** Get Product */
  await theClass.findOne({ barcode: oldBarcode })
    .then(async product => {
      if (!product) return res.status(400).json({ msg: 'There is No product with this oldBarcode' })

      const update = {
        barcode: (newBarcode) || oldBarcode,
        name,
        price,
        brand,
        image: product.image,
        date,
        amount
      }

      /** Set Update */
      if (req.file) {
        await cloudinary.uploader.upload(req.file.path,
          { resource_type: 'auto', folder: 'accsys' },
          async function (error, result) {
            if (error) return res.status(400).json(error)
            update.image = result.url
          })
      }

      /** Get the product and update it */
      await theClass.findOneAndUpdate({ barcode: oldBarcode }, { $set: update }, { new: true }, (err, product) => {
        if (err) res.status(400).json({ success: false })
        res.status(200).json(product)
      })
    }).catch(err => res.status(400).json({ msg: err.message }))
}

/** Change product Amount
 * @param { String } barcode
 * @param { Number } amount
 */
exports.editProductAmount = async (req, res, theClass) => {
  /** Get req.body */
  const { barcode, amount } = req.body

  /** Check if sold out */
  await theClass.findOne({ barcode })
    .then(async product => {
      if (amount < 0 && (product.amount + Number(amount)) < 0) return res.status(400).json({ msg: "Can't sell all this amount" })

      product.amount += Number(amount)

      /** Save new Item */
      await product.save()
      res.status(200).json(product)
    })
    .catch(err => res.status(400).json({ msg: err.message }))
}

/** Delete Product
 * @param { String } barcode
*/
exports.deleteOne = async (req, res, theClass) => {
  const id = req.params.id
  /** Get the product and update it */
  await theClass.findOneAndDelete({ id }, (err, product) => {
    if (err) res.status(400).json({ success: false })
    // cloudinary.uploader.destroy(public_id, options, callback);

    res.status(200).json({ msg: 'Deleted Successfuly' })
  })
}

/** Delete All
*/
exports.deleteAll = async (req, res, theClass) => {
  await theClass.deleteMany({})
    .then(() => {
      res.status(200).json({ msg: 'done' })
    })
    .catch(err => res.status(400).json({ msg: err.message }))
}
