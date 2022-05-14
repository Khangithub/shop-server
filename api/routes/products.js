const express = require ('express');
const router = express.Router ();
const {
  getProds,
  getProdsByCategory,
  getMostDiscntsProds,
  getBestSaleProds,
  addProd,
  getProd,
  editProd,
  delProd,
  getNewArrivalProds,
  getProdsOfSaleman,
} = require ('../controllers/product');
const {auth} = require ('../middlewares/user');

router.get ('/:pageIndex/:limit', getProds);
router.get ('/:productId', getProd);
router.get ('/type/:category/:pageIndex/:limit', getProdsByCategory);
router.get ('/most/discounts/:pageIndex/:limit', getMostDiscntsProds);
router.get ('/best/sale/:pageIndex/:limit', getBestSaleProds);
router.get ('/new/arrival/:pageIndex/:limit', getNewArrivalProds);
router.get('/of/saleman/:salemanId/:pageIndex/:limit', getProdsOfSaleman);

router.post ('/', auth, addProd);

router.patch ('/:productId', auth, editProd);

router.delete ('/:productId', auth, delProd);

module.exports = router;
