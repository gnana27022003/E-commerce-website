const Cart = require('../model/cartmodel')
const Product = require('../model/productmodel')

async function createCart(req, productId) {
    try {
        // Find active cart
        let query = { status: "active" };
        if (req.session.userId) query.userId = req.session.userId;
        else {
            if (!req.session.sessionId) req.session.sessionId = req.sessionID;
            query.sessionId = req.session.sessionId;
        }

        let cart = await Cart.findOne(query);

        if (!cart) {
            cart = await Cart.create({
                userId: req.session.userId || null,
                sessionId: req.session.sessionId || null,
                items: [],
                totalAmount: 0
            });
        }

        if (productId) {
            const product = await Product.findOne({ productId });
            if (!product) return { success: false, message: "Product not found" };

            const existingItem = cart.items.find(i => i.productId === productId);
            if (existingItem) existingItem.quantity += 1;
            else cart.items.push({ productId, quantity: 1, priceSnapshot: product.price });

            cart.totalAmount = cart.items.reduce((sum, i) => sum + i.quantity * i.priceSnapshot, 0);
            await cart.save();
        }
        console.log(cart)
        return { success: true, cart };
    } catch (err) {
        console.error(err);
        return { success: false, message: "Something went wrong" };
    }
}

module.exports = {createCart}