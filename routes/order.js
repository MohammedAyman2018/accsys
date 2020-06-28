var express = require('express')
var router = express.Router()

const controller = require('../controllers/order_ctrl')

router.get('/all', controller.getAllOrders)
router.get('/:id', controller.getAllOrders)

router.post('/', controller.addOrder)
router.patch('/:id', controller.editOrder)

router.delete('/:id', controller.deleteOne)
router.delete('/orders/all', controller.deleteAll)

module.exports = router
