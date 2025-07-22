const Product = require('../models/Product');
const Firm = require('../models/Firm');
const multer = require('multer');

const storage = multer.diskStorage({
       destination: function (req, file, cb) {
        cb(null, 'uploads/');  // Ensure this folder exists or create it
       },   // upload folder

       filename: function (req, file, cb) {
          cb(null,  Date.now() + '-' + path.extname(file.originalname));
     }
});
const upload = multer({ storage: storage });

const addProduct = async (req, res) => {   
    try {
    const { productName, price, category, bestSeller, description } = req.body;
    const image = req.file ? req.file.filename : undefined; // Get the uploaded file path
     
    const firmId = req.params.firmId; // Assuming firmId is passed in the URL
    const firm = await Firm.findById(firmId);
    if (!firm) {
        return res.status(404).json({ message: "Firm not found" });     
    }
    const product = new Product({
        productName, price, category, bestSeller, description, image,
        firm: firm._id 
    })
    const savedProduct = await product.save();
    firm.products.push(savedProduct);
    await firm.save();
    return res.status(201).json({ message: "Product added successfully" , product: savedProduct });

    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getProductsByFirm = async (req, res) => {
    try { 
        const firmId = req.params.firmId;
        const firm = await Firm.findById(firmId).populate('products');
        if (!firm) {    
            return res.status(404).json({ message: "Firm not found" });
        }

        const restaurantName = firm.firmName;
        const products = await Product.find({ firm: firmId });

        return res.status(200).json({ restaurantName, products });

    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const deleteProductById = async (req, res) => {
    try {   
        const productId = req.params.productId;
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);        
        res.status(500).json({ message: "Internal server error" });
    }   
}

module.exports = { addProduct: [upload.single('image'), addProduct],getProductsByFirm, deleteProductById };