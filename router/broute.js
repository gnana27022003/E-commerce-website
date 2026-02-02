const express = require('express')
const broute = express.Router()

broute.get('/', async(req,res) => {
    res.render('Home', {
    loggedIn: req.session.loggedIn || false,
    user: req.session.user || null
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
