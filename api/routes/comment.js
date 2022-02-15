const express = require ('express');
const router = express.Router ({mergeParams: true});
const {
  getProductCmts,
  getComment,
  addMainCmt,
  updateMainComment,
  deleteMainComment,
  createSubComment,
  updateSubComment,
  deleteSubComment,
} = require ('../controllers/comment');
const {auth} = require ('../middlewares/user');

router.get ('/from/product/:productId/:batch/:limit', getProductCmts);
router.get ('/:commentId', getComment);

router.post ('/main', auth, addMainCmt);
router.patch ('/main/comment/:commentId', auth, updateMainComment);
router.delete ('/main/comment/:commentId', auth, deleteMainComment);

router.post ('/sub/comment/:commentId', auth, createSubComment);
router.patch ('/sub/comment/:commentId', auth, updateSubComment);
router.delete ('/sub/comment/:commentId', auth, deleteSubComment);

module.exports = router;
