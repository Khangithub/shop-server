const Chat = require("../models/chat");

const getMsgList = async (req, res) => {
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

module.exports = {
  getMsgList,
};
