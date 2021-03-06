const router = require("express").Router({ mergeParams: true });
const { auth } = require("../middlewares/user");

const {
  lgPwd,
  lgGg,
  signUp,
  getCurrentUser,
  getUser,
  delUser,
  getUsers,
  chgAvt,
  chgUsername,
  chgPwd,
  resetAcc,
  uploadMedia
} = require("../controllers/user");
const { mediaUploader } = require("../middlewares/multer");

router.get("/", getUsers); // undone, admin auth
router.get("/me", auth, getCurrentUser);
router.get("/:userId", getUser); // undone, admin auth

router.post("/signup", signUp);
router.post("/login/pwd", lgPwd);
router.post("/login/google", lgGg);
router.post("/reset/acc", resetAcc);
router.post("/media", auth, mediaUploader.array("user-media", 10), uploadMedia);
router.patch("/me/avt", auth, mediaUploader.single("chg-avt"), chgAvt); // undone
router.patch("/me/info", auth, chgUsername);
router.patch("/me/pwd", auth, chgPwd); // undone, send msg confirm thoughout phone

router.delete("/:userId", auth, delUser); // undone, also remove all comments, products, message

module.exports = router;
