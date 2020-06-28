var express = require('express')
var router = express.Router()

const { Papers } = require('../models/Product_model')
const { upload } = require('../middlewares/upload')

const pro = require('../controllers/product_ctrl')

/** Get All Products */
router.get('/products/all', async (req, res) => pro.getAllProducts(req, res, Papers))

/** Get All Products with pagenation */
router.get('/:page', async (req, res) => pro.getWithPagenation(req, res, Papers))

/** filter with name */
router.post('/filter', async (req, res) => pro.filter(req, res, Papers))

/** Get one Product */
router.get('/one/:barcode', async (req, res) => pro.getOneProduct(req, res, Papers))

/** Add Product Papers */
router.post('/', upload.single('image'), (req, res) => pro.addProduct(req, res, Papers))

/** Change Amount */
router.put('/amount', async (req, res) => pro.editProductAmount(req, res, Papers))

/** Update Product */
router.put('/', upload.single('image'), async (req, res) => pro.editProduct(req, res, Papers))

/** Delete Product */
router.delete('/:barcode', async (req, res) => pro.deleteOne(req, res, Papers))

/** Delete all */
router.delete('/products/all', async (req, res) => pro.deleteAll(req, res, Papers))

module.exports = router
