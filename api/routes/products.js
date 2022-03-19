const express = require ('express');
const router = express.Router ();
const {
  getProducts,
  getProductsByCategory,
  getMostDiscountsProducts,
  getBestSaleProducts,
  addProduct,
  getProduct,
  editProduct,
  delProduct,
  getNewArrivalProducts,
} = require ('../controllers/product');

const {auth} = require ('../middlewares/user');

router.get ('/:pageIndex/:limit', getProducts);
router.get ('/:productId', getProduct);
router.get ('/type/:category/:pageIndex/:limit', getProductsByCategory);
router.get ('/most/discounts/:pageIndex/:limit', getMostDiscountsProducts);
router.get ('/best/sale/:pageIndex/:limit', getBestSaleProducts);
router.get ('/new/arrival/:pageIndex/:limit', getNewArrivalProducts);

router.post ('/', auth, addProduct);

router.patch ('/:productId', auth, editProduct);

router.delete ('/:productId', auth, delProduct);

module.exports = router;
