const mongoose = require('mongoose');

const attendenceSchema = mongoose.Schema({
    roll_no: { type: String, required: true, unique: false }
},
{
    timestamps : true
});

module.exports = mongoose.model('Attendence', attendenceSchema);