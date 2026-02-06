const reviewmodel = require('../model/reviewmodel')
const usermodel = require('../model/usermodel')

const storeReviewData = async(req,res)=>{
    const user = await usermodel.findOne({email:req.session.email})
    const productId = req.params.id;
    try{
        const data = {
            productId: productId,
            userId: user._id,
            rating: req.body.rating,
            review: req.body.description
        }
        console.log(data)
        await reviewmodel.create(data)
        return {success:true}
    }catch(error){
        console.log(error);
        return {success:false}
    }
}


module.exports = {storeReviewData}