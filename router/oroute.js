const express = require('express')
const oroute = express.Router()
const productmodel = require('../model/productmodel')
const {createOrder} = require('../userjs/createOrder')
const { createCart } = require('../userjs/createCart');
const Cart = require('../model/cartmodel')
const Order = require('../model/ordermodel')

oroute.get('/payment',async(req,res)=>{
    const product = await productmodel.findOne({productId: req.session.productId})
    
    res.render('payment',{
        loggedIn:req.session.loggedIn,
        product:product,
        message:req.session.message
    })
    req.session.message = null
})

oroute.post('/payment',async(req,res)=>{
    
    const result = await createOrder(req,res);
    console.log(req.body.paymentMethod);

    if(result.success == true){
        res.render('orderplaced',{
            loggedIn:req.session.loggedIn
        })
    }
    else{
        req.session.message = 'payment failed please try again later'
        res.redirect('/payment')
    }

})
oroute.post("/cart", async (req, res) => {
    const { productId } = req.body;
    const result = await createCart(req, productId);
    res.json(result); 
});


oroute.get("/cart", async (req, res) => {
    const result = await createCart(req); // no productId, just get cart

    if (!result.success || !result.cart) {
        return res.render("cart", { cartItems: [], totals: { totalAmount: 0, itemCount: 0 }, loggedIn: req.session.loggedIn || false });
    }

    const cartItems = await Promise.all(result.cart.items.map(async item => {
        const product = await productmodel.findOne({ productId: item.productId });
        return {
            productId: item.productId,
            quantity: item.quantity,
            price: item.priceSnapshot,
            name: product?.productName || "Unknown",
            image: product?.productImages[0]?.filename || null
        };
    }));

    res.render("cart", {
        cartItems,
        totals: {
            itemCount: cartItems.reduce((sum, i) => sum + i.quantity, 0),
            totalAmount: cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
        },
        loggedIn: req.session.loggedIn || false
    });
});



oroute.delete('/cart/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
        // find active cart
        const cart = await Cart.findOne({
            userId: req.session.userId || null,
            status: "active"
        });

        if (!cart) {
            return res.json({ success: false, message: "Cart not found" });
        }

        
        cart.items = cart.items.filter(
            item => item.productId !== productId
        );

       
        cart.totalAmount = cart.items.reduce(
            (sum, i) => sum + i.quantity * i.priceSnapshot,
            0
        );

        await cart.save();

        res.json({ success: true });

    } catch (err) {
        console.error(err);
        res.json({ success: false, message: "Delete failed" });
    }
});



oroute.get('/orders', async (req, res) => {
  const orders = await Order.find({
    userId: req.session.userId
  });

  if (!orders.length) {
    return res.status(404).send('No orders found');
  }

  res.render('orders', { 
    orders,
    loggedIn:req.session.loggedIn

   });
});



module.exports = oroute;