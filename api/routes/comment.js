const express = require ('express');

const router = express.Router ({mergeParams: true});
const {
  getProductCmts,
  getComment,
  getMedia,
  addCmt,
  updateMainComment,
  delCmt,
  replyCmt,
  updateSubComment,
  deleteSubComment
} = require ('../controllers/comment');
const {mediaUploader} = require ('../middlewares/multer');
const {auth} = require ('../middlewares/user');

router.get ('/from/product/:productId/:batch/:limit', getProductCmts);
router.get ('/:commentId', getComment);
router.get ('/media/:filename', getMedia);

router.post ('/', auth, mediaUploader.array ('cmt-media', 4), addCmt);
router.post ('/reply/:commentId', replyCmt);

router.patch ('/main/comment/:commentId', auth, updateMainComment);
router.patch ('/sub/comment/:commentId', auth, updateSubComment);

router.delete ('/:commentId', auth, delCmt);
router.delete ('/sub/comment/:commentId', auth, deleteSubComment);

module.exports = router;
