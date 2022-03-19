require('dotenv').config();
const nodemailer = require('nodemailer');

exports.createSignUpMail = (req, res, next) => {
  const {username, role, email} = req.body;
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  var mailOptions = {
    from: 'sale.shopeeholic@gmail.com',
    to: email,
    subject: 'Shopeeholic Signup Confirm',
    text: `Hi, Mr/Mrs. ${username}, 
        you have created a Shoppeholic account, 
        please keep in mind following: 
        Email: ${email},
        Password: tester,
        Role: ${role},
        If you want to change anything about your account, 
        you can modify it in Setting >> Personalize. 
        Thank you and have a good day.`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err, 'err in sending mail');
     next()
    } else {
      console.log('Email sent: ' + info.response);
     next()
    }
  });
};
