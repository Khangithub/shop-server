const express = require ('express');
const router = express.Router ();
const {
  getProducts,
  getMostDiscountsProducts,
  getBestSaleProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct
} = require ('../controllers/product');

const {auth} = require ('../middlewares/user');

router.get ('/', getProducts);
router.get ('/:productId', getProduct);
router.get ('/most/discounts/:pageIndex/:limit', getMostDiscountsProducts);
router.get ('/best/sale/:pageIndex/:limit', getBestSaleProducts);

router.post ('/', auth, createProduct);

router.patch ('/:productId', auth, updateProduct);

router.delete ('/:productId', auth, deleteProduct);

module.exports = router;
