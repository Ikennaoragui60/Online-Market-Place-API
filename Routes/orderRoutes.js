const express = require("express")
const router = express.Router()
const { placeOrder, getAllOrders, getOrder, updateOrderStatus } = require("../controllers/orderController")

router.post("/", placeOrder)
router.get("/", getAllOrders)
router.get("/:id", getOrder)
router.patch("/:id/status", updateOrderStatus)

module.exports = router