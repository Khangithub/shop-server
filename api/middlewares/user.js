const jwt = require ('jsonwebtoken');
const User = require ('../models/user');

exports.auth = async (req, res, next) => {
  try {
    let token = req.headers.authorization.split (' ')[1];
    let {data} = jwt.verify (token, process.env.JWT_KEY);
    let myId = JSON.parse (data);

    const user = await User.findById (myId).select ('-password -__v').exec ();
    if (user) {
      req.currentUser = user;
      console.log ('auth done', user.username);
      next ();
    } else {
      return res.status (400).json ({
        message: 'user not found',
      });
    }
  } catch (err) {
    return res.status (500).json ({err});
  }
};

exports.isUserExistFromMail = (req, res, next) => {
  User.find ({email: req.body.email})
    .exec ()
    .then (users => {
      if (users.length >= 1 || users.username >= 1) {
        console.log ('user already exists');
        return res.status (409).json ({
          message: 'user already exists',
        });
      } else {
        next ();
      }
    })
    .catch (err => {
      console.log ('check mail err', err);
    });
};

exports.compareDefaultPassowrd = (req, res, next) => {
  const {email, password} = req.body;

  if (password === process.env.DEFAULT_PASSWORD) {
    User.find ({email})
      .exec ()
      .then (users => {
        const token = jwt.sign (
          {data: JSON.stringify (users[0]._id)},
          process.env.JWT_KEY,
          {
            expiresIn: '1d',
          }
        );

        return res.status (200).json ({token, currentUser: users[0]});
      })
      .catch (err => {
        res.status (500).json ({err});
      });
  } else {
    console.log ('pwd is not default');
    next ();
  }
};
