const router = require ('express').Router ({mergeParams: true});
const {getChatList} = require ('../controllers/chat');
const {auth} = require ('../middlewares/user');

router.get ('/:roomId', auth, getChatList);

module.exports = router;
