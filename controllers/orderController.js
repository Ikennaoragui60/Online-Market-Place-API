const Order = require("../Models/Order")
const Customer = require("../Models/Customer")
const Product = require("../Models/Product")

const placeOrder = async (req, res) => {
    try {
        const { customer, products } = req.body

        if (!customer || !Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: "customer and at least one product are required" })
        }

        const customerDoc = await Customer.findById(customer)
        if (!customerDoc) return res.status(404).json({ message: "Customer not found" })

        let totalAmount = 0
        const checked = []

        for (const item of products) {
            const productDoc = await Product.findById(item.product)
            if (!productDoc) return res.status(404).json({ message: `Product not found: ${item.product}` })
            if (!item.quantity || item.quantity < 1) {
                return res.status(400).json({ message: "Each product needs a quantity of at least 1" })
            }
            if (productDoc.stockQuantity < item.quantity) {
                return res.status(400).json({
                    message: `Not enough stock for ${productDoc.productName}. Available: ${productDoc.stockQuantity}`
                })
            }
            totalAmount += productDoc.price * item.quantity
            checked.push({ productDoc, quantity: item.quantity })
        }

        for (const { productDoc, quantity } of checked) {
            productDoc.stockQuantity -= quantity
            await productDoc.save()
        }

        const order = await Order.create({ customer, products, totalAmount })
        res.status(201).json({ message: "Order placed successfully", data: order })
    } catch (err) {
        if (err.name === "ValidationError") return res.status(400).json({ message: err.message })
        if (err.name === "CastError") return res.status(400).json({ message: "Invalid ID" })
        res.status(500).json({ message: err.message })
    }
}

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate("customer", "firstName lastName email")
            .populate("products.product", "productName price category")
        res.status(200).json({ count: orders.length, data: orders })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// Order + customer details + products purchased
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("customer", "firstName lastName email phoneNumber address")
            .populate("products.product", "productName description price category")
        if (!order) return res.status(404).json({ message: "Order not found" })
        res.status(200).json({ data: order })
    } catch (err) {
        if (err.name === "CastError") return res.status(400).json({ message: "Invalid ID" })
        res.status(500).json({ message: err.message })
    }
}

// Customer profile + order history
const getCustomerWithOrders = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id)
        if (!customer) return res.status(404).json({ message: "Customer not found" })

        const orders = await Order.find({ customer: req.params.id })
            .sort({ createdAt: -1 })
            .populate("products.product", "productName price category")

        res.status(200).json({ data: { customer, orderCount: orders.length, orders } })
    } catch (err) {
        if (err.name === "CastError") return res.status(400).json({ message: "Invalid ID" })
        res.status(500).json({ message: err.message })
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body
        if (!status) return res.status(400).json({ message: "status is required" })

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        )
        if (!order) return res.status(404).json({ message: "Order not found" })
        res.status(200).json({ message: "Order status updated", data: order })
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ message: "Status must be Pending, Processing, Shipped or Delivered" })
        }
        if (err.name === "CastError") return res.status(400).json({ message: "Invalid ID" })
        res.status(500).json({ message: err.message })
    }
}

exports.deleteOrder = async (req, res) => {
    try {
        const data = req.params.id;

        if (!data) {
            return res.status(400).json({
                message: "Order ID is required"
            });
        }

        const order = await Order.findByIdAndDelete(data);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json({
            message: "Order deleted successfully",
            order
        });

    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({
                message: "Invalid Order ID"
            });
        }

        res.status(500).json({
            message: err.message
        });
    }
};

module.exports = { placeOrder, getAllOrders, getOrderById, getCustomerWithOrders, updateOrderStatus, deleteOrder }