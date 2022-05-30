const router = require ('express').Router ({mergeParams: true});
const {
  getCmts,
  getCmt,
  getCmtMedia,
  addCmt,
  editCmt,
  delCmt,
  repCmt,
  editRep,
  delRep,
} = require ('../controllers/comment');
const {mediaUploader} = require ('../middlewares/multer');
const {auth} = require ('../middlewares/user');

router.get ('/of/product/:productId/:batch/:limit', getCmts);
router.get ('/:commentId', getCmt);
router.get ('/media/:filename', getCmtMedia);

router.post ('/', auth, mediaUploader.array ('cmt-media', 10), addCmt);
router.post (
  '/reply/:commentId',
  auth,
  mediaUploader.array ('rep-media', 10),
  repCmt
);

router.patch (
  '/:commentId',
  auth,
  mediaUploader.array ('edit-cmt-media', 10),
  editCmt
);
router.patch ('/sub/comment/:commentId', auth, editRep); // undone

router.delete ('/:commentId', auth, delCmt);
router.delete ('/reply/:commentId', auth, delRep);

module.exports = router;
