const express = require('express');
const router = express.Router();

const {auth} = require('../middlewares/user');
const {
  getAllOrder,
  createOrder,
  getOrderFromUser,
  getOrderFromSaler,
  getOrder,
  updateOrder,
  deleteOrder,
  backup
} = require('../controllers/order');

// Handling incoming get request to /orders
router.get('/', getAllOrder);
router.post('/', auth, createOrder);
router.get('/ofUser', auth, getOrderFromUser);
router.get('/ofSaler', auth, getOrderFromSaler);
router.get('/:orderId', auth, getOrder);
router.patch('/item/in/cart/:orderId', auth, updateOrder);
router.delete('/:orderId', auth, deleteOrder);

module.exports = router;
