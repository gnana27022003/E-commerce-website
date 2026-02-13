const express = require('express')
const broute = express.Router()
let productmodel = require('../model/productmodel');
const reviewmodel = require('../model/reviewmodel');
const {storeReviewData} = require('../userjs/storeReviewData');
const { authMiddleware } = require('../middleware/authMiddleware');


broute.get('/', async(req,res) => {
    const products = await productmodel.find();
    res.render('home', {
    loggedIn: req.session.loggedIn || false,
    user: req.session.user || null,
    products
});

})

broute.get('/logout', async(req,res)=>{
    req.session.destroy(err => {
        if (err) {
            return res.send("Logout failed");
        }
        res.redirect('/');
    });
})

broute.get('/who',authMiddleware,async(req,res)=>{
    res.render('userorseller')
})

broute.get('/user',async(req,res)=>{
    res.redirect('/userinfo')
})

broute.get('/seller', async(req,res)=>{
    
    res.redirect('/sellerinfo')
})

broute.get('/products/:cat',authMiddleware,async(req,res)=>{
    const category=req.params.cat;
    try {
        const products = await productmodel.find({category:category})
        res.render('products', { products,category,loggedIn: req.session.loggedIn || false});
    } catch (error) {
        console.error('Error fetching workers:', error);
        res.status(500).send('Error fetching products');
    }
})


broute.get('/product/:id',authMiddleware, async (req, res) => {
  try {
    const product = await productmodel.findOne({ productId: req.params.id });
    req.session.productId = product.productId;

    if (!product) {
      console.log("Invalid productId:", req.params.id);
      return res.status(404).send("Page not found");
 // or res.redirect('/')
    }

    const prods = await productmodel.find({
      category: product.category,
      productId: { $ne: product.productId }
    });

    const reviews = await reviewmodel
      .find({ productId: product.productId })
      .populate('userId', 'name');

    res.render('product', {
      product,
      prods,
      reviews,
      message: req.session.message,
      loggedIn: req.session.loggedIn || false
    });

    req.session.message = null;
    
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


broute.get('/review/:id',authMiddleware,async(req,res)=>{
    const productId =  req.params.id;
    res.render('review',{productId})
})

broute.post('/review/:id',async(req,res)=>{

    const result = await storeReviewData(req,res);

    if(result.success){
        req.session.message = 'Review Added Successfully'
        
    }
    else{
        req.session.message = 'Unable to Add your review please try again later!!'

    }
    res.redirect(`/product/${req.params.id}`)
})



module.exports = broute;
