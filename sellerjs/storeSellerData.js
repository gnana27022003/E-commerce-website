const sellermodel = require('../model/sellermodel');
const { v4: uuidv4 } = require('uuid');
async function storeSellerData(req,res) {
        const data = {
            email: req.session.email,
            password: req.session.password,
            name: req.body.name,
            phone:req.body.phone,
            company_name: req.body.company,
            role: 'seller',
           userId: uuidv4()
            
        };
    console.log(req.body.name)
        try {
            req.session.user=data
            
            await sellermodel.create(data);
            console.log(data)
            return { success: true };
        } catch (error) {
            console.error('Error saving data:', error);
            return { success: false };
        
        }
    }

module.exports = { storeSellerData };
