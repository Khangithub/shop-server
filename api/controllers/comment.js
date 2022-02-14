const mongoose = require ('mongoose');
const Comment = require ('../models/comment');

exports.getAllComment = (req, res, next) => {
  Comment.find ()
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
    .select ('-__v')
    .exec ()
    .then (comments =>
      res.status (200).json ({counter: comments.length, comments})
    )
    .catch (error => console.log (error));
};

exports.addMainCmt = async (req, res) => {
  try {
    const {product, mainComment} = req.body;
    const commentator = req.currentUser;
    const newComment = new Comment ({
      product,
      mainComment,
      commentator,
    });

    const doc = await newComment.save ();
    return res.status (200).json ({doc, message: 'updated'});
  } catch (err) {
    return res.status (500).json ({err});
  }
};

exports.getCommentsFromProduct = (req, res, next) => {
  const {productId} = req.params;
  Comment.find ({
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
    .select ('-__v')
    .then (docs => {
      return res.status (200).json ({docsg});
    })
    .catch (error => console.log (error));
};

exports.updateMainComment = async (req, res, next) => {
  const {commentId} = req.params;
  const {mainComment} = req.body;
  await Comment.findByIdAndUpdate (commentId, {$set: {mainComment}})
    .exec ()
    .then (doc => {
      res.status (200).json ({
        mainComment,
        doc,
      });
    })
    .catch (error => {
      res.status (500).json ({
        error: error,
      });
    });
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

exports.deleteMainComment = (req, res, next) => {
  const {commentId} = req.params;
  Comment.findByIdAndDelete (commentId)
    .exec ()
    .then (doc => {
      return res.status (200).json ({doc, message: 'comment was deleted'});
    })
    .catch (error => console.log (error));
};

exports.createSubComment = (req, res, next) => {
  const {commentId} = req.params;
  const {content, sender, receiver} = req.body;
  const subContent = {content, sender, receiver};

  Comment.update (
    {_id: commentId},
    {$push: {subComment: subContent}},
    (err, doc) => {
      if (err) {
        console.log (err);
      }
      return res
        .status (200)
        .json ({doc, subContent, message: 'comment was updated'});
    }
  );
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
