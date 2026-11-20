const express = require("express");
const router = express.Router();
const { createCustomer, getAllCustomers, getCustomerById, updateCustomer, deleteCustomer } = require("../controllers/customerController")
const { getCustomerWithOrders } = require("../controllers/orderController")

router.post("/", createCustomer)
router.get("/", getAllCustomers)
router.get("/:id", getCustomerById);
router.patch("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);
router.get("/:id/orders", getCustomerWithOrders)

module.exports = router 
