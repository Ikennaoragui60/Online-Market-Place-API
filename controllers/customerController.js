const Customer = require("../models/Customer");

exports.createCustomer = async (req, res) => {
    try {
        const customer = await Customer.create(req.body);
        res.status(201).json({ message: "Customer created successfully", data: customer });
    } catch (err) {
        res.status(400).json({ message: "Customer with the email already exists" });
    }
};

exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json({ message: "All Customers fetched successfully", data: customers });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getCustomer = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ message: "Customer not found" });
        res.json({ message: "Customer fetched successfully", data: customer });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!customer) return res.status(404).json({ message: "Customer not found" });
        res.json({ message: "Customer updated successfully", data: customer });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) return res.status(404).json({ message: "Customer not found" });
        res.json({ message: "Customer deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};