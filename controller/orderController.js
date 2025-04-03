const orders = require("../model/orderModel");
const Order = require("../model/orderModel");
const mongoose = require('mongoose');


// Create Order
exports.createOrder = async (req, res) => {
    console.log("Inside createOrder");

    try {
        const { items, totalPrice } = req.body;

        if (!req.userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        if (!items || items.length === 0 || !totalPrice) {
            return res.status(400).json({ message: "Invalid order details" });
        }

        // Create new order
        const newOrder = new Order({
            userId: req.userId, 
            items,
            totalPrice,
            status: "Pending",
        });

        await newOrder.save();
        res.status(201).json({ message: "Order placed successfully", order: newOrder });
    } catch (err) {
        console.error("Error in createOrder:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};



// Get User Orders
exports.getOrders = async (req, res) => {
    
    console.log("Inside getOrders");

    try {
        const orders = await Order.find({userId:req.userId});
        res.status(200).json(orders);
    } catch (err) {
        console.error("Error in getOrders:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};


// Update Order
exports.updateOrder = async (req, res) => {
    console.log("Inside updateOrder");

    // Extract the orderId from the request parameters or body
    const { orderId } = req.params; // If passed in URL params
    // Or if passed in body: const { orderId } = req.body;

    // Validate if orderId exists
    if (!orderId) {
        return res.status(400).json({ message: "Order ID is required" });
    }

    const { items, totalPrice, status } = req.body;

    try {
        // Ensure orderId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "Invalid Order ID format" });
        }

        const updatedOrder = await Order.findOneAndUpdate(
            { _id: orderId, userId: req.userId }, // Ensure valid ObjectId for _id
            { items, totalPrice, status, updatedAt: new Date() },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found or unauthorized" });
        }

        res.status(200).json({ message: "Order updated successfully", order: updatedOrder });
    } catch (err) {
        console.error("Error in updateOrder:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};



// Delete Order
exports.deleteOrder = async (req, res) => {
    console.log("Inside deleteOrder");
    const { orderId } = req.params;

    try {
        const deletedOrder = await Order.findOneAndDelete({ _id: orderId, userId: req.userId });

        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found or unauthorized" });
        }

        res.status(200).json({ message: "Order deleted successfully" });
    } catch (err) {
        console.error("Error in deleteOrder:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
};
