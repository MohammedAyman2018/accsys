var express = require('express')
var router = express.Router()

const { Cosmatics } = require('../models/Product_model')
const { upload } = require('../middlewares/upload')

const pro = require('../controllers/product_ctrl')

/** Get All Products */
router.get('/products/all', async (req, res) => pro.get_all_products(req, res, Cosmatics))

/** Get All Products with pagenation */
router.get('/:page', async (req, res) => pro.get_with_pagenation(req, res, Cosmatics))

/** filter with name */
router.post('/filter', async (req, res) => pro.filter(req, res, Cosmatics))

/** Get one Product */
router.get('/one/:barcode', async (req, res) => pro.get_one_product(req, res, Cosmatics))

/** Add Product Cosmatics */
router.post('/', upload.single('image'), async (req, res) => pro.add_product(req, res, Cosmatics))

/** Change Amount */
router.put('/amount', async (req, res) => pro.edit_product_amount(req, res, Cosmatics))

/** Update Product */
router.put('/', upload.single('image'), async (req, res) => pro.edit_product(req, res, Cosmatics))

/** Delete Product */
router.delete('/:barcode', async (req, res) => pro.delete_one(req, res, Cosmatics))

/** Delete all */
router.delete('/products/all', async (req, res) => pro.delete_all(req, res, Cosmatics))

module.exports = router
