const router  = require('express').Router();
const {auth} = require('../middlewares/user');
const {
  addOrder,
  getOrderFromUser,
  getOrderFromSaler,
  getOrder,
  editOrder,
  delOrder
} = require('../controllers/order');

router.get('/ofUser', auth, getOrderFromUser);
router.get('/ofSaler', auth, getOrderFromSaler);
router.get('/:orderId', auth, getOrder);

router.post('/', auth, addOrder);

router.patch('/item/in/cart/:orderId', auth, editOrder);

router.delete('/:orderId', auth, delOrder);

module.exports = router;
