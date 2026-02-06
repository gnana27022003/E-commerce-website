const Product = require('../model/productmodel');

const updateProductData = async (req, res) => {
  try {
    let productImages;

    
    if (req.files && req.files.productImages) {
      productImages = req.files.productImages.map(file => ({
        filename: file.filename,
        contentType: file.mimetype,
        uploadDate: new Date(),
        metadata: {
          size: file.size
        }
      }));
    }

    const data = {
      productName: req.body.productName,
      productDetails: req.body.productDetails,
      stock: req.body.stock,
      price: req.body.price,
      category: req.body.category,
      productStatus: req.body.productStatus
    };

    if (productImages) {
      data.productImages = productImages;
    }

    
    Object.keys(data).forEach(key => {
      if (data[key] === undefined) {
        delete data[key];
      }
    });

    await Product.updateOne(
      { productId: req.params.id },
      { $set: data }
    );

    return {
      success: true,
      message: 'Product updated successfully'
    };

  } catch (error) {
    console.error('error updation', error);

    return {
      success: false,
      message: 'Product update failed'
    };
  }
};

module.exports = { updateProductData };
