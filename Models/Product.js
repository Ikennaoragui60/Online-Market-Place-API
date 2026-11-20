const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    stockQuantity: { type: Number, required: true, min: 0 },
}, { timestamps: true })

module.exports = mongoose.model("Product", productSchema);