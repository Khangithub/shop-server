const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { uploadFile } = require("../middlewares/firebase");

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

    const doc = await newUser.save();
    if (doc) {
      req.currentUser = doc;
      const token = jwt.sign(
        { data: JSON.stringify(doc._id) },
        process.env.JWT_KEY,
        {
          expiresIn: "1d",
        }
      );

      return res
        .status(200)
        .json({ message: "created", token, currentUser: doc });
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

const signInWithPwd = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();

    if (!user) {
      return res.status(401).json({ message: "user doese not exist" });
    }

    const isSamePwd = await bcrypt.compare(password, user.password);
    if (!isSamePwd) {
      return res.status(401).json({ message: "wrong password" });
    } else {
      const token = jwt.sign(
        { data: JSON.stringify(user._id) },
        process.env.JWT_KEY,
        {
          expiresIn: "1d",
        }
      );
      req.currentUser = user;
      return res.status(200).json({ token, currentUser: user });
    }
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const signInWithGg = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(401).json({ message: "user does not exist" });
    }
    const token = jwt.sign(
      { data: JSON.stringify(user._id) },
      process.env.JWT_KEY,
      {
        expiresIn: "1d",
      }
    );
    req.currentUser = user;
    return res.status(200).json({ token, currentUser: user });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const delUser = async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.userId }).exec(); // params có "s", plural
    return res.status(200).json({ message: "user is deleted" });
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
    const doc = await User.findByIdAndUpdate(req.currentUser._id, {
      username: req.body.newUsername,
    }).exec();
    return res.status(200).json({ message: "username is changed", doc });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const chgPwd = async (req, res) => {
  try {
    const { pwd, confirmedPwd } = req.body;

    if (pwd !== confirmedPwd) {
      return res.status(400).json({ message: "passwords are not matched" });
    }

    const password = await bcrypt.hash(pwd, 10);

    await User.findByIdAndUpdate(req.currentUser._id, {
      password,
    }).exec();

    return res.status(200).json({
      message: "password changed",
    });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

const resetAcc = async (req, res) => {
  try {
    const { email } = req.body;
    const defaultPwd = await bcrypt.hash(process.env.DEFAULT_PASSWORD, 10);
    const doc = await User.updateOne(
      { email },
      { password: defaultPwd }
    ).exec();
    return res.status(200).json({
      doc,
      message: `password has been reset to ${process.env.DEFAULT_PASSWORD}`,
    });
  } catch (err) {
    return res.status(500).json({ err });
  }
};

module.exports = {
  getUsers,
  signUp,
  getCurrentUser,
  getUser,
  signInWithPwd,
  signInWithGg,
  delUser,
  chgAvt,
  chgUsername,
  chgPwd,
  resetAcc,
};
