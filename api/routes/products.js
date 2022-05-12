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
  backup,
} = require ('../controllers/product');
const {mediaUploader} = require ('../middlewares/multer');
const {auth} = require ('../middlewares/user');

router.get ('/:pageIndex/:limit', getProducts);
router.get ('/:productId', getProduct);
router.get ('/type/:category/:pageIndex/:limit', getProductsByCategory);
router.get ('/most/discounts/:pageIndex/:limit', getMostDiscountsProducts);
router.get ('/best/sale/:pageIndex/:limit', getBestSaleProducts);
router.get ('/new/arrival/:pageIndex/:limit', getNewArrivalProducts);

router.post ('/', auth, addProduct);
router.post ('/test', mediaUploader.array ('product-media', 4), backup);

router.patch ('/:productId', auth, editProduct);

router.delete ('/:productId', auth, delProduct);

module.exports = router;
