const mongoose = require('mongoose')
const moment = require('moment-timezone');
const dateVietNam = moment.tz(Date.now(), "Asia/Ho_Chi_Minh");

const commentSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  commentator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true
  },
  mainComment: {
    type: String,
    required: true
  },
  published: {
    type: Date,
    default: dateVietNam
  },
  subComment: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      content: {
        type: String
      },
      receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      published: {
        type: Date,
        default: dateVietNam
      }
    }
  ]
})

const order = mongoose.model('Comment', commentSchema)

module.exports = order
