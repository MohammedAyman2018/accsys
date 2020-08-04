var express = require('express')
var router = express.Router()

const { upload } = require('../middlewares/upload')
const auth = require('../middlewares/auth')

const {
  getAllProducts,
  searchWithBarcode,
  getAllProductsInCollection,
  getWithPagenation,
  getOneProduct,
  filter,
  addProduct,
  editProductAmount,
  editProduct,
  deleteOne,
  deleteAll
} = require('../controllers/product_ctrl')

/** Get All Products */
router.get('/', getAllProducts)

/** Get search with barcode */
router.get('/barcode/:barcode', searchWithBarcode)

/** Get product with  */
router.get('/one/:barcode', getOneProduct)

/** Get All Products in collection */
router.get('/:collection/products/all', getAllProductsInCollection)

/** Get Products with pagenation */
router.get('/:collection/:page', getWithPagenation)

/** filter with name */
router.post('/:collection/filter', filter)

/** Add Product */
router.post('/:collection/', auth, upload.single('image'), addProduct)

/** Change Amount */
router.put('/:collection/amount', editProductAmount)

/** Update Product */
router.put('/:collection/', auth, upload.single('image'), editProduct)

/** Delete Product */
router.delete('/:collection/:barcode', auth, deleteOne)

/** Delete all */
router.delete('/:collection/products/all', auth, deleteAll)

module.exports = router
