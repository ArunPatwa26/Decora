const mongoose = require("mongoose");
const Order = require("../module/Order");

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        console.log("Incoming Order Data:", JSON.stringify(req.body, null, 2));

        const { user_id, cart, address, total_price, payment_method, transaction_id } = req.body;

        // Validate required fields
        if (!user_id || !cart || !address || !total_price || !payment_method) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Ensure cart structure is valid
        if (!Array.isArray(cart) || cart.length === 0 || !cart.every(item => item.cartItem && item.quantity)) {
            return res.status(400).json({ message: "Invalid cart data. Each item must have cartItem (product ID) and quantity." });
        }

        let payment_status = payment_method === "Online Payment" ? "Paid" : "Pending";

        const newOrder = new Order({
            user_id: String(user_id),
            products: cart.map(item => ({
                cartItem: String(item.cartItem),
                quantity: Number(item.quantity)
            })),
            address: {
                street: address.street || "",
                city: address.city || "",
                state: address.state || "",
                pincode: String(address.pincode) || ""
            },
            total_price: Number(total_price),
            payment_method,
            payment_status,
            transaction_id: payment_method === "Online Payment" ? transaction_id || "TXN_MISSING" : null
        });

        await newOrder.save();
        res.status(201).json({ message: "Order placed successfully!", order: newOrder });

    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ message: "Error creating order", error: error.message });
    }
};

// Get all orders for a user
exports.getUserOrders = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).json({ message: "Invalid User ID." });
        }

        const orders = await Order.find({ user_id })
            .sort({ createdAt: -1 })
            .populate("products._id", "name price"); // Populating the product details

        res.status(200).json({ orders });

    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
};

// Get a single order by ID
exports.getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "Invalid Order ID." });
        }

        const order = await Order.findById(orderId).populate("products.cartItem", "name price");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(order);

    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({ message: "Error fetching order", error: error.message });
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "Invalid Order ID." });
        }

        const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status value." });
        }

        const updatedOrder = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order status updated", order: updatedOrder });

    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "Error updating order status", error: error.message });
    }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { transaction_id } = req.body;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "Invalid Order ID." });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { payment_status: "Paid", transaction_id },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Payment status updated", order: updatedOrder });

    } catch (error) {
        console.error("Error updating payment status:", error);
        res.status(500).json({ message: "Error updating payment status", error: error.message });
    }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: "Invalid Order ID." });
        }

        const deletedOrder = await Order.findByIdAndDelete(orderId);
        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order deleted successfully" });

    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ message: "Error deleting order", error: error.message });
    }
};