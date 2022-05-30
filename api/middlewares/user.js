const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let { data } = jwt.verify(token, process.env.JWT_KEY);
    let myId = JSON.parse(data);

    const user = await User.findById(myId).select("-__v -password").exec();

    if (user) {
      req.currentUser = user;
      console.log("auth done", user.username);
      next();
    } else {
      return res.status(400).json({
        message: "auth failed: user not found",
      });
    }
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const isSaleman = async (req, res, next) => {
  if (req.currentUser.role === "saler") {
    next();
  } else {
    return res.status(401).json({ message: "this user is not a saleman" });
  }
};

const isClient = async (req, res, next) => {
  if (req.currentUser.role === "client") {
    next();
  } else {
    return res.status(402).json({ message: "this user is not a client" });
  }
};
module.exports = { auth, isSaleman, isClient };
