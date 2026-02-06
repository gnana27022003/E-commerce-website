const express = require('express')
const uroute = express.Router()
let usermodel = require('../model/usermodel')
const {storeUserData} = require('../userjs/storeUserData')
const {validateUser} = require('../userjs/validateUser')
const sellermodel = require('../model/sellermodel')
const bcrypt = require('bcrypt')
const transporter = require('../js/mailer');
const {addAddress} = require('../userjs/addAddress')

uroute.get('/signup', async(req,res) => {
    res.render('signup', { errorMessage: null })
})

uroute.post('/usersignup', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render('signup', {
            errorMessage: 'Email and password are required'
        });
    }

    
    const existingUser = await usermodel.findOne({ email });
    const existingUser2 = await sellermodel.findOne({email});


    if (existingUser || existingUser2) {
        return res.render('signup', {errorMessage: 'User already exists. Please login.'});
    }

    req.session.email = email;
    req.session.password = await bcrypt.hash(password, 10);
    req.session.loggedIn = true;

    res.redirect('/who');
});


uroute.get('/userinfo',async(req,res) =>{
    res.render('userinfo')
})


uroute.post('/userinfo', async (req, res) => {
    req.body.email = req.session.email;
    req.body.password = req.session.password;
    const result = await storeUserData(req, res);
    if (result.success) {

        res.redirect('/');

           
    } else {
        res.send('Sorry, try again later.');
    }
});

uroute.get('/usersignin', async(req,res)=>{
    res.render('login', { errorMessage: null })
})

uroute.post('/usersignin',async(req,res)=>{
    const data = {
        email: req.body.email,
        password: req.body.password,
        
    };
    
    const result = await validateUser(data);
    req.session.user=result.user;
    req.session.email=req.body.email;
    if (result.success) {
        req.session.loggedIn = true;
        console.log(result.user)
        res.redirect(result.redirectTo);
    } else {
        res.render('login', { errorMessage: result.message });

    }
})
uroute.get('/forgotpass',async(req,res)=>{
    res.render('forgotpass')
})
uroute.post('/forgotpass', async (req, res) => {
    const { email } = req.body;
    const user = await usermodel.findOne({ email });

    if (!user) {
        return res.json({ success: false, message: 'Email not registered' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOTP = require('crypto')
        .createHash('sha256')
        .update(otp)
        .digest('hex');

    user.resetOTP = hashedOTP;
    user.resetOTPExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
        to: email,
        subject: 'OTP Verification',
        html: `<h3>Your OTP: ${otp}</h3>`
    });

    res.json({ success: true });
});


uroute.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    const hashedOTP = require('crypto')
        .createHash('sha256')
        .update(otp)
        .digest('hex');

    const user = await usermodel.findOne({
        email,
        resetOTP: hashedOTP,
        resetOTPExpiry: { $gt: Date.now() }
    });

    if (!user) {
        return res.json({ success: false });
    }

    res.json({ success: true });
});

uroute.get('/resetpass', (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.redirect('/usersignin');
    }

    res.render('resetpass', { email, errorMessage: null });
});





uroute.post('/reset-password', async (req, res) => {
    const { email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.render('resetpass', {
            email,
            errorMessage: 'Passwords do not match'
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await usermodel.updateOne(
        { email },
        {
            password: hashedPassword,
            resetOTP: null,
            resetOTPExpiry: null
        }
    );

    res.redirect('/usersignin');
});


uroute.get('/checkout',async(req,res)=>{
    const msg = req.session.msg;
    req.session.msg = null;
    if (!req.session.user) {
        return res.redirect('/usersignin');
    }

    const user = await usermodel.findById(req.session.user._id);

    res.render('checkout', {
        addresses: user.addresses || [],
        msg
    });
    
})

uroute.post('/addaddress',async(req,res)=>{
    const result = await addAddress(req,res);
    if(result.success){
        req.session.msg = 'Added address successfully'
        req.session.address = result.address;
        console.log(req.session.address)
    }
    else{
        req.session.msg = 'Sorry try again later!'
        console.log(result.error)
    }
    res.redirect('/checkout')
})

uroute.post("/deliverhere", async (req, res) => {
    try {

        const addressId = req.body.addressId;
        const userId = req.session.user._id;
        const user = await User.findById(userId);

        if (!user || !user.addresses[addressId]) {
            req.session.msg = "Invalid address selected";
            return res.redirect("/checkout");
        }

        const selectedAddress = user.addresses[addressId];

        
        req.session.deliveryAddress = {
            name: selectedAddress.name,
            phone: selectedAddress.phone,
            addressLine: selectedAddress.addressLine,
            locality: selectedAddress.locality,
            city: selectedAddress.city,
            state: selectedAddress.state,
            pincode: selectedAddress.pincode,
            landmark: selectedAddress.landmark,
            alternatePhone: selectedAddress.alternatePhone,
            addressType: selectedAddress.addresstype
        };

        
        res.redirect("/checkout");

    } catch (err) {
        console.log(err);
        req.session.msg = "Something went wrong";
        res.redirect("/checkout");
    }
});





module.exports = uroute;
