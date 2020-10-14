const mongoose = require('mongoose')
const express = require('express');
const router = express.Router();
const path = require('path');


//Security 
const { forwardAuthenticated, ensureAuthenticated } = require('../config/auth');

// Chat entry Page
// router.get('/user', (req, res) => {
//     res.sendFile(path.join(__dirname+'public/index.html'));
// });
app.get('/user', express.static('public'))

module.exports = router;
