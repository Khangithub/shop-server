const router = require("express").Router();
const { auth, isClient, isSaleman } = require("../middlewares/user");
const {
  getMsgs,
  getBuyerChats,
  getSalemanChats,
} = require("../controllers/chat");

router.get("/:roomId", auth, getMsgs);
router.get("/of/buyer/:userId", auth, isClient, getBuyerChats);
router.get("/of/saleman/:userId", auth, isSaleman, getSalemanChats);

module.exports = router;
