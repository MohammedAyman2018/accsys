const { Order } = require('../models/Order_model')

exports.getAllOrders = async (req, res) => {
  await Order.find({})
    .then(orders => res.status(200).json(orders))
    .catch(err => res.status(400).json(err))
}

exports.getOneOrder = async (req, res) => {
  await Order.findById(req.params.id)
    .then(order => res.status(200).json(order))
    .catch(err => res.status(400).json(err))
}

exports.addOrder = async (req, res) => {
  const { by, products, total } = req.body
  if (!by || !products) return res.status(400).json({ msg: 'There is missing data' })
  await Order.findOne({ 'by.email': by.email })
    .then(async existingOrder => {
      if (!existingOrder || existingOrder.delivery) {
        const order = new Order({ by, products, total })
        await order.save()
          .then(order => res.status(200).json(order))
          .catch(err => res.status(400).json(err.message))
      } else {
        // res.send(existingOrder)
        existingOrder.products.push(...products)
        existingOrder.total.push(...total)
        await existingOrder.save()
          .then(order => res.status(200).json(order))
          .catch(err => res.status(400).json(err.message))
      }
    })
}

/** Edit Order */
exports.editOrder = async (req, res) => {
  await Order.findById(req.params.id)
    .then(async order => {
      if (!order) res.status(400).json({ msg: 'Order Not Found' })
      // eslint-disable-next-line no-extra-boolean-cast
      else {
        await Order.updateOne({ _id: req.params.id }, { $set: { ...req.body } }, (err, order) => {
          if (err) res.status(404).json({ msg: err })
          res.json(order)
        })
      }
    })
}

/** Delete user
 * @param { String } id Order _id
*/
exports.deleteOne = async (req, res) => {
  await Order.deleteOne({ _id: req.params.id })
    .then(order => res.status(200).json(order))
    .catch(err => res.status(404).json({ msg: err.message }))
}

/** Delete All */
exports.deleteAll = async (req, res) => {
  try {
    await Order.deleteMany({})
    res.status(200).json({ msg: 'done' })
  } catch (error) {
    res.status(200).json(error)
  }
}
