var express = require('express')
var router = express.Router()

const controller = require('../controllers/order_ctrl')
const auth = require('../middlewares/auth')

router.get('/', auth, controller.getAllOrders)
router.get('/:id', controller.getOneOrder)

router.post('/', controller.addOrder)
router.patch('/:id', auth, controller.editOrder)

router.delete('/:id', controller.deleteOne)
router.delete('/orders/all', auth, controller.deleteAll)

module.exports = router
