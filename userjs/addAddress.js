const usermodel = require('../model/usermodel')

const addAddress = async(req,res)=>{
    try{
        const user = await usermodel.findOne({email:req.session.email})
        const address = {
            name: req.body.name,
            phone: req.body.phone,
            addressLine: req.body.addressLine,
            locality: req.body.locality,
            city: req.body.city,
            state: req.body.state,
            pincode: req.body.pincode,
            landmark: req.body.landmark,
            alternatePhone: req.body.alternatePhone,
            type: req.body.addresstype
        }


        user.addresses.push(address);
        await user.save()
        return{success:true,address}
    }
    catch(error){
        console.log(error)
        return({success:false,error})
    }
}

module.exports = {addAddress}