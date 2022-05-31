const { Schema, model } = require("mongoose");

const commentSchema = Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  commentator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  mainComment: {
    type: String,
  },
  published: {
    type: Date,
  },
  edited: {
    type: Boolean,
    required: true,
    default: false,
  },
  subComment: [
    {
      sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      content: {
        type: String,
      },
      receiver: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      published: {
        type: Date,
      },
      mediaList: [
        {
          filename: { type: String },
          mimetype: { type: String },
        },
      ],
    },
  ],
  mediaList: [
    {
      filename: { type: String },
      mimetype: { type: String },
    },
  ],
});

module.exports = model("Comment", commentSchema);
