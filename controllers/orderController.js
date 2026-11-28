const Order = require("../Models/Order");
const Product = require("../Models/Product");

exports.placeOrder = async (req, res) => {
    try {
        const { customer, products } = req.body
        if (!customer || !products || products.length === 0) return res.status(400).json({ message: "customer and products are required" })

        let totalAmount = 0

        for (const item of products) {
            const product = await Product.findById(item.product)
            if (!product) return res.status(404).json({ message: "Product not found" })
            if (!item.quantity || item.quantity < 1) return res.status(400).json({ message: "Quantity must be at least 1" })
            if (product.stockQuantity < item.quantity) return res.status(400).json({ message: `Not enough stock for ${product.productName}` })

            totalAmount += product.price * item.quantity
            product.stockQuantity -= item.quantity
            await product.save()
        }

        const order = await Order.create({ customer, products, totalAmount })
        res.status(201).json({ message: "Order placed successfully", data: order })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate("customer", "firstName lastName email")
            .populate("products.product", "productName price category")
        res.json({ message: "All orders fetched successfully", data: orders })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("customer", "firstName lastName email phoneNumber address")
            .populate("products.product", "productName description price category")
        if (!order) return res.status(404).json({ message: "Order not found" })
        res.json({ message: "Order fetched successfully", data: order })
    } catch (err) {
        res.status(400).json({ message: "Invalid ID" })
    }
}

exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body
        if (!status) return res.status(400).json({ message: "status is required" })

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { returnDocument: "after", runValidators: true }
        )
        if (!order) return res.status(404).json({ message: "Order not found" })
        res.json({ message: "Order status updated successfully", data: order })
    } catch (err) {
        res.status(400).json({ message: "Invalid ID or status. Status must be Pending, Processing, Shipped or Delivered" })
    }
}

exports.getCustomerWithOrders = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id)
        if (!customer) return res.status(404).json({ message: "Customer not found" })

        const orders = await Order.find({ customer: req.params.id })
            .sort({ createdAt: -1 })
            .populate("products.product", "productName description price category")

        res.json({
            message: "Customer with order history fetched successfully",
            data: { customer, orderCount: orders.length, orders }
        });
    } catch (err) {
        res.status(400).json({ message: "Invalid ID" })
    }
}