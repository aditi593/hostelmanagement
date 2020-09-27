const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  roll_no: {
    type: String,
    required: true
  },
  number: {
      type: Number,
      required: false
  },
  room: {
      type: Number
  },
  dept: {
      type: String
  },
  add: {
      type: String
  },
  status: {
      type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
