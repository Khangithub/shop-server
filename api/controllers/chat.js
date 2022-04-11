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
      .populate ({path: 'from', select: '-__v -isActived -password -addressList -cardNumber -zipCode'})
      .populate ({path: 'to', select: '-__v -isActived -password -addressList -cardNumber -zipCode'})
      .populate ({path: 'product', select: '-__v -description -saler -createAt'})
      .exec ();

    let i = 0;
    while (i < conversations.length - 1) {
      if (conversations[i].room === conversations[i + 1].room) {
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
