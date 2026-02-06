const express = require('express')
const broute = express.Router()
let productmodel = require('../model/productmodel');
const reviewmodel = require('../model/reviewmodel');
const {storeReviewData} = require('../userjs/storeReviewData')


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

broute.get('/who',async(req,res)=>{
    res.render('userorseller')
})

broute.get('/user',async(req,res)=>{
    res.redirect('/userinfo')
})

broute.get('/seller', async(req,res)=>{
    
    res.redirect('/sellerinfo')
})

broute.get('/products/:cat',async(req,res)=>{
    const category=req.params.cat;
    try {
        const products = await productmodel.find({category:category})
        res.render('products', { products,category});
    } catch (error) {
        console.error('Error fetching workers:', error);
        res.status(500).send('Error fetching products');
    }
})


broute.get('/product/:id', async(req,res)=>{
  const product = await productmodel.findOne({productId:req.params.id})
  const prods = await productmodel.find({category:product.category})
  const reviews = await reviewmodel.find({ productId:product.productId }).populate('userId', 'name');
  const message = req.session.message;
  req.session.message = null;
  req.session.productId = product.productId;
  res.render('product',{product,prods,message,reviews})
})

broute.get('/review/:id',async(req,res)=>{
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
