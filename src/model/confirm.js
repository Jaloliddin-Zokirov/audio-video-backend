const mongoose = require('mongoose');

const Confirm1 = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: String,
        default: null
    }
});

const Confirm = mongoose.model('Confirm', Confirm1);

module.exports = Confirm;
