const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Student = require('../models/student');

// Welcome Page
router.get('/', (req, res) => res.render('hostel'));

router.get('/admin', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>{
  if(req.user.role == 'admin'){
    res.render('dashboard', {user: req.user})
  }
  else{
    Student.find({ email: req.user.email })
    .exec()
    .then(student => {
      if (student.length >= 1) {
        res.render('dashboard-student', {user:student[0]})
      }
      else{
        res.render('dashboard-student', {user:""})
      }
    })
  }
});

module.exports = router;
