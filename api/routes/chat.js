const router = require("express").Router();
const {auth} = require ('../middlewares/user');

const { getMsgList } = require("../controllers/chat");

router.get("/:roomId", auth, getMsgList);
module.exports = router;
