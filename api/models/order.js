const {Schema, model} = require('mongoose')

const orderSchema = Schema({
  _id: Schema.Types.ObjectId,
  product: {
    type: Schema.Types.ObjectId,
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
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  orderStatus: {
    type: String,
    require: true,
    enum: ['in-cart', 'shipping', 'paid', 'canceled'],
    default: 'in-cart'
  }
})

module.exports = model('Order', orderSchema)
