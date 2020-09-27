const mongoose = require('mongoose');

const requestSchema = mongoose.Schema({
    roll_no: { type: String, required: true, unique: false },
    category: { type: String, required: true, unique: false },
    description: { type: String, required: true, unique: false },
    status: { type: String, required: false, unique: false }
},
{
    timestamps : true
});

module.exports = mongoose.model('Request', requestSchema);