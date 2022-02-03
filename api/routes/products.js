const express = require ('express');
const router = express.Router ();
const {
  getAllProduct,
  getSaleOffProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct
} = require ('../controllers/product');

const {auth} = require ('../middlewares/user');

router.get ('/', getAllProduct);
router.get ('/saleOff/:pageIndex', getSaleOffProducts);
router.post ('/', auth, createProduct);
router.get ('/:productId', getProduct);
router.patch ('/:productId', auth, updateProduct);
router.delete ('/:productId', auth, deleteProduct);

module.exports = router;
