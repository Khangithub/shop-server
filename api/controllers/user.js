require('dotenv').config();

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.getAllUser = (req, res, next) => {
  User.find({})
    .select('email username role avatar')
    .exec()
    .then((users) => {
      users
        ? res.status(200).json({users})
        : res.status(400).json({message: 'user list empty'});
    })
    .catch((error) => res.status(400).json({error}));
};

exports.signUp = (req, res, next) => {
  const {email, role, avatar, username} = req.body;
  bcrypt.hash(process.env.DEFAULT_PASSWORD, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({message: 'error in hash password', err});
    } else {
      const newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        email,
        password: hash,
        role,
        avatar,
        username,
      });

      newUser
        .save()
        .then((doc) => {
          req.currentUser = doc;
          next();
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({err});
        });
    }
  });
};

exports.getCurrentUser = (req, res, next) => {
  const {currentUser} = req;
  return res.status(200).json({currentUser});
};

exports.getUser = (req, res, next) => {
  const {userId} = req.params;
  User.findById(userId)
    .exec()
    .then((user) => {
      if (user) {
        res.status(200).json({user});
      } else {
        res.status(400).json({
          message: 'user not found',
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.changePassword = (req, res, next) => {
  const userId = req.currentUser._id;
  const {pwd, confirmedPwd} = req.body;

  if (pwd !== confirmedPwd) {
    console.log('pwd not matched');
    return res.status(400).json({message: 'pwd are not matched'});
  }

  bcrypt.hash(pwd, 10, (err, hash) => {
    if (err) {
      return res.status(400).json({message: 'err in hash password', err});
    }

    User.findByIdAndUpdate(userId, {password: hash})
      .exec()
      .then((doc) => {
        console.log(doc, 'change pwd doc');
        next();
      })
      .catch((err) => {
        return res.status(500).json({message: 'err in change pwd', err});
      });
  });
};

exports.comparePasswords = (req, res, next) => {
  const {email, password} = req.body;

  User.find({email})
    .exec()
    .then((users) => {
      // kết quả trả về là một mảng các user, user là số nhiều

      // nếu tài khoảng không tồn tại
      if (users.length < 1) {
        return res.status(401).json({message: 'Account was not existed'});
      }

      bcrypt.compare(password, users[0].password, (err, isSame) => {
        if (err) {
          console.log(err);
          return res.status(401).json({message: 'password problem'});
        }

        if (!isSame) {
          return res.status(401).json({message: 'wrong password'});
        }

        const token = jwt.sign(
          {data: JSON.stringify(users[0]._id)},
          process.env.JWT_KEY,
          {
            expiresIn: '1d',
          }
        );

        return res.status(200).json({token, currentUser: users[0]});
      });
    })
    .catch((err) => {
      res.status(500).json({err});
    });
};

exports.signInWithGoogle = (req, res, next) => {
  const {email} = req.body;

  User.find({email})
    .exec()
    .then((users) => {
      // kết quả trả về là một mảng các user, user là số nhiều

      // nếu tài khoảng không tồn tại
      if (users.length < 1) {
        return res.status(401).json({message: 'Account was not existed'});
      }

      const token = jwt.sign(
        {data: JSON.stringify(users[0]._id)},
        process.env.JWT_KEY,
        {
          expiresIn: '1d',
        }
      );

      return res.status(200).json({token, currentUser: users[0]});
    })
    .catch((err) => {
      res.status(500).json({err});
    });
};

exports.deleteUser = (req, res, next) => {
  User.deleteOne({_id: req.params.userId}) // params có "s", plural
    .exec()
    .then((user) => {
      res.status(200).json({
        message: 'User deleted',
        id: req.params.userId,
        user,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({error});
    });
};

exports.createUser = (req, res, next) => {
  const {currentUser} = req;

  const token = jwt.sign(
    {data: JSON.stringify(currentUser._id)},
    process.env.JWT_KEY,
    {
      expiresIn: '1d',
    }
  );
  console.log(currentUser, token);
  return res
    .status(200)
    .json({message: 'new user created', token, currentUser});
};

exports.updateAvatar = (req, res, next) => {
  const currentId = req.currentUser._id;
  const {newImg} = req.body;
  User.findByIdAndUpdate(currentId, {avatar: newImg})
    .exec()
    .then((doc) => {
      return res.status(200).json({message: 'avatar changed', doc});
    })
    .catch((err) => {
      return res.status(500).json({message: 'err in changing avatar', err});
    });
};

exports.updateUser = (req, res, next) => {
  const currentId = req.currentUser._id;
  console.log(currentId);
  const {username, role, email} = req.body;
  User.findByIdAndUpdate(currentId, {username, role, email})
    .exec()
    .then((doc) => {
      return res.status(200).json({message: 'info changed', doc});
    })
    .catch((err) => {
      return res.status(500).json({message: 'err in changing info', err});
    });
};

exports.updatePassword = (req, res, next) => {
  return res.status(200).json({
    message: 'password changed',
    isChanged: true,
  });
};
