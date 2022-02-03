const mongoose = require('mongoose')

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  published: {
    type: Date,
    default: Date.now()
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true
  }
})

const order = mongoose.model('Order', orderSchema)

module.exports = order
