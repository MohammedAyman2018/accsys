var express = require('express')
var router = express.Router()

const { Cosmatics } = require('../models/Product_model')
const { upload } = require('../middlewares/upload')

const pro = require('../controllers/product_ctrl')
const auth = require('../middlewares/auth')

/** Get All Products */
router.get('/products/all', async (req, res) => pro.getAllProducts(req, res, Cosmatics))

/** Get All Products with pagenation */
router.get('/:page', async (req, res) => pro.getWithPagenation(req, res, Cosmatics))

/** filter with name */
router.post('/filter', async (req, res) => pro.filter(req, res, Cosmatics))

/** Get one Product */
router.get('/one/:barcode', async (req, res) => pro.getOneProduct(req, res, Cosmatics))

/** Add Product Cosmatics */
router.post('/', auth, upload.single('image'), async (req, res) => pro.addProduct(req, res, Cosmatics))

/** Change Amount */
router.put('/amount', auth, async (req, res) => pro.editProductAmount(req, res, Cosmatics))

/** Update Product */
router.put('/', auth, upload.single('image'), async (req, res) => pro.editProduct(req, res, Cosmatics))

/** Delete Product */
router.delete('/:barcode', auth, async (req, res) => pro.deleteOne(req, res, Cosmatics))

/** Delete all */
router.delete('/products/all', auth, async (req, res) => pro.deleteAll(req, res, Cosmatics))

module.exports = router
