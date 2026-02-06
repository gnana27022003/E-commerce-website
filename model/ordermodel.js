const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },

    quantity: { type: Number, required: true },
    price: { type: Number, required: true }, // snapshot price

    sellerId: { type: String },
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
    transactionId: { type: String },
    paymentGateway: { type: String }, // Razorpay / Stripe / COD
    paymentMethod: {
      type: String,
      enum: ["card", "upi", "netbanking", "cod"],
    },

    amountPaid: { type: Number, required: true },
    currency: { type: String, default: "INR" },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

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

    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },

    orderStatus: {
      type: String,
      enum: ["placed", "confirmed", "shipped", "delivered", "cancelled"],
      default: "placed",
    },

    invoiceNumber: { type: String },
    orderedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
