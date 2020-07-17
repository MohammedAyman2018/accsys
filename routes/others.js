var express = require('express')
var router = express.Router()

const { Others } = require('../models/Product_model')
const { upload } = require('../middlewares/upload')

const pro = require('../controllers/product_ctrl')
const auth = require('../middlewares/auth')

/** Get All Products */
router.get('/products/all', async (req, res) => pro.getAllProducts(req, res, Others))

/** Get All Products with pagenation */
router.get('/:page', async (req, res) => pro.getWithPagenation(req, res, Others))

/** filter with name */
router.post('/filter', async (req, res) => pro.filter(req, res, Others))

/** Get one Product */
router.get('/one/:barcode', async (req, res) => pro.getOneProduct(req, res, Others))

/** Add Product Others */
router.post('/', auth, upload.single('image'), (req, res) => pro.addProduct(req, res, Others))

/** Change Amount */
router.put('/amount', auth, async (req, res) => pro.editProductAmount(req, res, Others))

/** Update Product */
router.put('/', auth, upload.single('image'), async (req, res) => pro.editProduct(req, res, Others))

/** Delete Product */
router.delete('/:barcode', auth, async (req, res) => pro.deleteOne(req, res, Others))

/** Delete all */
router.delete('/products/all', auth, async (req, res) => pro.deleteAll(req, res, Others))

module.exports = router
