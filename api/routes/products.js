const express = require("express");
const router = express.Router();
const {
  getProds,
  getProdsByCategory,
  getMostDiscntsProds,
  getBestSaleProds,
  addProd,
  getProd,
  editProdMedia,
  delProd,
  getNewArrivalProds,
  getProdsOfSaleman,
  editProd,
} = require("../controllers/product");
const { mediaUploader } = require("../middlewares/multer");
const { auth, checkRole } = require("../middlewares/user");

router.get("/:pageIndex/:limit", getProds);
router.get("/:productId", getProd);
router.get("/type/:category/:pageIndex/:limit", getProdsByCategory);
router.get("/most/discounts/:pageIndex/:limit", getMostDiscntsProds);
router.get("/best/sale/:pageIndex/:limit", getBestSaleProds);
router.get("/new/arrival/:pageIndex/:limit", getNewArrivalProds);
router.get("/of/saleman/:salemanId/:pageIndex/:limit", getProdsOfSaleman);

router.post("/", auth, addProd);

router.patch(
  "/saleman/prod/media/:productId",
  auth,
  checkRole("saler"),
  mediaUploader.array("shop-prod", 10),
  editProdMedia
);
router.patch("/edit", auth, checkRole("saler"), editProd);

router.delete("/:productId", auth, delProd);

module.exports = router;
