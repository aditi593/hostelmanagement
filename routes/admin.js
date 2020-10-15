const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const {register, request, complaint} = require('../config/html');
// Load Student model
const Student = require('../models/student');
const User = require('../models/User');
const Notice = require('../models/notice');
const Request = require('../models/request');
const Complaint = require('../models/complaint');
const Mess = require('../models/mess');
const Attendence = require('../models/attendence');
const Room = require('../models/room');

const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');

//all requests to show for admin
router.get('/register/view', ensureAuthenticated, (req,res,next)=>{
  var rm=[];
    if(req.user.role == "admin"){
      Room.find({  })
          .exec()
          .then(room => {
            for(let i=0;i<room.length; i++){
              if(room[i].status <= 3){
                rm.push(room[i]);
              }
            }
          })
      Student.find({ status: "deactive" })
      .exec()
      .then(student => {
        if (student.length >= 1) {
          JSON.stringify(rm);
          res.render('register-view', {student:student, rm:rm})
        }
        else{
          res.render('register-view', {student:"", rm:rm})
        }
      })
    }
    else{
      res.send("Unauthorized access")
    }
});
//accept application
router.post('/register/add', ensureAuthenticated, (req,res,next)=>{
    if(req.user.role == "admin"){
      var id = req.body._id;
      var room_no = req.body.room;
      Room.findOneAndUpdate({room_no:room_no},{ $inc: { status: 1 } }, {new: true }, function(err, result){if(err){return res.send(err)}})
      Student.findOneAndUpdate({_id:id},{"status": "active", "room": room_no}, function(err, result){
        if(err){
            res.send(err)
        }
        else{
            const std = new User({
                name: result.name,
                email: result.email,
                password: "-",
                token: new mongoose.Types.ObjectId(),
                role:"student"
              });
              std
                .save()
                .then(result => {                  
                  sendMail("Your Application is Accepted!", register, result.email)
                  res.redirect('/admin/register/view')
                })
                .catch(err => {
                  res.send(err)
              });
        }
    })
    }
    else{
      req.send('Unauthorized access')
    }
});

//Edit Info of student
router.get('/student/edit/:id', ensureAuthenticated,(req,res,next)=>{
  if(req.user.role == "admin"){
    Student.find({ _id: req.params.id })
    .exec()
    .then(student => {
      if (student.length >= 1) {
        res.render('student-edit', {student:student})
      }
      else{
        res.render('student-edit', {student:""})
      }
    })
  }
  else{
    res.send('Unauthorized Access')
  }
})
router.post('/student/edit/:id', ensureAuthenticated,(req,res,next)=>{
  if(req.user.role == "admin"){
    var id = req.params.id;
      Student.findOneAndUpdate({_id:id},
        {
          name: req.body.name,
          roll_no: req.body.roll_no,
          dept: req.body.dept,
          email: req.body.email,
          number: req.body.number,
          add: req.body.add
        }, 
        function(err, result){
        if(err){
            res.send(err)
        }
        else{
            res.redirect('/admin/students')
          }
      })
  }
  else{
    res.send('Unauthorized Access')
  }
})

//all students
router.get('/students', ensureAuthenticated, (req,res,next) =>{
  if(req.user.role =="admin"){
    Student.find({ status: "active" })
    .exec()
    .then(student => {
      if (student.length >= 1) {
        res.render('students-admin', {student:student})
      }
      else{
        res.render('students-admin', {student:""})
      }
    })
  }
  else{
    res.send('Unauthorized access')
  }
})

//accept request
router.get('/request', ensureAuthenticated, (req,res,next)=>{
  if(req.user.role == "admin"){
    Request.find({ status: "deactive" })
    .exec()
    .then(request => {
      if (request.length >= 1) {
        res.render('request-admin', {request:request, req:req})
      }
      else{
        res.render('request-admin', {request:""})
      }
    })
  }
  else{
    res.send('Unauthorized access')
  }
})
router.get('/request/add/:id', ensureAuthenticated, (req,res,next)=>{
  if(req.user.role == "admin"){
    var id = req.params.id;
    Request.findOneAndUpdate({_id:id},{"status": "active"}, function(err, result){
      if(err){
          res.send(err)
      }
      else{
          res.redirect('/admin/request')
        }
    })
  }
  else{
    res.send('Unauthorized access')
  }
})

//accept complaint
router.get('/complaint', ensureAuthenticated, (req,res,next)=>{
  if(req.user.role == "admin"){
    Complaint.find({ status: "deactive" })
    .exec()
    .then(complaint => {
      if (complaint.length >= 1) {
        res.render('complaint-admin', {complaint:complaint})
      }
      else{
        res.render('complaint-admin', {complaint:""})
      }
    })
  }
  else{
    res.send('Unauthorized access')
  }
})
router.get('/complaint/add/:id', ensureAuthenticated, (req,res,next)=>{
  if(req.user.role == "admin"){
    var id = req.params.id;
    Complaint.findOneAndUpdate({_id:id},{"status": "active"}, function(err, result){
      if(err){
          res.send(err)
      }
      else{
          res.redirect('/admin/complaint')
        }
    })
  }
  else{
    res.send('Unauthorized access')
  }
})

