const mongoose = require('mongoose');

const sellermodel = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
    phone: String,
    role: { type: String, enum: ['user', 'seller'], default: 'seller' },
    company_name: String,
   sellerId: { type: String, unique: true,required:true },

    resetOTP: String,
    resetOTPExpiry: Date
});

module.exports = mongoose.model('sellerform', sellermodel);
