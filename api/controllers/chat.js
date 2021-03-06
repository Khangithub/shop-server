const Chat = require("../models/chat");

const getMsgs = async (req, res) => {
  try {
    const data = await Chat.findOne({ room: req.params.roomId })
      .select("messages")
      .populate({
        path: "messages.from",
        select: "_id username avatar",
      })
      .exec();

    const msgs = data === null ? [] : data.messages;

    return res.status(200).json({ msgs });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const getBuyerChats = async (req, res) => {
  try {
    const { userId } = req.params;

    const chats = await Chat.find(
      { buyer: userId },
      { messages: { $slice: -1 } }
    )
      .populate({
        path: "product",
        select: "_id name productImage saler",
        populate: {
          path: "saler",
          select: "_id username",
        },
      })
      .populate({
        path: "messages.from",
        select: "_id username",
      })
      .populate({
        path: "buyer",
        select: "_id username avatar",
      })
      .sort({ updatedAt: "desc" })
      .exec();
    return res.status(200).json({ chats });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const getSalemanChats = async (req, res) => {
  try {
    const { userId } = req.params;
    const chats = await Chat.find(
      { room: { $regex: new RegExp(userId) } },
      { messages: { $slice: -1 } }
    )
      .populate({
        path: "product",
        select: "_id name productImage saler",
        populate: {
          path: "saler",
          select: "_id username",
        },
      })
      .populate({
        path: "messages.from",
        select: "_id username",
      })
      .populate({
        path: "buyer",
        select: "_id username avatar",
      })
      .sort({ updatedAt: "desc" })
      .exec();

    return res.status(200).json({ chats });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

module.exports = {
  getMsgs,
  getBuyerChats,
  getSalemanChats,
};
