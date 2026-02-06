const mongoose = require('mongoose');

const productmodel = new mongoose.Schema({
    productId: { type: String, required: true, unique: true },
    productName: { type: String, required: true },
    productDetails: String,
    stock: { type: Number, default: 0 },
    sellerId:{ type: String, required: true},
    price:{type: Number, default: 0},
    avgRating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    productImages: [{
    filename: { type: String },
    contentType: { type: String },
    uploadDate: { type: Date },
    metadata: { type: Object }
}], 
    orders: { type: Number, default: 0 },
    remaining: { type: Number, default: 0 },
    productStatus: { type: String, enum: ['available', 'unavailable'], default: 'available' },
    category: { 
        type: String, 
        enum: ['clothes', 'electronics', 'beauty', 'mobiles', 'appliances'], 
        required: true 
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productmodel);
