const express = require ('express');

const router = express.Router ({mergeParams: true});
const {
  getProductCmts,
  getCmt,
  getCmtMedia,
  addCmt,
  editCmt,
  delCmt,
  repCmt,
  updateRep,
  delRep
} = require ('../controllers/comment');
const {mediaUploader} = require ('../middlewares/multer');
const {auth} = require ('../middlewares/user');

router.get ('/of/product/:productId/:batch/:limit', getProductCmts);
router.get ('/:commentId', getCmt);
router.get ('/media/:filename', getCmtMedia);

router.post ('/', auth, mediaUploader.array ('cmt-media', 4), addCmt);
router.post ('/reply/:commentId', auth, mediaUploader.array ('rep-media', 4), repCmt);

router.patch (
  '/:commentId',
  auth,
  mediaUploader.array ('edit-cmt-media', 4),
  editCmt
);
router.patch ('/sub/comment/:commentId', auth, updateRep);

router.delete ('/:commentId', auth, delCmt);
router.delete ('/reply/:commentId', auth, delRep);

module.exports = router;
