const { Schema, model } = require("mongoose");

const chatSchema = Schema({
  room: {
    type: String,
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    require: true,
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  updatedAt: {
    type: Date,
  },
  messages: [
    {
      from: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      content: {
        type: String,
      },
      createdAt: {
        type: Date,
      },
      type: {
        type: String,
        enum: ["text", "media"],
        default: "text",
      },
      mediaList: [
        {
          filename: { type: String },
          mimetype: { type: String },
        },
      ],
    },
  ],
});

module.exports = model("Chat", chatSchema);
