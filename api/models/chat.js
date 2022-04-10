const {Schema, model} = require ('mongoose');

const chatSchema = Schema ({
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    require: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    require: true,
  },
  msg: {
    type: String,
    required: true,
  },
  createdAt: {
    formatedTime: {
      type: String,
      require: true,
    },
    formatedDate: {
      type: String,
      require: true,
    },
  },
  room: {
    type: String,
    required: true,
  },
  mediaList: [
    {
      filename: {type: String},
      mimetype: {type: String},
    },
  ],
});

module.exports = model ('Chat', chatSchema);
