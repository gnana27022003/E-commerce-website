const productmodel = require('../model/productmodel')

function updateProductData(req,res){

     try{
        const productImagesFiles = req.files['productImages'];

        const productImages = [];
        const seenFiles = new Set();

        if (productImagesFiles) {
            for (let file of productImagesFiles) {
                if (!seenFiles.has(file.filename)) {
                    seenFiles.add(file.filename);
                    productImages.push({
                        filename: file.filename,
                        contentType: file.mimetype,
                        uploadDate: new Date(),
                        metadata: {}
                    });
                }
            }
        }


        const data = {
            productName: req.body.productName,
            productDetails: req.body.productDetails,
            stock:req.body.stock,
            price:req.body.price,
            category:req.body.category,
            productStatus:req.body.productStatus,
            productImages:productImages
        }

     }



}