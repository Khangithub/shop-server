const router = require("express").Router();
const {auth} = require ('../middlewares/user');

const { getChatList } = require("../controllers/chat");

router.get("/:roomId", auth, getChatList);
module.exports = router;
