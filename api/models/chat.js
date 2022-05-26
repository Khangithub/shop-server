const { Schema, model } = require("mongoose");

const chatSchema = Schema({
  chatList: [
    {
      from: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      createdAt: {
        type: String,
        required: true,
      },
      mediaList: [
        {
          filename: { type: String },
          mimetype: { type: String },
        },
      ],
    },
  ],
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    require: true,
  },
  room: {
    type: String,
    required: true,
  },
});

module.exports = model("Chat", chatSchema);
