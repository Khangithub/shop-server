const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { uploadFile } = require("../middlewares/firebase");
const msgs = require("../../configs/msgs.json");

const getUsers = async (_, res) => {
  try {
    const users = await User.find({})
      .select("email username role avatar")
      .exec();
    return res.status(200).json({ users });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const signUp = async (req, res) => {
  try {
    const { email, role, avatar, username } = req.body;
    const password = await bcrypt.hash(process.env.DEFAULT_PASSWORD, 10);
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      email,
      password,
      role,
      avatar,
      username,
    });

    const currentUser = await newUser.save();
    if (currentUser) {
      req.currentUser = currentUser;
      const token = jwt.sign(
        { data: JSON.stringify(currentUser._id) },
        process.env.TOKEN_SECRET_KEY,
        {
          expiresIn: process.env.TOKEN_EXPIRED_TIME,
        }
      );

      return res.status(200).json({ created: true, token, currentUser });
    }
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const getCurrentUser = (req, res) => {
  const { currentUser } = req;
  return res.status(200).json({ currentUser });
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).exec();
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const lgPwd = async (req, res) => {
  try {
    const { email, password } = req.body;
    const currentUser = await User.findOne({ email }).exec();

    if (!currentUser) {
      return res.status(401).json({ message: msgs.USER_NOT_EXIST_MSG });
    }

    const isSamePwd = await bcrypt.compare(password, currentUser.password);

    if (!isSamePwd) {
      return res.status(401).json({ message: msgs.WRONG_PWD_MSG });
    } else {
      const token = jwt.sign(
        { data: JSON.stringify(currentUser._id) },
        process.env.TOKEN_SECRET_KEY,
        {
          expiresIn: process.env.TOKEN_EXPIRED_TIME,
        }
      );
      currentUser.password = null;
      req.currentUser = currentUser;
      return res.status(200).json({ token, currentUser });
    }
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const lgGg = async (req, res) => {
  try {
    const { email } = req.body;
    const currentUser = await User.findOne({ email }).exec();
    if (!currentUser) {
      return res.status(401).json({ message: msgs.USER_NOT_EXIST_MSG });
    }
    const token = jwt.sign(
      { data: JSON.stringify(currentUser._id) },
      process.env.TOKEN_SECRET_KEY,
      {
        expiresIn: process.env.TOKEN_EXPIRED_TIME,
      }
    );

    currentUser.password = null;
    req.currentUser = currentUser;
    return res.status(200).json({ token, currentUser });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const delUser = async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.userId }).exec();
    return res.status(200).json({ message: msgs.USER_DELETED_MSG });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const chgAvt = async (req, res) => {
  try {
    let { filename } = await uploadFile(req.file, "shop-user-avt");

    await User.findByIdAndUpdate(req.currentUser._id, {
      avatar: filename,
    }).exec();

    return res.status(200).json({ updated: true, filename });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const chgUsername = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.currentUser._id, {
      username: req.body.newUsername,
    }).exec();
    return res.status(200).json({ message: msgs.USERNAME_CHANGED_MSG });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const chgPwd = async (req, res) => {
  try {
    const { pwd, confirmedPwd } = req.body;

    if (pwd !== confirmedPwd) {
      return res.status(400).json({ message: msgs.PWDS_NOT_MATCH_MSG });
    }

    const password = await bcrypt.hash(pwd, 10);

    await User.findByIdAndUpdate(req.currentUser._id, {
      password,
    }).exec();

    return res.status(200).json({
      message: msgs.PWD_CHANGED,
    });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const resetAcc = async (req, res) => {
  try {
    const { email } = req.body;
    const defaultPwd = await bcrypt.hash(process.env.DEFAULT_PASSWORD, 10);
    await User.updateOne({ email }, { password: defaultPwd }).exec();
    return res.status(200).json({
      message: `password has been reset to ${process.env.DEFAULT_PASSWORD}`,
    });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const uploadMedia = async (req, res) => {
  try {
    const mediaList = await Promise.all(
      req.files.map((file) => uploadFile(file, "user-media"))
    );

    await User.findByIdAndUpdate(req.currentUser._id, {
      $push: {
        mediaList,
      },
    }).exec();

    return res.status(200).json({ mediaList, updated: true });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

module.exports = {
  getUsers,
  signUp,
  getCurrentUser,
  getUser,
  lgPwd,
  lgGg,
  delUser,
  chgAvt,
  chgUsername,
  chgPwd,
  resetAcc,
  uploadMedia,
};
