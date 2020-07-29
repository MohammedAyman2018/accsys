var express = require('express')
var router = express.Router()

const { upload } = require('../middlewares/upload')

const {
  getAllProducts,
  getWithPagenation,
  filter,
  getOneProduct,
  addProduct,
  editProductAmount,
  editProduct,
  deleteOne,
  deleteAll
} = require('../controllers/product_ctrl')
const auth = require('../middlewares/auth')

/** Get All Products */
router.get('/:collection/products/all', getAllProducts)

/** Get All Products with pagenation */
router.get('/:collection/:page', getWithPagenation)

/** filter with name */
router.post('/:collection/filter', filter)

/** Get one Product */
router.get('/:collection/one/:barcode', getOneProduct)

/** Add Product Medical */
router.post('/:collection/', auth, upload.single('image'), addProduct)

/** Change Amount */
router.put('/:collection/amount', auth, editProductAmount)

/** Update Product */
router.put('/:collection/', auth, upload.single('image'), editProduct)

/** Delete Product */
router.delete('/:collection/:barcode', auth, deleteOne)

/** Delete all */
router.delete('/:collection/products/all', auth, deleteAll)

module.exports = router
