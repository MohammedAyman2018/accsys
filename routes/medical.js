var express = require('express');
var router = express.Router();

const { Medical } = require("../models/product_model");
const { upload } = require('../middlewares/upload')

const pro = require('../controllers/product_ctrl');

/** Get All Products */
router.get('/products/all', async (req, res) => pro.get_all_products(req, res, Medical));

/** Get All Products with pagenation */
router.get('/:page', async (req, res) => pro.get_with_pagenation(req, res, Medical));

/** filter with name */
router.post('/filter', async (req, res) => pro.filter(req, res, Medical));

/** Get one Product */
router.get('/one/:barcode', async (req, res) => pro.get_one_product(req, res, Medical));

/** Add Product Medical */
router.post('/', upload.single('image'), (req, res) => pro.add_product(req, res, Medical));

/** Change Amount */
router.put('/amount', async (req, res) => pro.edit_product_amount(req, res, Medical));

/** Update Product */
router.put('/', upload.single('image'), async (req, res) => pro.edit_product(req, res, Medical));

/** Delete Product */
router.delete('/:barcode', async (req, res) => pro.delete_one(req, res, Medical))

/** Delete all */
router.delete('/products/all', async (req, res) => pro.delete_all(req, res, Medical))

module.exports = router;
