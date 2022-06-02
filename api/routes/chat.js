const router = require("express").Router();
const { auth, checkRole } = require("../middlewares/user");
const {
  getMsgs,
  getBuyerChats,
  getSalemanChats,
} = require("../controllers/chat");

router.get("/:roomId", auth, getMsgs);
router.get("/of/buyer/:userId", auth, checkRole("client"), getBuyerChats);
router.get("/of/saleman/:userId", auth, checkRole("saler"), getSalemanChats);

module.exports = router;
