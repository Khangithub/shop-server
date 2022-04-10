const Chat = require ('../models/chat');

const getMsgList = async (req, res) => {
  try {
    const curMsgList = await Chat.find ({room: req.params.roomId}).exec ();
    return res.status (200).json ({curMsgList});
  } catch (err) {
    return res.status (500).json ({err});
  }
};

const getConversation = async (req, res) => {
  try {
    const chatList = await Chat.find ({
      room: {$regex: req.params.fromId, $options: 'i'},
    })
      .populate ({path: 'from', select: '-__v'})
      .populate ({path: 'to', select: '-__v'})
      .populate ({path: 'product', select: '-__v -description'})
      .exec ();

    var i = 0;
    while (i < chatList.length - 1) {
      if (
        (chatList[i].to.toString () === chatList[i + 1].to.toString () &&
          chatList[i].from.toString () === chatList[i + 1].from.toString ()) ||
        (chatList[i].from.toString () === chatList[i + 1].to.toString () &&
          chatList[i].from.toString () === chatList[i + 1].to.toString ())
      ) {
        chatList.splice (i, 1);
      } else {
        ++i;
      }
    }

    // chatList.shift ();

    return res.status (200).json ({chatList});
  } catch (err) {
    return res.status (500).json ({err});
  }
};

module.exports = {
  getMsgList,
  getConversation,
};
