const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  token: mongoose.Schema.Types.ObjectId,
  role: { 
    type:String 
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
