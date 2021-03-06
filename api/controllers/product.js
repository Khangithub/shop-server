const mongoose = require("mongoose");
const Product = require("../models/product");
const { uploadFile } = require("../middlewares/firebase");
const LIMIT = 6;
const PAGE_INDEX = 1;

const getProds = async (req, res) => {
  try {
    const pageIndex = req.params.pageIndex
      ? parseInt(req.params.pageIndex)
      : PAGE_INDEX;
    const limit = req.params.limit ? parseInt(req.params.limit) : LIMIT;
    const skip = (pageIndex - 1) * limit;

    const docs = await Product.find()
      // .select (
      //   '_id name price productImage category discount saler manufacturer'
      // )
      .populate("saler")
      .skip(skip)
      .limit(limit)
      .exec();

    return res.status(200).json({ docs });
  } catch (err) {
    return res.status(500).json({
      err,
    });
  }
};

const getProdsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const pageIndex = req.params.pageIndex
      ? parseInt(req.params.pageIndex)
      : PAGE_INDEX;
    const limit = req.params.limit ? parseInt(req.params.limit) : LIMIT;
    const skip = (pageIndex - 1) * limit;

    const docs = await Product.find({ category })
      .populate("saler")
      .skip(skip)
      .limit(limit)
      .exec();

    return res.status(200).json({ docs });
  } catch (err) {
    return res.status(500).json({
      err,
    });
  }
};

const addProd = async (req, res) => {
  try {
    const { currentUser } = req;
    const newProduct = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      productImage: req.body.productImage,
      saler: currentUser._id,
      category: req.body.category,
      rating: getIntInRange(1, 5),
      inStock: getIntInRange(500, 10000),
      sold: getIntInRange(150, 3000),
      createAt: new Date(),
    });

    const doc = await newProduct.save();
    return res.status(200).json({ doc, message: "product created" });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const getProd = async (req, res) => {
  const id = req.params.productId;

  await Product.findById(id)
    .populate("saler")
    .select("-__v")
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(400).json({
          message: "id was not existed",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        err,
      });
    });
};

const getProdsOfSaleman = async (req, res) => {
  try {
    const pageIndex = req.params.pageIndex
      ? parseInt(req.params.pageIndex)
      : PAGE_INDEX;
    const limit = req.params.limit ? parseInt(req.params.limit) : LIMIT;
    const skip = (pageIndex - 1) * limit;

    const docs = await Product.find({
      saler: req.params.salemanId,
    })
      .populate("saler")
      .skip(skip)
      .limit(limit)
      .exec();

    return res.status(200).json({ docs });
  } catch (err) {
    return res.status(500).json({
      err,
    });
  }
};

const editProdMedia = async (req, res) => {
  try {
    const { productId } = req.params;
    const mediaList = await Promise.all(
      req.files.map((file) => uploadFile(file, "shop-prod"))
    );

    await Product.findByIdAndUpdate(productId, { $push: { mediaList } }).exec();

    return res.status(200).json({
      mediaList,
      updated: true,
    });
  } catch (err) {
    return res.status(500).json({
      err,
    });
  }
};

const editProd = async (req, res) => {
  try {
    const { prod } = req.body;
    const doc = await Product.updateOne(
      { _id: prod._id },
      {
        $set: prod,
      }
    );

    if (doc.ok) {
      return res.status(200).json({ updated: true });
    }
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const delProd = async (req, res) => {
  Product.findByIdAndDelete(req.params.productId)
    .then((doc) => {
      return res.status(200).send({
        message: "product deleted",
        doc,
      });
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
};

const getMostDiscntsProds = async (req, res) => {
  try {
    const pageIndex = req.params.pageIndex
      ? parseInt(req.params.pageIndex)
      : PAGE_INDEX;
    const limit = req.params.limit ? parseInt(req.params.limit) : LIMIT;

    const skip = (pageIndex - 1) * limit;

    const discountList = await Product.find()
      .skip(skip)
      .limit(limit)
      .sort({ discount: -1 })
      .exec();

    return res.status(200).json({
      discountList,
    });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const getBestSaleProds = async (req, res) => {
  try {
    const pageIndex = req.params.pageIndex
      ? parseInt(req.params.pageIndex)
      : PAGE_INDEX;
    const limit = req.params.limit ? parseInt(req.params.limit) : LIMIT;

    const skip = (pageIndex - 1) * limit;

    const bestSaleList = await Product.find()
      .skip(skip)
      .limit(limit)
      .sort({ sold: -1 })
      .exec();

    return res.status(200).json({
      bestSaleList,
    });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const getNewArrivalProds = async (req, res) => {
  try {
    const pageIndex = req.params.pageIndex
      ? parseInt(req.params.pageIndex)
      : PAGE_INDEX;
    const limit = req.params.limit ? parseInt(req.params.limit) : LIMIT;

    const skip = (pageIndex - 1) * limit;

    const newArrivalList = await Product.find()
      .skip(skip)
      .limit(limit)
      .sort({ createAt: -1 })
      .exec();

    return res.status(200).json({
      newArrivalList,
    });
  } catch (err) {}
};

module.exports = {
  getProds,
  getProdsByCategory,
  getMostDiscntsProds,
  getBestSaleProds,
  getNewArrivalProds,
  getProd,
  addProd,
  editProdMedia,
  editProd,
  delProd,
  getProdsOfSaleman,
};
