const Product = require('../model/productmodel');
const { v4: uuidv4 } = require('uuid');

const storeProductData = async (req, res) => {
    try {
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

        const stock = Number(req.body.stock) || 0;
        const price = Number(req.body.price) || 0;
        const newProduct = new Product({
            productId: uuidv4(),
            productName: req.body.productName,
            productDetails: req.body.productDetails,
            stock: stock,
            price: price,
            remaining: stock,
            productImages: productImages,
            category: req.body.category,
            productStatus: stock > 0 ? 'available' : 'unavailable'
        });

        const savedProduct = await newProduct.save();
        console.log('Product saved:', savedProduct);

        return { success: true,message: 'Product added successfully',redirectTo: '/addprod' };

    } catch (error) {
        console.error('Error saving product:', error);
         return { success: false,message: 'please try again',redirectTo: '/add' };

    }
};

module.exports = { storeProductData };
