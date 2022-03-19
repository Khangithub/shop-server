const path = require ('path');
const Comment = require ('../models/comment');
const LIMIT = 6;
const PAGE_INDEX = 1;

const addCmt = async (req, res) => {
  try {
    const {product, mainComment} = req.body;

    const mediaList = req.files.map (({filename, mimetype}) => ({
      filename: process.env.DOMAIN + 'comments/media/' + filename,
      mimetype,
    }));

    const commentator = req.currentUser;

    const newCmt = new Comment ({
      product,
      mainComment,
      commentator,
      mediaList,
    });

    const doc = await newCmt.save ();

    return res.status (200).json ({doc, message: 'updated'});
  } catch (err) {
    return res.status (500).json ({err});
  }
};

const getProductCmts = async (req, res) => {
  try {
    const {productId} = req.params;
    const pageIndex = req.params.pageIndex
      ? parseInt (req.params.pageIndex)
      : PAGE_INDEX;
    const limit = req.params.limit ? parseInt (req.params.limit) : LIMIT;
    const skip = (pageIndex - 1) * limit;

    const cmtList = await Comment.find ({
      product: {
        _id: productId,
      },
    })
      .populate ({
        path: 'product',
        select: '_id name',
        populate: {
          path: 'saler',
          select: '_id username avatar',
        },
      })
      .populate ({path: 'commentator', select: '_id username avatar'})
      .populate ({
        path: 'subComment.sender',
        select: '_id username avatar',
      })
      .populate ({
        path: 'subComment.receiver',
        select: '_id username avatar',
      })
      .skip (skip)
      .limit (limit)
      .exec ();

    return res.status (200).json ({cmtList});
  } catch (err) {
    return res.status (500).json ({err});
  }
};

const editCmt = async (req, res) => {
  try {
    const {commentId} = req.params;
    const {mainComment} = req.body;
    const mediaList = req.files.map (({filename, mimetype}) => ({
      filename: process.env.DOMAIN + 'comments/media/' + filename,
      mimetype,
    }));

    if (mediaList.length > 0) {
      await Comment.findByIdAndUpdate (commentId, {
        $set: {mainComment, mediaList, edited: true},
      }).exec ();
      return res
        .status (200)
        .json ({message: 'edited', mediaList, mainComment});
    } else {
      await Comment.findByIdAndUpdate (commentId, {
        $set: {mainComment, edited: true},
      }).exec ();
      return res.status (200).json ({message: 'edited', mainComment});
    }
  } catch (err) {
    return res.status (500).json ({err});
  }
};

const getCmt = (req, res, next) => {
  const {commentId} = req.params;
  Comment.findById (commentId)
    .exec ()
    .then (doc => {
      return res.status (200).json ({doc});
    })
    .catch (error => console.log (error));
};

const delCmt = async (req, res) => {
  try {
    const {commentId} = req.params;
    await Comment.findByIdAndDelete (commentId).exec ();
    return res.status (200).json ({message: 'deleted', commentId});
  } catch (err) {
    return res.status (500).json ({err});
  }
};

const repCmt = async (req, res) => {
  try {
    const {commentId} = req.params;
    const {content, receiver} = req.body;

    const mediaList = req.files.map (({filename, mimetype}) => ({
      filename: process.env.DOMAIN + 'comments/media/' + filename,
      mimetype,
    }));

    await Comment.findByIdAndUpdate (commentId, {
      $push: {
        subComment: {content, sender: req.currentUser._id, receiver, mediaList},
      },
    });

    const newCmt = await Comment.findOne ({
      _id: commentId,
      'subComment.content': content,
      'subComment.sender': req.currentUser._id,
      'subComment.receiver': receiver,
    })
      .populate ({
        path: 'subComment.sender',
        select: '_id username avatar',
      })
      .populate ({
        path: 'subComment.receiver',
        select: '_id username avatar',
      })
      .exec ();

    const doc = newCmt.subComment.slice (-1).pop ();
    return res.status (200).json ({doc, message: 'updated'});
  } catch (err) {
    return res.status (500).json ({err});
  }
};

const editRep = async (req, res) => {
  try {
    const {commentId} = req.params;
    const {newContent} = req.body;

    await Comment.updateOne (
      {'subComment._id': commentId},
      {
        $set: {
          'subComment.$.content': newContent,
        },
      }
    ).exec ();
    return res.status (200).json ({message: 'updated', newContent});
  } catch (err) {
    return res.status (500).json ({err});
  }
};

const getCmtMedia = (req, res) => {
  const {filename} = req.params;
  if (!filename) {
    return res.status (500).json ({
      message: 'no filename specified',
    });
  }
  res.sendFile (path.resolve (`./media/${filename}`));
};

const delRep = async (req, res) => {
  try {
    const {commentId} = req.params;
    const {repId} = req.body;

    await Comment.findByIdAndUpdate (
      {_id: commentId},
      {
        $pull: {subComment: {_id: repId}},
      }
    ).exec ();

    return res.status (200).json ({message: 'deleted', commentId, repId});
  } catch (err) {
    return res.status (500).json ({err});
  }
};

module.exports = {
  addCmt,
  getProductCmts,
  editCmt,
  getCmt,
  delCmt,
  repCmt,
  editRep,
  getCmtMedia,
  delRep,
};
