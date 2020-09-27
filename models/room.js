const mongoose = require('mongoose');

const roomSchema = mongoose.Schema({
    room_no: { type: String, required: true, unique: false },
    status: { type: Number, required: false, unique: false, default:0 }
},
{
    timestamps : true
});

module.exports = mongoose.model('Room', roomSchema);