var express = require('express')
var router = express.Router()

const controller = require('../controllers/order_ctrl')
const auth = require('../middlewares/auth')

router.get('/', auth, controller.getAllOrders)
router.get('/:id', auth, controller.getOneOrder)

router.post('/', auth, controller.addOrder)
router.patch('/:id', auth, controller.editOrder)

router.delete('/:id', auth, controller.deleteOne)
router.delete('/orders/all', auth, controller.deleteAll)

module.exports = router
