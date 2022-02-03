const express = require ('express');
const router = express.Router ({mergeParams: true});

const {auth} = require ('../middlewares/user');
const {createSignUpMail} = require ('../middlewares/mail');

const {
  comparePasswords,
  signInWithGoogle,
  signUp,
  getCurrentUser,
  getUser,
  changePassword,
  deleteUser,
  getAllUser,
  createUser,
  updateAvatar,
  updateUser,
  updatePassword,
} = require ('../controllers/user');

const {
  isUserExistFromMail,
  compareDefaultPassowrd,
} = require ('../middlewares/user');
const {createChangePasswordMail} = require ('../middlewares/mail');

router.post (
  '/signup',
  isUserExistFromMail,
  signUp,
  createSignUpMail,
  createUser
);
router.post ('/login/pwd', compareDefaultPassowrd, comparePasswords); // done
router.post ('/login/google', signInWithGoogle); // done
router.get ('/me', auth, getCurrentUser); // done
router.get ('/:userId', getUser); // done

router.patch ('/me/avatar', auth, updateAvatar); // chua xong
router.patch ('/me/info', auth, updateUser); // done
router.patch (
  '/me/pwd',
  auth,
  changePassword,
  createChangePasswordMail,
  updatePassword
); // done
router.delete ('/:userId', auth, deleteUser);
router.get ('/', getAllUser); // done

module.exports = router;
