const express = require('express')
const userController = require('../controller/userController')
const orderController = require('../controller/orderController')
const authMiddleware = require('../middleware/authMiddleware')

const router =  new express.Router()


// register
router.post('/register',userController.registerController)

// login
router.post('/login',userController.loginController)

// Create Order
router.post("/orders",authMiddleware,orderController.createOrder);

// Get User Orders
router.get("/orders/:userId",authMiddleware,orderController.getOrders);

// Update Order
router.put("/orders/:orderId",authMiddleware,orderController.updateOrder);

// Delete Order
router.delete("/orders/:orderId",authMiddleware,orderController.deleteOrder);

module.exports = router