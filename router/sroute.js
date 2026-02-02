const express = require('express')
const sroute = express.Router()
let sellermodel = require('../model/sellermodel')
const {storeSellerData} = require('../sellerjs/storeSellerData')
const {storeProductData} = require('../sellerjs/storeProductData')
const upload = require('../sellerjs/multer')
let productmodel = require('../model/productmodel')

sroute.get('/sellerinfo',async(req,res)=>{
    res.render('dashboard/sellerinfo')
})

sroute.post('/sellerinfo', async (req, res) => {
    req.body.email = req.session.email;
    req.body.password = req.session.password;
    const result = await storeSellerData(req, res);
    if (result.success) {

        res.redirect('/home');

           
    } else {
        res.send('Sorry, try again later.');
    }
});

sroute.get('/home', async (req, res) => {
    const seller = await sellermodel.findOne(req.session.email);
    const products = await productmodel.find();
    res.render('dashboard/shome', { seller, products })
})


sroute.get('/addprod', async(req,res)=>{
    const seller = await sellermodel.findOne(req.session.email);
    res.render('dashboard/addprod', {seller})
})


sroute.get('/add',async(req,res)=>{
    res.render('dashboard/prodform',{
    errorMessage: null,
    successMessage: null,
     redirectTo: null
  });
})

sroute.post(
  '/add',
  upload.fields([{ name: 'productImages', maxCount: 12 }]),
  async (req, res) => {
    const result = await storeProductData(req, res);

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



module.exports = sroute;