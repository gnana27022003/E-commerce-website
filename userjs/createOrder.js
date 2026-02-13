const ordermodel = require("../model/ordermodel");
const usermodel = require("../model/usermodel");
const productmodel = require("../model/productmodel");
const { v4: uuidv4 } = require("uuid");

const createOrder = async (req, res) => {
  try {
    /* ================= BASIC INPUT ================= */

    const userId = req.session.userId;
    const addressId = req.session.selectedAddressId;
    const productId = req.session.productId;   
    const paymentMethod = req.body.paymentMethod; 

    if (!userId || !addressId || !productId || !paymentMethod) {
      throw new Error("Missing order details");
    }

    /* ================= GET USER + ADDRESS ================= */

    const user = await usermodel.findOne(
      { userId, "addresses._id": addressId },
      { email: 1, addresses: { $elemMatch: { _id: addressId } } }
    );

    if (!user || !user.addresses.length) {
      throw new Error("Address not found");
    }

    const addr = user.addresses[0];

    const shippingAddress = {
      name: addr.name,
      phone: addr.phone,
      addressLine: addr.addressLine,
      locality: addr.locality,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      landmark: addr.landmark,
    };

    /* ================= GET PRODUCT ================= */

    const product = await productmodel.findOne({ productId });

    if (!product) {
      throw new Error("Product not found");
    }

    /* ================= BUILD ORDER ITEM ================= */

   const items = [
  {
    productId: product.productId,
    productName: product.productName,
    quantity: req.session.quantity,
    price: product.price,
    sellerId: product.sellerId,

    productImage: product.productImages?.[0]?.filename || null
  },
];


    const totalAmount = product.price;

    /* ================= PAYMENT ================= */

    const payment = {
      transactionId:
        paymentMethod === "cod" ? null : "TXN" + Date.now(),
      paymentGateway: paymentMethod === "cod" ? "COD" : "Mock",
      paymentMethod,
      amountPaid: totalAmount,
      paidAt: paymentMethod === "cod" ? null : new Date(),
    };

    /* ================= CREATE ORDER ================= */

    const order = await ordermodel.create({
      orderId: "ORD" + Date.now(),
      userId,
      email: user.email,
      items,
      shippingAddress,
      payment,
      totalAmount,
      invoiceNumber: "INV-" + uuidv4().slice(0, 8),
    });

    /* ================= CLEAN SESSION ================= */

    delete req.session.productId; // prevent duplicate orders

    return { success: true ,order:order};

  } catch (err) {
    console.error("ORDER ERROR:", err.message);
    return { success: false };
  }
};

module.exports = { createOrder };
