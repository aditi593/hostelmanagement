const mongoose = require('mongoose');

const messSchema = mongoose.Schema({
    sun: { type: String, required: true, unique: false },
    mon: { type: String, required: false, unique: false },
    tue: { type: String, required: false, unique: false },
    wed: { type: String, required: false, unique: false },
    thu: { type: String, required: false, unique: false },
    fri: { type: String, required: false, unique: false },
    sat: { type: String, required: false, unique: false },
    lsun: { type: String, required: true, unique: false },
    lmon: { type: String, required: false, unique: false },
    ltue: { type: String, required: false, unique: false },
    lwed: { type: String, required: false, unique: false },
    lthu: { type: String, required: false, unique: false },
    lfri: { type: String, required: false, unique: false },
    lsat: { type: String, required: false, unique: false },
    message: { type: String, required: false, unique: false }
},
{
    timestamps : true
});

module.exports = mongoose.model('Mess', messSchema);