//notice
router.get('/notice', ensureAuthenticated, (req,res,next)=>{
  if(req.user.role == "admin"){
    Notice.find({ status: "published" })
    .exec()
    .then(notice => {
      if (notice.length >= 1) {
        res.render('notice-admin', {notice:notice})
      }
      else{
        res.render('notice-admin', {notice:""})
      }
    })
  }
  else{
    res.send('Unauthorized access')
  }
})
router.post('/notice/add', ensureAuthenticated, (req,res,next)=>{
  if(req.user.role == "admin"){
      const not = new Notice({
        head:req.body.head,
        description:req.body.description,
        status:"published"
      });
      not.save().then(notice => {
        res.redirect('/admin/notice');
      })
  }
  else{
    res.send('Unauthorized access')
  }
})
router.get('/notice/delete/:id', ensureAuthenticated, (req,res,next)=>{
  if(req.user.role == "admin"){
    var id = req.params.id;
    Notice.findOneAndUpdate({_id:id},{"status": "archive"}, function(err, result){
      if(err){
          res.send(err)
      }
      else{
          res.redirect('/admin/notice')
        }
    })
  }
  else{
    res.send('Unauthorized access')
  }
})

//mess
router.get('/mess', ensureAuthenticated, (req,res,next)=>{
  if(req.user.role == "admin"){
    Mess.find({  })
    .exec()
    .then(mess => {
      if (mess.length >= 1) {
        res.render('mess-admin', {mess:mess})
      }
      else{
        res.render('mess-admin', {mess:""})
      }
    })
  }
  else{
    res.send('Unauthorized access')
  }
})
router.post('/mess/update/:id', ensureAuthenticated, (req,res,next)=>{
  if(req.user.role == "admin"){
      var id = req.params.id;
      Mess.findOneAndUpdate({_id:id},
        {
          sun: req.body.sun,
          mon: req.body.mon,
          tue: req.body.tue,
          thu: req.body.thu,
          wed: req.body.wed,
          fri: req.body.fri,
          sat: req.body.sat,
          lsun: req.body.lsun,
          lmon: req.body.lmon,
          ltue: req.body.ltue,
          lthu: req.body.lthu,
          lwed: req.body.lwed,
          lfri: req.body.lfri,
          lsat: req.body.lsat,
          message: req.body.message
        }, 
        function(err, result){
        if(err){
            res.send(err)
        }
        else{
            res.redirect('/admin/mess')
          }
      })
  }
  else{
    res.send('Unauthorized access')
  }
  //For creating first time
  // const mes = new Mess({
  //     "sun": req.body.sun,
  //     "mon": req.body.mon,
  //     "tue": req.body.tue,
  //     "thu": req.body.thu,
  //     "wed": req.body.wed,
  //     "fri": req.body.fri,
  //     "sat": req.body.sat,
  //     "message": req.body.message
  // });
  // mes.save().then(mess => {
  //   res.redirect('/admin/mess');
  // })
})

//attendence
router.get('/attendence', ensureAuthenticated, (req,res,next)=>{
  if(req.user.role == "admin"){
    Student.find({ status: "active" })
    .exec()
    .then(student => {
      if (student.length >= 1) {
        res.render('attendence-admin', {students:student})
      }
      else{
        res.render('attendence-admin', {students:""})
      }
    })
  }
})
router.post('/attendence/add', ensureAuthenticated, (req,res,next)=>{
  if(req.user.role == "admin"){
    const att = new Attendence({
      roll_no:req.body.rns
      });
    att.save().then(att => {
      res.redirect('/admin/attendence');
    })
  }
  else{
    res.send('Unauthorized access')
  }
})

//attendence view
router.get('/attendence/view', ensureAuthenticated, (req,res,next)=>{
  if(req.user.role == "admin"){
    Attendence.find({  })
    .sort({createdAt:-1})
    .exec()
    .then(att => {
      if (att.length >= 1) {
        res.render('attendence-view-admin', {attendence:att})
      }
      else{
        res.render('attendence-view-admin', {attendence:""})
      }
    })
  }
})

//room view
router.get('/room', ensureAuthenticated, (req,res,next)=>{
  if(req.user.role == "admin"){
    Room.find({  })
    .exec()
    .then(room => {
      if (room.length >= 1) {
        res.render('room-view', {room:room})
      }
      else{
        res.render('room-view', {room:""})
      }
    })
  }
  else{
    res.send('Unauthorized Access')
  }
})
router.post('/room', ensureAuthenticated, (req,res,next)=>{
  if(req.user.role == "admin"){
    const r = new Room({
      room_no:req.body.room,
      status:0
      });
    r.save().then(r => {
      res.redirect('/admin/room');
    })
  }
  else{
    res.send('Unauthorized Access')
  }
})
router.get('/room/delete/:id', ensureAuthenticated, (req,res,next)=>{
  if(req.user.role == "admin"){
    var id = req.params.id;
    Room.findOneAndDelete({_id:id}, function(err, result){
      if(err){
          res.send(err)
      }
      else{
          res.redirect('/admin/room')
        }
    })
  }
  else{
    res.send('Unauthorized Access')
  }
})


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
