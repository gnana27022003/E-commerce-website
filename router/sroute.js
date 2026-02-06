const express = require('express');
const sroute = express.Router();

let sellermodel = require('../model/sellermodel');
let productmodel = require('../model/productmodel');

const { storeSellerData } = require('../sellerjs/storeSellerData');
const { storeProductData } = require('../sellerjs/storeProductData');
const { updateProductData } = require('../sellerjs/updateProductData');

const upload = require('../sellerjs/multer');


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


sroute.get('/home', async (req, res) => {
  const seller = await sellermodel.findOne({ email: req.session.email });
  const products = await productmodel.find();

  const message = req.session.message;
  req.session.message = null;

  res.render('dashboard/shome', {
    seller,
    products,
    message
  });
});



sroute.get('/addprod', async (req, res) => {
  const seller = await sellermodel.findOne({ email: req.session.email });
  res.render('dashboard/addprod', { seller });
});

sroute.get('/add', async (req, res) => {
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
    req.session.sellerId=seller.uniqueId
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



sroute.get('/profile', async (req, res) => {
  const seller = await sellermodel.findOne({ email: req.session.email });
  res.render('dashboard/profile', { seller });
});


sroute.get('/sproduct/:id', async (req, res) => {
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




module.exports = sroute;
