const Chat = require("../models/chat");

const getChatList = async (req, res) => {
  try {
    const data = await Chat.findOne({ room: req.params.roomId })
      .select("chatList")
      .populate({
        path: "chatList.from",
        select: "_id username avatar",
      })
      .exec();

    const chatList = data === null ? [] : data.chatList;

    return res.status(200).json({ chatList });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

module.exports = {
  getChatList,
};
