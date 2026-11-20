const Customer = require("../Models/Customer");

const createCustomer = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneNumber, address } = req.body
        const customer = await Customer.create({ firstName, lastName, email, phoneNumber, address })
        res.status(201).json({ message: "Customer successfully registered", data: customer })
    } catch (err) {
        if (err.code === 11000) return res.status(409).json({ message: "Email already exists" })
        if (err.name === "ValidationError") return res.status(400).json({ message: err.message })
        res.status(500).json({ message: err.message })
    }
}

const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1 })
        res.status(200).json({ count: customers.length, data: customers })
    } catch (err) {
        res.status(500).json({ message: err.message }) 
    }
};

const getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ message: "Customer not found" });
        res.status(200).json({ data: customer });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(req.params.id,
            req.body, { new: true, runValidators: true });
        if (!customer) return res.status(404).json({ message: "Customer not found" });
        res.status(200).json({ message: "Customer updated successfully", data: customer });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) return res.status(404).json({ message: "Customer not found" });
        res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createCustomer, getAllCustomers, getCustomerById, updateCustomer, deleteCustomer }