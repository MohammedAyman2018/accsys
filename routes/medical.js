var express = require('express')
var router = express.Router()

const { Medical } = require('../models/Product_model')
const { upload } = require('../middlewares/upload')

const pro = require('../controllers/product_ctrl')
const auth = require('../middlewares/auth')

/** Get All Products */
router.get('/products/all', async (req, res) => pro.getAllProducts(req, res, Medical))

/** Get All Products with pagenation */
router.get('/:page', async (req, res) => pro.getWithPagenation(req, res, Medical))

/** filter with name */
router.post('/filter', async (req, res) => pro.filter(req, res, Medical))

/** Get one Product */
router.get('/one/:barcode', async (req, res) => pro.getOneProduct(req, res, Medical))

/** Add Product Medical */
router.post('/', auth, upload.single('image'), (req, res) => pro.addProduct(req, res, Medical))

/** Change Amount */
router.put('/amount', auth, async (req, res) => pro.editProductAmount(req, res, Medical))

/** Update Product */
router.put('/', auth, upload.single('image'), async (req, res) => pro.editProduct(req, res, Medical))

/** Delete Product */
router.delete('/:barcode', auth, async (req, res) => pro.deleteOne(req, res, Medical))

/** Delete all */
router.delete('/products/all', auth, async (req, res) => pro.deleteAll(req, res, Medical))

module.exports = router
