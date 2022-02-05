const mongoose = require ('mongoose');
const Product = require ('../models/product');

const getProducts = async (_, res) => {
  try {
    const productList = await Product.find ()
      // .select (
      //   '_id name price productImage category discount saler manufacturer'
      // )
      .populate ('saler')
      .exec ();

    return res
      .status (200)
      .json ({docs: productList, message: 'get all products'});
  } catch (err) {
    return res.status (500).json ({
      err,
    });
  }
};

const createProduct = (req, res) => {
  const {currentUser} = req;
  const newProduct = new Product ({
    _id: new mongoose.Types.ObjectId (),
    name: req.body.name,
    price: req.body.price,
    productImage: req.body.productImage,
    saler: currentUser._id,
    category: req.body.category,
    rating: getIntInRange (1, 5),
    inStock: getIntInRange (500, 10000),
    sold: getIntInRange (150, 3000),
  });

  newProduct
    .save ()
    .then (doc => {
      return res.status (200).json ({doc, message: 'product created'});
    })
    .catch (err => {
      return res.status (500).json ({err});
    });
};

const getProduct = async (req, res) => {
  const id = req.params.productId;

  await Product.findById (id)
    .populate ('saler')
    .select ('-__v')
    .exec ()
    .then (doc => {
      if (doc) {
        res.status (200).json (doc);
      } else {
        res.status (400).json ({
          message: 'id was not existed',
        });
      }
    })
    .catch (err => {
      res.status (500).json ({
        err,
      });
    });
};

const updateProduct = (req, res) => {
  const {productId} = req.params;
  const updateProduct = req.body;
  Product.findByIdAndUpdate (productId, updateProduct)
    .exec ()
    .then (doc => {
      res.status (200).json ({
        message: JSON.stringify (updateProduct),
        doc,
      });
    })
    .catch (error => {
      res.status (500).json ({
        error: error,
      });
    });
};

const deleteProduct = async (req, res) => {
  Product.findByIdAndDelete (req.params.productId)
    .then (doc => {
      return res.status (200).send ({
        message: 'product deleted',
        doc,
      });
    })
    .catch (err => {
      return res.status (500).send (err);
    });
};

const getMostDiscountsProducts = async (req, res) => {
  try {
    const pageIndex = req.params.pageIndex
      ? parseInt (req.params.pageIndex)
      : 1;
    const limit = req.params.limit ? parseInt (req.params.limit) : 6;

    const skip = (pageIndex - 1) * limit;

    const discountList = await Product.find ({discount: {$gt: 0}})
      .skip (skip)
      .limit (limit)
      .sort ({discount: -1})
      .exec ();

    return res.status (200).json ({
      discountList,
    });
  } catch (err) {
    return res.status (500).json ({err});
  }
};

const getBestSaleProducts = async (req, res) => {
  try {
    const pageIndex = req.params.pageIndex
      ? parseInt (req.params.pageIndex)
      : 1;
    const limit = req.params.limit ? parseInt (req.params.limit) : 6;

    const skip = (pageIndex - 1) * limit;

    const discountList = await Product.find ({sold: {$gt: 0}})
      .skip (skip)
      .limit (limit)
      .sort ({sold: -1})
      .exec ();

    return res.status (200).json ({
      discountList,
    });
  } catch (err) {
    return res.status (500).json ({err});
  }
};

module.exports = {
  getProducts,
  getMostDiscountsProducts,
  getBestSaleProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};
