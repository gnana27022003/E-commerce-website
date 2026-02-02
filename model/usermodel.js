const mongoose = require('mongoose');

const usermodel = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
    phone: String,
    role: { type: String, enum: ['user', 'seller'], default: 'user' },
    uniqueId: { type: String, unique: true },

    resetOTP: String,
    resetOTPExpiry: Date
});

module.exports = mongoose.model('userform', usermodel);
