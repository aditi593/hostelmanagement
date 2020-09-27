const mongoose = require('mongoose');

const noticeSchema = mongoose.Schema({
    head: { type: String, required: true, unique: false },
    description: { type: String, required: false, unique: false },
    status: { type: String, required: false, unique: false }
},
{
    timestamps : true
});

module.exports = mongoose.model('Notice', noticeSchema);