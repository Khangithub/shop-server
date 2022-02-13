const express = require ('express');
const router = express.Router ();
const {
  getProducts,
  getMostDiscountsProducts,
  getBestSaleProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getNewArrivalProducts
} = require ('../controllers/product');

const {auth} = require ('../middlewares/user');

router.get ('/:pageIndex/:limit', getProducts);
router.get ('/:productId', getProduct);
router.get ('/most/discounts/:pageIndex/:limit', getMostDiscountsProducts);
router.get ('/best/sale/:pageIndex/:limit', getBestSaleProducts);
router.get('/new/arrival/:pageIndex/:limit', getNewArrivalProducts);
router.post ('/', auth, createProduct);

router.patch ('/:productId', auth, updateProduct);

router.delete ('/:productId', auth, deleteProduct);

module.exports = router;
