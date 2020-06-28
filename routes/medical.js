var express = require('express')
var router = express.Router()

const { Medical } = require('../models/Product_model')
const { upload } = require('../middlewares/upload')

const pro = require('../controllers/product_ctrl')

/** Get All Products */
router.get('/products/all', async (req, res) => pro.getAllProducts(req, res, Medical))

/** Get All Products with pagenation */
router.get('/:page', async (req, res) => pro.getWithPagenation(req, res, Medical))

/** filter with name */
router.post('/filter', async (req, res) => pro.filter(req, res, Medical))

/** Get one Product */
router.get('/one/:barcode', async (req, res) => pro.getOneProduct(req, res, Medical))

/** Add Product Medical */
router.post('/', upload.single('image'), (req, res) => pro.addProduct(req, res, Medical))

/** Change Amount */
router.put('/amount', async (req, res) => pro.editProductAmount(req, res, Medical))

/** Update Product */
router.put('/', upload.single('image'), async (req, res) => pro.editProduct(req, res, Medical))

/** Delete Product */
router.delete('/:barcode', async (req, res) => pro.deleteOne(req, res, Medical))

/** Delete all */
router.delete('/products/all', async (req, res) => pro.deleteAll(req, res, Medical))

module.exports = router
