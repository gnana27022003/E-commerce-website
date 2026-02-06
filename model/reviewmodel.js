const mongoose = require('mongoose');


const reviewmodel = new mongoose.Schema({
    productId: { type: String, required: true, index: true },
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userform',
    required: true
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewmodel);
