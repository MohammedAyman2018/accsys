var express = require('express')
var router = express.Router()

const { Makups } = require('../models/Product_model')
const { upload } = require('../middlewares/upload')

const pro = require('../controllers/product_ctrl')

/** Get All Products */
router.get('/products/all', async (req, res) => pro.get_all_products(req, res, Makups))

/** Get All Products with pagenation */
router.get('/:page', async (req, res) => pro.get_with_pagenation(req, res, Makups))

/** filter with name */
router.post('/filter', async (req, res) => pro.filter(req, res, Makups))

/** Get one Product */
router.get('/one/:barcode', async (req, res) => pro.get_one_product(req, res, Makups))

/** Add Product Makups */
router.post('/', upload.single('image'), (req, res) => pro.add_product(req, res, Makups))

/** Change Amount */
router.put('/amount', async (req, res) => pro.edit_product_amount(req, res, Makups))

/** Update Product */
router.put('/', upload.single('image'), async (req, res) => pro.edit_product(req, res, Makups))

/** Delete Product */
router.delete('/:barcode', async (req, res) => pro.delete_one(req, res, Makups))

/** Delete all */
router.delete('/products/all', async (req, res) => pro.delete_all(req, res, Makups))

module.exports = router
