const mongoose = require('mongoose')
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const nodemailer = require('nodemailer');

// Load User model
const User = require('../models/User');
const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

router.get('/chat', ensureAuthenticated, (req, res)=>{
  res.render('chatwindow', {user: req.user});
})

// Register
router.post('/register', forwardAuthenticated, (req, res) => {
  const { name, email, password, password2, key } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2 || !key) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if(key != "secretcode"){
    errors.push({ msg: 'Incorrect Key' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
          token: new mongoose.Types.ObjectId(),
          role: "admin"
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', forwardAuthenticated, (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});


//forget
router.get('/forget', forwardAuthenticated, (req,res)=>{
  res.render('forget', {message:""})
})
router.post('/forget', forwardAuthenticated, (req,res)=>{
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if(user.length < 1){
        res.render('forget', {message:"User not found"})
      }
      else{
        var msg="https://managehostel.herokuapp.com/users/forget/"+user[0].token;
        var sub="Password Change"
        var toemail=user[0].email
        // console.log(msg)
        sendMail(sub, msg, toemail)
        res.render('forget', {message:"Link has been sent to "+toemail})
      }
    })
})

router.get('/forget/:token', forwardAuthenticated, (req,res)=>{
  User.find({ token: req.params.token })
    .exec()
    .then(user => {
      if(user.length < 1){
        res.render('forgetpass', {message:"User not find", id:""})
      }
      else{
        res.render('forgetpass', {message:"", id: user[0].token})
      }
    })
})
router.post('/forget/change/:token', forwardAuthenticated, (req,res)=>{
  bcrypt.hash(req.body.password, 10, (err, hash) => {
          User.findOneAndUpdate({token:req.params.token}, { 
              token: new mongoose.Types.ObjectId(),
              password: hash
              }, 
              function (err, docs) { 
                  if (err){ 
                    res.render('forgetpass', {message:err, id:""})
                  } 
                  else{ 
                    res.redirect('/users/login')
                  } 
              });
    })
})


// Logout
router.get('/logout', ensureAuthenticated, (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

function sendMail(sub, msg, tomail){
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "hostelmanagementsystem1@gmail.com",
      pass: "hostel1234567890"  
    }
  });
  
  var mailOptions = {
    from: '"Hostel Management System" <hostelmanagementsystem1@gmail.com>',
    to: tomail,
    subject: sub,
    text: msg
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}


module.exports = router;
