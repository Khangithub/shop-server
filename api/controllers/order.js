const Order = require ('../models/order');
const Product = require ('../models/product');
const {ObjectId} = require ('mongoose').Types;

const addOrder = async (req, res) => {
  try {
    const {currentUser} = req;
    const {product, quantity} = req.body;
    const productDoc = await Product.findById (product);

    if (!productDoc) {
      return res.status (404).json ({
        message: 'product not found',
      });
    }

    const inCartOrder = await Order.findOne ({
      buyer: currentUser._id,
      product,
      orderStatus: 'in-cart',
    });

    // if this product already in cart then update the quantity
    if (inCartOrder) {
      inCartOrder.quantity = inCartOrder.quantity + quantity;
      await inCartOrder.save ();
      return res.status (200).json ({
        doc: inCartOrder,
        message: 'updated',
      });
    } 
    // else add new order in database
    else {
      const order = new Order ({
        _id: ObjectId (),
        product,
        quantity,
        buyer: currentUser,
      });
      const orderDoc = await order.save ();
      return res.status (200).json ({
        doc: orderDoc,
        message: 'added',
      });
    }
  } catch (err) {
    return res.status (500).json ({err});
  }
};

const getOrder = (req, res) => {
  const id = req.params.orderId;
  Order.findById (id)
    .populate ({
      path: 'product',
      select: '-description',
      populate: {
        path: 'saler',
        select: '-__v -password',
      },
    })
    .exec ()
    .then (doc => {
      res.status (200).json ({doc});
    })
    .catch (error => {
      res.status (500).json ({
        message: 'id not found',
        error: error,
      });
    });
};

const getOrderFromSaler = async (req, res) => {
  const salerId = req.currentUser._id;
  await Order.find ()
    .select ('-__v')
    .populate ({path: 'product', populate: 'saler', select: '-__v -password'})
    .populate ({path: 'buyer', select: '-__v -password'})
    .exec ()
    .then (docs => {
      return res.status (200).json ({
        docs: docs
          .filter (doc => {
            return doc.product !== undefined;
          })
          .filter (doc => {
            return doc.product !== null;
          })
          .filter (doc => {
            return doc.buyer !== null;
          })
          .filter (doc => {
            return doc.product.saler._id.equals (salerId);
          }),
      });
    })
    .catch (error => {
      return res.status (500).json ({error, userId});
    });
};

const editOrder = async (req, res) => {
  try {
    const {orderId} = req.params;
    const {quantity} = req.body;
    await Order.findByIdAndUpdate (
      {_id: orderId, orderStatus: 'in-cart'},
      {
        quantity,
      }
    ).exec ();
    return res.status (200).json ({message: 'updated', orderId});
  } catch (err) {
    return res.status (500).json ({err});
  }
};

const getOrderFromUser = (req, res) => {
  const userId = req.currentUser._id;
  Order.find ()
    .select ('-__v')
    .populate ({
      path: 'product',
      select: '-description',
      populate: {
        path: 'saler',
        select: '-__v -password',
      },
    })
    .populate ({path: 'buyer', select: '-__v -password'})
    .exec ()
    .then (docs => {
      return res.status (200).json ({
        docs: docs
          .filter (doc => {
            return doc.buyer !== undefined;
          })
          .filter (doc => {
            return doc.buyer !== null;
          })
          .filter (doc => {
            return doc.buyer._id.equals (userId);
          }),
      });
    })
    .catch (error => {
      console.log (error);
      return res.status (500).json ({error});
    });
};

const delOrder = async (req, res) => {
  try {
    const {orderId} = req.params;
    await Order.deleteOne ({_id: orderId}).exec ();
    return res.status (200).json ({
      message: 'deleted',
      orderId,
    });
  } catch (err) {
    return res.status (500).json ({err});
  }
};

module.exports = {
  addOrder,
  getOrder,
  getOrderFromSaler,
  editOrder,
  getOrderFromUser,
  delOrder,
};
