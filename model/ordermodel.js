const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },

    quantity: { type: Number, required: true },
    price: { type: Number, required: true }, // snapshot price

    sellerId: { type: String },
    productImage: { type: String }
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,

    addressLine: String,
    locality: String,
    city: String,
    state: String,
    pincode: String,
    landmark: String,
  },
  { _id: false }
);

const paymentSchema = new mongoose.Schema(
  {
   transactionId: {
   type: String,
   unique: true,
   sparse: true
}
, 
    paymentMethod: {
      type: String,
      enum: ["card", "upi", "cod"],
    },

    amountPaid: { type: Number, required: true },
    currency: { type: String, default: "INR" },

    paidAt: Date,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true },

    userId: { type: String, required: true },
    email: { type: String },

    items: { type: [orderItemSchema], required: true },

    shippingAddress: { type: shippingAddressSchema, required: true },

    payment: { type: paymentSchema, required: true },
    
    totalAmount: { type: Number, required: true },

    orderStatus: {
      type: String,
      enum: ["placed", "shipped", "outfordelivery", "cancelled"],
      default: "placed",
    },

    invoiceNumber: { type: String,unique:true },
    orderedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
