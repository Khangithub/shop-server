const express = require('express');
const router = express.Router({mergeParams: true});
const {
  getAllComment,
  getCommentsFromProduct,
  getComment,
  createMainComment,
  updateMainComment,
  deleteMainComment,
  createSubComment,
  updateSubComment,
  deleteSubComment,
} = require('../controllers/comment');
const {auth} = require('../middlewares/user');

router.get('/', getAllComment);
router.get('/of/product/:productId', getCommentsFromProduct);
router.get('/:commentId', getComment);

router.post('/main/comment', auth, createMainComment);
router.patch('/main/comment/:commentId', auth, updateMainComment);
router.delete('/main/comment/:commentId', auth, deleteMainComment);

router.post('/sub/comment/:commentId', auth, createSubComment);
router.patch('/sub/comment/:commentId', auth, updateSubComment);
router.delete('/sub/comment/:commentId', auth, deleteSubComment);

module.exports = router;
