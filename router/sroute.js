const express = require('express');
const sroute = express.Router();

let sellermodel = require('../model/sellermodel');
let productmodel = require('../model/productmodel');

const { storeSellerData } = require('../sellerjs/storeSellerData');
const { storeProductData } = require('../sellerjs/storeProductData');
const { updateProductData } = require('../sellerjs/updateProductData');
const Order = require('../model/ordermodel')
const upload = require('../sellerjs/multer');
const {authMiddleware} = require('../middleware/authMiddleware')

sroute.get('/sellerinfo', async (req, res) => {
  res.render('dashboard/sellerinfo');
});

sroute.post('/sellerinfo', async (req, res) => {
  req.body.email = req.session.email;
  req.body.password = req.session.password;

  const result = await storeSellerData(req, res);

  if (result.success) {
    return res.redirect('/home');
  } else {
    return res.send('Sorry, try again later.');
  }
});


sroute.get('/home',authMiddleware, async (req, res) => {
  const seller = await sellermodel.findOne({ email: req.session.email });
  const products = await productmodel.find({ sellerId: req.session.sellerId });
  req.session.sellerId = seller.sellerId
  console.log(req.session.sellerId);
  const message = req.session.message;
  req.session.message = null;

  res.render('dashboard/shome', {
    seller,
    products,
    message
  });

  
});

sroute.get('/ordersdet', authMiddleware, async (req, res) => {
  const seller = await sellermodel.findOne({sellerId:req.session.sellerId})
  const orders = await Order.find({
    "items.sellerId": req.session.sellerId
  });

  res.render('dashboard/orders', { orders,seller });

});


sroute.get('/addprod',authMiddleware, async (req, res) => {
  const seller = await sellermodel.findOne({ email: req.session.email });
  res.render('dashboard/addprod', { seller });
});

sroute.get('/add',authMiddleware, async (req, res) => {
  res.render('dashboard/prodform', {
    errorMessage: null,
    successMessage: null,
    redirectTo: null
  });
});

sroute.post(
  '/add',
  upload.fields([{ name: 'productImages', maxCount: 12 }]),
  async (req, res) => {

    const seller= await sellermodel.findOne({email:req.session.email})
    const result =await storeProductData(req, res);

    if (result.success) {
      return res.render('dashboard/prodform', {
        errorMessage: null,
        successMessage: 'Product added successfully',
        redirectTo: '/addprod'
      });
    } else {
      return res.render('dashboard/prodform', {
        errorMessage: result.message,
        successMessage: null,
        redirectTo: null
      });
    }
  }
);



sroute.get('/profile',authMiddleware, async (req, res) => {
  const seller = await sellermodel.findOne({ email: req.session.email });
  res.render('dashboard/profile', { seller });
});


sroute.get('/sproduct/:id',authMiddleware, async (req, res) => {
  const product = await productmodel.findOne({ productId: req.params.id });
  
  if (!product) {
    return res.status(404).send('Product not found');
  }

  res.render('dashboard/product', { product });
});



sroute.post(
  '/sproduct/update/:id',
  upload.fields([{ name: 'productImages', maxCount: 12 }]),
  async (req, res) => {
    const result = await updateProductData(req, res);
    req.session.message = result.message;
    return res.redirect('/home');
  }
);


sroute.post('/sproduct/delete/:id',async(req,res)=>{
  const prod = await productmodel.deleteOne({productId:req.params.id});
  if(prod.deletedCount===1){
   req.session.message = 'Deleted Successfully'
   console.log('deleted')
  
  } 
  else{
    req.session.message = 'Deletion Failed Please try again later';
  console.log(prod)
  }
  return res.redirect('/home');
})


sroute.get('/order/:id',authMiddleware, async (req,res)=>{
  const order = await Order.findOne({
    orderId: req.params.id,
    "items.sellerId": req.session.sellerId
  })

  if(!order) return res.status(404).send('Order not found')

  res.render('dashboard/orderform', { order })
})



sroute.post('/order/update/:id', async (req, res) => {
  try {
    const allowedStatus = ['placed','shipped','outfordelivery','cancelled'];

    if (!allowedStatus.includes(req.body.orderStatus)) {
      return res.status(400).send('Invalid order status');
    }

    await Order.updateOne(
      {
        orderId: req.params.id,
        "items.sellerId": req.session.sellerId
      },
      {
        $set: { orderStatus: req.body.orderStatus }
      }
    );

    return res.redirect('/ordersdet');

  } catch (err) {
    console.error(err);
    res.status(500).send('Order update failed');
  }
});



module.exports = sroute;
