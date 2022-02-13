const Order = require ('../models/order');
const Product = require ('../models/product');
const mongoose = require ('mongoose');

exports.getAllOrder = (req, res, next) => {
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
      res.status (200).json ({
        count: docs.length,
        docs,
      });
    })
    .catch (error => {
      res.status (500).json (error);
    });
};

exports.createOrder = (req, res, next) => {
  const {currentUser} = req;
  Product.findById (req.body.product)
    .then (doc => {
      if (!doc) {
        return res.status (404).json ({
          message: 'Product not found',
        });
      }
      const order = new Order ({
        _id: mongoose.Types.ObjectId (),
        product: req.body.product,
        quantity: req.body.quantity,
        buyer: currentUser,
      });

      order
        .save ()
        .then (doc => {
          res.status (200).json ({
            message: 'Order stored',
            doc,
          });
        })
        .catch (error => {
          console.log (error);
          res.status (500).json (500);
        });
    })
    .catch (error => {
      res.status (500).json ({
        message: 'id not found',
        error: error,
      });
    });
};

exports.getOrder = (req, res, next) => {
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

exports.getOrderFromSaler = async (req, res, next) => {
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

exports.updateOrder = async (req, res) => {
  try {
    const {orderId} = req.params;
    const {quantity} = req.body;
    const doc = await Order.findByIdAndUpdate (
      {_id: orderId, orderStatus: 'in-cart'},
      {
        quantity,
      }
    ).exec ();
    return res
      .status (200)
      .json ({message: 'updated', orderId});
  } catch (err) {
    return res.status (500).json ({err});
  }
};

exports.getOrderFromUser = (req, res, next) => {
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

exports.deleteOrder = (req, res, next) => {
  const id = req.params.orderId;
  Order.deleteOne ({_id: id})
    .exec ()
    .then (doc => {
      res.status (200).json ({
        message: 'order deleted',
        doc,
      });
    })
    .catch (error => {
      res.status (400).json ({error});
    });
};
