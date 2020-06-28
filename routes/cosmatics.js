var express = require('express')
var router = express.Router()

const { Cosmatics } = require('../models/Product_model')
const { upload } = require('../middlewares/upload')

const pro = require('../controllers/product_ctrl')

/** Get All Products */
router.get('/products/all', async (req, res) => pro.getAllProducts(req, res, Cosmatics))

/** Get All Products with pagenation */
router.get('/:page', async (req, res) => pro.getWithPagenation(req, res, Cosmatics))

/** filter with name */
router.post('/filter', async (req, res) => pro.filter(req, res, Cosmatics))

/** Get one Product */
router.get('/one/:barcode', async (req, res) => pro.getOneProduct(req, res, Cosmatics))

/** Add Product Cosmatics */
router.post('/', upload.single('image'), async (req, res) => pro.addProduct(req, res, Cosmatics))

/** Change Amount */
router.put('/amount', async (req, res) => pro.editProductAmount(req, res, Cosmatics))

/** Update Product */
router.put('/', upload.single('image'), async (req, res) => pro.editProduct(req, res, Cosmatics))

/** Delete Product */
router.delete('/:barcode', async (req, res) => pro.deleteOne(req, res, Cosmatics))

/** Delete all */
router.delete('/products/all', async (req, res) => pro.deleteAll(req, res, Cosmatics))

module.exports = router
