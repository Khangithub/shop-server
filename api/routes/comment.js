const express = require ('express');

const router = express.Router ({mergeParams: true});
const {
  getProductCmts,
  getComment,
  getMedia,
  addCmt,
  editCmt,
  delCmt,
  repCmt,
  updateSubComment,
  deleteSubComment,
  backup,
} = require ('../controllers/comment');
const {mediaUploader} = require ('../middlewares/multer');
const {auth} = require ('../middlewares/user');

router.get ('/of/product/:productId/:batch/:limit', getProductCmts);
router.get ('/:commentId', getComment);
router.get ('/media/:filename', getMedia);

router.post ('/', auth, mediaUploader.array ('cmt-media', 4), addCmt);
router.post ('/reply/:commentId', auth, mediaUploader.array ('rep-media', 4), repCmt);

router.patch (
  '/:commentId',
  auth,
  mediaUploader.array ('edit-cmt-media', 4),
  editCmt
);
router.patch ('/sub/comment/:commentId', auth, updateSubComment);

router.delete ('/:commentId', auth, delCmt);
router.delete ('/sub/comment/:commentId', auth, deleteSubComment);

module.exports = router;
