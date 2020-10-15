const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const nodemailer = require('nodemailer');
const welcome = require('../config/html').welcome;

// Load Student model
const Student = require('../models/student');
const Notice = require('../models/notice');
const Request = require('../models/request')
const Complaint = require('../models/complaint');
const Mess = require('../models/mess');

const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');

//Student Routes student/
//register
router.get('/register', forwardAuthenticated, (req,res,next)=>{
    res.render('register-student')
});
router.post('/register', forwardAuthenticated, (req,res,next)=>{
    Student.find({ email: req.body.email })
    .exec()
    .then(student => {
      if (student.length >= 1) {
        res.render('register-student')//message sed pending
      } else {
            const std = new Student({
              name: req.body.name,
              email: req.body.email,
              add: req.body.add,
              number: req.body.number,
              dept: req.body.dept,
              roll_no : req.body.roll_no,
              status: "deactive"
            });
            std
              .save()
              .then(result => {
                // console.log(result);
                sendMail('You have registered',welcome,result.email)
                res.redirect('/')
              })
              .catch(err => {
                res.send(err)
            });
        }
    });
});

//request
router.get('/request', ensureAuthenticated, (req,res,next)=>{
  res.render('request-student')
})
//request add
router.post('/request/add', ensureAuthenticated, (req,res,next)=>{
  const requ = new Request({
    roll_no:req.body.roll_no,
    category:req.body.category,
    description:req.body.description,
    status:"deactive"
  });
  requ.save().then(notice => {
    res.redirect('/student/request');
  })
})

//complaint
router.get('/complaint', ensureAuthenticated, (req,res,next)=>{
  res.render('complaint-student')
})
//complaint add
router.post('/complaint/add', ensureAuthenticated, (req,res,next)=>{
  const comp = new Complaint({
    roll_no:req.body.roll_no,
    category:req.body.category,
    description:req.body.description,
    status:"deactive"
  });
  comp.save().then(notice => {
    res.redirect('/student/complaint');
  })
})

//notice
router.get('/notice', ensureAuthenticated, (req,res,next)=>{
  Notice.find({ status: "published" })
  .exec()
  .then(notice => {
    if (notice.length >= 1) {
      res.render('notice-student', {notice:notice})
    }
    else{
      res.render('notice-student', {notice:""})
    }
  })
})

//mess
router.get('/mess', ensureAuthenticated, (req,res,next)=>{
  Mess.find({  })
  .exec()
  .then(mess => {
    if (mess.length >= 1) {
      res.render('mess-student', {mess:mess})
    }
    else{
      res.render('mess-student', {mess:""})
    }
  })
})

//mail sender
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
    html: msg
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
