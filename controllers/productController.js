const Product = require("../Models/Product")

const createProduct = async (req, res) => {
    try {
        const { productName, description, price, category, stockQuantity } = req.body
        const product = await Product.create({ productName, description, price, category, stockQuantity })
        res.status(201).json({ message: "Product created successfully", data: product })
    } catch (err) {
        if (err.name === "CastError") return res.status(400).json({ message: "Invalid ID" })
        res.status(500).json({ message: err.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 })
        res.status(200).json({ count: products.length, data: products })
    } catch (err) {
        if (err.name === "CastError") return res.status(400).json({ message: "Invalid ID" })
        res.status(500).json({ message: err.message })
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ data: product });
    } catch (error) {
        if (err.name === "CastError") return res.status(400).json({ message: "Invalid ID" })
        res.status(500).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id,
            req.body, { new: true, runValidators: true });
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ message: "Product updated successfully", data: product });
    } catch (error) {
        if (err.name === "CastError") return res.status(400).json({ message: "Invalid ID" })
        res.status(500).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct }
