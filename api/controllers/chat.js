const Chat = require ('../models/chat');

const getChatList = async (req, res) => {
  try {
    const curMsgList = await Chat.find ({room: req.params.roomId}).exec ();
    return res.status (200).json ({curMsgList});
  } catch (err) {
    return res.status (500).json ({err});
  }
};

module.exports = {
  getChatList,
};
