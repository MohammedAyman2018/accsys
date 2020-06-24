var express = require('express');
var router = express.Router();

const { Papers } = require("../models/product_model");
const { upload } = require('../middlewares/upload')

const pro = require('../controllers/product_ctrl');

/** Get All Products */
router.get('/products/all', async (req, res) => pro.get_all_products(req, res, Papers));

/** Get All Products with pagenation */
router.get('/:page', async (req, res) => pro.get_with_pagenation(req, res, Papers));

/** filter with name */
router.post('/filter', async (req, res) => pro.filter(req, res, Papers));

/** Get one Product */
router.get('/one/:barcode', async (req, res) => pro.get_one_product(req, res, Papers));

/** Add Product Papers */
router.post('/', upload.single('image'), (req, res) => pro.add_product(req, res, Papers));

/** Change Amount */
router.put('/amount', async (req, res) => pro.edit_product_amount(req, res, Papers));

/** Update Product */
router.put('/', upload.single('image'), async (req, res) => pro.edit_product(req,res, Papers));

/** Delete Product */
router.delete('/:barcode', async (req, res) => pro.delete_one(req, res, Papers))

/** Delete all */
router.delete('/products/all', async (req, res) => pro.delete_all(req, res, Papers))

module.exports = router;
