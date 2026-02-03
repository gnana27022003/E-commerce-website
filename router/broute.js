const express = require('express')
const broute = express.Router()
let productmodel = require('../model/productmodel')

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




module.exports = broute;
