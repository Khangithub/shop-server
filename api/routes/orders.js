const express = require('express');
const router = express.Router();
const {auth} = require('../middlewares/user');
const {
  addOrder,
  getOrderFromUser,
  getOrderFromSaler,
  getOrder,
  editOrder,
  delOrder
} = require('../controllers/order');

// Handling incoming get request to /orders
router.post('/', auth, addOrder);
router.get('/ofUser', auth, getOrderFromUser);
router.get('/ofSaler', auth, getOrderFromSaler);
router.get('/:orderId', auth, getOrder);
router.patch('/item/in/cart/:orderId', auth, editOrder);
router.delete('/:orderId', auth, delOrder);

module.exports = router;
