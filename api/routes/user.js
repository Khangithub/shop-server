const router = require("express").Router({ mergeParams: true });
const { auth } = require("../middlewares/user");

const {
  signInWithPwd,
  signInWithGg,
  signUp,
  getCurrentUser,
  getUser,
  delUser,
  getUsers,
  chgAvt,
  changeUsername,
  changePwd,
  resetAcc,
} = require("../controllers/user");
const { mediaUploader } = require("../middlewares/multer");

router.get("/", getUsers); // undone, admin auth
router.get("/me", auth, getCurrentUser);
router.get("/:userId", getUser); // undone, admin auth

router.post("/signup", signUp);
router.post("/login/pwd", signInWithPwd);
router.post("/login/google", signInWithGg);
router.post("/reset/acc", resetAcc);

router.patch("/me/avt", auth, mediaUploader.single("chg-avt"), chgAvt); // undone
router.patch("/me/info", auth, changeUsername);
router.patch("/me/pwd", auth, changePwd); // undone, send msg confirm thoughout phone

router.delete("/:userId", auth, delUser); // undone, also remove all comments, products, message

module.exports = router;
