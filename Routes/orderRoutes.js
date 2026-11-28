const express = require("express")
const router = express.Router()
<<<<<<< HEAD
const { placeOrder, getAllOrders, getOrder, updateOrderStatus } = require("../controllers/orderController")
=======
const { placeOrder, getAllOrders, getOrderById, updateOrderStatus, deleteOrder} = require("../controllers/orderController")
>>>>>>> d3d57edcc569f49ce9046865f60649084d30a7ea

router.post("/", placeOrder)
router.get("/", getAllOrders)
router.get("/:id", getOrder)
router.patch("/:id/status", updateOrderStatus)
router.delete("/", deleteOrder)

module.exports = router