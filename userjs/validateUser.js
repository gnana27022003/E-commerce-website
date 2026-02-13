const usermodel = require('../model/usermodel');
const bcrypt = require('bcrypt');
const sellermodel = require('../model/sellermodel')

async function validateUser(data,req,res) {
    if (data.email && data.password) {
        const user = await usermodel.findOne({ email: data.email }) || await sellermodel.findOne({ email: data.email })
        
        if (user) {
            const isMatch = await bcrypt.compare(data.password, user.password);
            if (isMatch) {
                if(user.role=='user'){
                    req.session.userId = user.userId;
                    return { success: true, user,redirectTo: '/' };
                }
                else{
                    req.session.sellerId = user.sellerId;
                    return { success: true, user,redirectTo: '/home' };
                }
            } else {
                return { success: false, message: 'Invalid password' };
            }
        } else {
            return { success: false, message: 'User not found' };
        }
    } else {
        return { success: false, message: 'email and password are required' };
    }
}

module.exports = { validateUser };
