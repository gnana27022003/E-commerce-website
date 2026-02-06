const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine: { type: String, required: true }, 
    locality: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    landmark: { type: String },
    alternatePhone:{type:String},
    type: { type: String, enum: ["home", "work"], default: "home" },
  },
  { _id: true }
);

const usermodel = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
    phone: String,
     addresses: {
      type: [addressSchema],
      default: [],
    },
    role: { type: String, enum: ['user', 'seller'], default: 'user' },
    userId: { type: String, unique: true },

    resetOTP: String,
    resetOTPExpiry: Date
});

module.exports = mongoose.model('userform', usermodel);
