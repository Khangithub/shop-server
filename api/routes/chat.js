const router = require("express").Router();
const { auth, isClient } = require("../middlewares/user");

const { getMsgList, getChatList } = require("../controllers/chat");

router.get("/:roomId", auth, getMsgList);
router.get("/of/buyer/:userId", auth, isClient, getChatList);

module.exports = router;
