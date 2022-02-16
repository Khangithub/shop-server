const express = require ('express');
const router = express.Router ({mergeParams: true});
const {
  getProductCmts,
  getComment,
  addCmt,
  updateMainComment,
  deleteMainComment,
  replyCmt,
  updateSubComment,
  deleteSubComment,
} = require ('../controllers/comment');
const {auth} = require ('../middlewares/user');

router.get ('/from/product/:productId/:batch/:limit', getProductCmts);
router.get ('/:commentId', getComment);

router.post ('/', auth, addCmt);
router.patch ('/main/comment/:commentId', auth, updateMainComment);
router.delete ('/main/comment/:commentId', auth, deleteMainComment);

router.post ('/reply/:commentId', replyCmt);
router.patch ('/sub/comment/:commentId', auth, updateSubComment);
router.delete ('/sub/comment/:commentId', auth, deleteSubComment);

module.exports = router;
