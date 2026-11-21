const express = require("express")
const router = express.Router()
const { placeOrder, getAllOrders, getOrderById, updateOrderStatus, deleteOrder} = require("../controllers/orderController")

router.post("/", placeOrder)
router.get("/", getAllOrders)
router.get("/:id", getOrderById)
router.patch("/:id/status", updateOrderStatus)
router.delete("/", deleteOrder)

module.exports = router