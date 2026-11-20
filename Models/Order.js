const mongoose = require("mongoose")
// const Product = require("./Product")

const orderSchema = new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 }
    }],
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered"],
        default: "Pending"
    },
    orderDate: { type: Date, default: Date.now }
}, { timestamps: true })

module.exports = mongoose.model("Order", orderSchema)