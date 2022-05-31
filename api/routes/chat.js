const router = require("express").Router();
const { auth, isClient } = require("../middlewares/user");
const { getMsgs, getChats } = require("../controllers/chat");

router.get("/:roomId", auth, getMsgs);
router.get("/of/buyer/:userId", auth, isClient, getChats);

module.exports = router;
