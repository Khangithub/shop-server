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
    const conversations = await Chat.find ({
      room: {$regex: req.params.fromId, $options: 'i'},
    })
      .populate ({path: 'from', select: '-__v'})
      .populate ({path: 'to', select: '-__v'})
      .populate ({path: 'product', select: '-__v -description'})
      .exec ();

    var i = 0;
    while (i < conversations.length - 1) {
      if (
        (conversations[i].to.toString () === conversations[i + 1].to.toString () &&
          conversations[i].from.toString () === conversations[i + 1].from.toString () &&
          conversations[i].product.toString () ===
            conversations[i + 1].product.toString ()) ||
        (conversations[i].from.toString () === conversations[i + 1].to.toString () &&
          conversations[i].from.toString () === conversations[i + 1].to.toString () &&
          conversations[i].product.toString () ===
            conversations[i + 1].product.toString ())
      ) {
        conversations.splice (i, 1);
      } else {
        ++i;
      }
    }

    // conversations.shift ();

    return res.status (200).json ({conversations});
  } catch (err) {
    return res.status (500).json ({err});
  }
};

module.exports = {
  getMsgList,
  getConversation,
};
