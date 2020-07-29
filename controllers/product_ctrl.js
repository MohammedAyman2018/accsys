const { validate, Product } = require('../models/Product_model')
const { cloudinary } = require('../middlewares/upload')
require('dotenv')

/** Get All Data In a collection
 * @returns { object } All products
 */
exports.getAllProducts = async (req, res) => {
  await Product.find({})
    .then(products => res.status(200).json(products))
    .catch(err => res.status(400).json(err))
}

/**
 * return Product with the same Barcode
 * @param {String} barcode
 */
exports.searchWithBarcode = async (req, res) => {
  const { barcode } = req.params
  await Product.findOne({ barcode })
    .then(product => res.status(200).json(product))
    .catch(err => res.status(400).json(err))
}

/** Get All Data In a collection
 * @returns { object } All products
 */
exports.getAllProductsInCollection = async (req, res) => {
  const collectionName = req.params.collection
  console.log(collectionName)
  await Product.find({ collectionName })
    .then(products => res.status(200).json(products))
    .catch(err => res.status(200).json(err))
}

/** Get All data with pagenation
 * @param { Number } page The page number
 * @returns { object } All products
 */
exports.getWithPagenation = async (req, res) => {
  const perPage = 9
  const page = req.params.page || 1
  const collectionName = req.params.collection

  await Product
    .find({ collectionName })
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(async (err, products) => {
      await Product.countDocuments().exec(function (err, count) {
        if (err) return res.status(200).json({ msg: err })
        res.status(200).json({
          products: products,
          current: page,
          pages: Math.ceil(count / perPage)
        })
      })
    })
}

/** Filter
 * @param { String } name
 * @param { String } barcode
 * @param { ClassDecorator } Product
 */
exports.filter = async (req, res) => {
  const { name, barcode } = req.body
  const collectionName = req.params.collection

  if (name && !barcode) {
    const reg = new RegExp(`^${name}`)
    await Product.find({ collectionName, name: { $regex: reg } })
      .then(products => res.status(200).json(products))
      .catch(err => res.status(400).json({ msg: err.message }))
  } else if (!name && barcode) {
    const reg = new RegExp(`^${barcode}`)
    await Product.find({ collectionName, barcode: { $regex: reg } })
      .then(products => res.status(200).json(products))
      .catch(err => res.status(400).json({ msg: err.message }))
  } else {
    await Product.find({ collectionName, barcode: barcode, name: name })
      .then(products => res.status(200).json(products))
      .catch(err => res.status(400).json({ msg: err.message }))
  }
}

/** Add Products
 * @param { RequestInfo } req
 * @param { Response } res
 * @param { ClassDecorator } Product
 */
exports.addProduct = async (req, res) => {
  console.log(req.body)

  /** Check For Errors */
  const { error } = validate(req.body)
  if (error) return res.status(400).json(error)

  /** Get req.body */
  const collectionName = req.params.collection
  const { barcode, name, price, brand, date, amount } = req.body

  /** Check if the barcaode exists before */
  await Product.findOne({ barcode: barcode })
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
            product = new Product({ barcode, name, price, brand, image: result.url, collectionName, date, amount })

            /** Save the new product */
            await product.save()
            res.status(200).json(product)
          })
      }
    })
    .catch(err => res.status(400).json({ msg: err.message }))
}

/** Edit Product */
exports.editProduct = async (req, res) => {
  console.log(req.body)

  /** Check For Errors */
  const { error } = validate(req.body)
  if (error) return res.status(400).json(error)

  /** Get req.body */
  const collectionName = req.params.collection
  const { barcode, name, price, brand, date, amount } = req.body

  /** Get Product */
  await Product.findOne({ barcode })
    .then(async product => {
      if (!product) return res.status(400).json({ msg: 'There is No product with this barcode' })

      const update = {
        barcode,
        name,
        price,
        brand,
        image: product.image,
        collectionName,
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

      if (req.body.collectionName) {
        update.collectionName = req.body.collectionName
      }

      /** Get the product and update it */
      await Product.findOneAndUpdate({ collectionName: update.collectionName, barcode }, { $set: update }, { new: true }, (err, product) => {
        if (err) res.status(400).json({ success: false })
        res.status(200).json(product)
      })
    }).catch(err => res.status(400).json({ msg: err.message }))
}

/** Change product Amount
 * @param { String } barcode
 * @param { Number } amount
 */
exports.editProductAmount = async (req, res) => {
  /** Get req.body */
  const { barcode, amount } = req.body
  const collectionName = req.params.collection

  /** Check if sold out */
  await Product.findOne({ collectionName, barcode })
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
exports.deleteOne = async (req, res) => {
  const barcode = req.params.barcode
  const collectionName = req.params.collection

  await Product.deleteOne({ collectionName, barcode })
    .then(result => res.status(200).json(result))
    .catch(err => res.status(400).json({ success: false }))
}

/** Delete All
*/
exports.deleteAll = async (req, res) => {
  const collectionName = req.params.collection

  await Product.deleteMany({ collectionName })
    .then(() => {
      res.status(200).json({ msg: 'done' })
    })
    .catch(err => res.status(400).json({ msg: err.message }))
}
