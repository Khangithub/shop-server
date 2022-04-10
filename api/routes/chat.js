const router = require ('express').Router ({mergeParams: true});
const {auth} = require ('../middlewares/user');

const {getMsgList, getConversation} = require ('../controllers/chat');

router.get ('/:roomId', auth, getMsgList);
router.get ('/from/:fromId', auth, getConversation);
module.exports = router;
