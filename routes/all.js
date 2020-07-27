var express = require('express')
var router = express.Router()

const { allProducts } = require('../models/Product_model')
const { upload } = require('../middlewares/upload')

const pro = require('../controllers/product_ctrl')
const auth = require('../middlewares/auth')

/** Get All Products */
router.get('/products/all', async (req, res) => pro.getAllProducts(req, res, allProducts))

/** Get All Products with pagenation */
router.get('/:page', async (req, res) => pro.getWithPagenation(req, res, allProducts))

/** filter with name */
router.post('/filter', async (req, res) => pro.filter(req, res, allProducts))

/** Get one Product */
router.get('/one/:barcode', async (req, res) => pro.getOneProduct(req, res, allProducts))

/** Add Product allProducts */
router.post('/', auth, upload.single('image'), async (req, res) => pro.addProduct(req, res, allProducts))

/** Change Amount */
router.put('/amount', auth, async (req, res) => pro.editProductAmount(req, res, allProducts))

/** Update Product */
router.put('/', auth, upload.single('image'), async (req, res) => pro.editProduct(req, res, allProducts))

/** Delete Product */
router.delete('/:barcode', auth, async (req, res) => pro.deleteOne(req, res, allProducts))

/** Delete all */
router.delete('/products/all', auth, async (req, res) => pro.deleteAll(req, res, allProducts))

module.exports = router
