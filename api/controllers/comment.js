const path = require ('path');
const Comment = require ('../models/comment');
const LIMIT = 6;
const PAGE_INDEX = 1;

exports.addCmt = async (req, res) => {
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

exports.getProductCmts = async (req, res) => {
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

exports.editCmt = async (req, res) => {
  try {
    const {commentId} = req.params;
    const {mainComment} = req.body;
    const mediaList = req.files.map (({filename, mimetype}) => ({
      filename: process.env.DOMAIN + 'comments/media/' + filename,
      mimetype,
    }));

    await Comment.findByIdAndUpdate (commentId, {
      $set: {mainComment, mediaList},
    }).exec ();

    return res.status (200).json ({message: 'edited', mediaList, mainComment});
  } catch (err) {
    return res.status (500).json ({err});
  }
};

exports.getComment = (req, res, next) => {
  const {commentId} = req.params;
  Comment.findById (commentId)
    .exec ()
    .then (doc => {
      return res.status (200).json ({doc});
    })
    .catch (error => console.log (error));
};

exports.delCmt = async (req, res) => {
  try {
    const {commentId} = req.params;
    await Comment.findByIdAndDelete (commentId).exec ();
    return res.status (200).json ({message: 'deleted', commentId});
  } catch (err) {
    return res.status (500).json ({err});
  }
};

exports.replyCmt = async (req, res) => {
  try {
    const {commentId} = req.params;
    const {content, sender, receiver} = req.body;
    await Comment.findByIdAndUpdate (commentId, {
      $push: {subComment: {content, sender, receiver}},
    });

    const newCmt = await Comment.findOne ({
      _id: commentId,
      'subComment.content': content,
      'subComment.sender': sender,
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

exports.updateSubComment = (req, res, next) => {
  const {commentId} = req.params;
  const {newContent} = req.body;

  Comment.update (
    {'subComment._id': commentId},
    {
      $set: {
        'subComment.$.content': newContent,
      },
    }
  )
    .exec ()
    .then (doc => {
      return res
        .status (200)
        .json ({message: 'subComment was updated', newContent, doc});
    })
    .catch (error => {
      return res.status (400).json ({error});
    });
};

exports.getMedia = (req, res) => {
  const {filename} = req.params;
  if (!filename) {
    return res.status (500).json ({
      message: 'no filename specified',
    });
  }
  res.sendFile (path.resolve (`./media/${filename}`));
};

exports.deleteSubComment = (req, res, next) => {
  const {commentId} = req.params;
  const {subCommentId} = req.body;

  Comment.findByIdAndUpdate (
    {_id: commentId},
    {
      $pull: {subComment: {_id: subCommentId}},
    }
  )
    .exec ()
    .then (doc => {
      return res.status (200).json ({message: 'subComment was deleted', doc});
    })
    .catch (error => {
      return res.status (400).json ({error});
    });
};
