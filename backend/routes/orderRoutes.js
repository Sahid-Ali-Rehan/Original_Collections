const express = require("express");
const router = express.Router();
const Order = require("../models/orderModal");
const Product = require("../models/Product");

router.post("/checkout", async (req, res) => {
  try {
    const {
      items,
      deliveryCharge,
      totalAmount,
      status,
      estimatedDeliveryDate,
      name,
      phone,
      jela,
      upazela,
      address,
      paymentMethod,
    } = req.body;

    // Validate required fields
    if (
      !items ||
      !deliveryCharge ||
      !totalAmount ||
      !name ||
      !phone ||
      !jela ||
      !upazela ||
      !address ||
      !paymentMethod
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Reduce stock for each product in the order
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ error: `Product with ID ${item.productId} not found.` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Not enough stock for ${product.name}. Available: ${product.stock}`,
        });
      }
      product.stock -= item.quantity;
      await product.save();
    }

    // Create order
    const order = new Order({
      items,
      deliveryCharge,
      totalAmount,
      status,
      estimatedDeliveryDate,
      name,
      phone,
      jela,
      upazela,
      address,
      paymentMethod,
    });

    await order.save();
    // res.status(201).json({ message: "Order placed successfully", order });
    res.status(201).json({ 
      message: "Order placed successfully", 
      order: order.toObject() // Convert Mongoose document to plain object
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});


  // Get all orders for admin
  router.get("/all-orders", async (req, res) => {
    try {
      console.log("Request received for all orders");
  
      // Populate productId field in the items array and get the 'name' of the product
      const orders = await Order.find()
        .populate('items.productId', 'productName'); // Populating just the 'name' field
  
      console.log("Fetched orders:", orders);  // Log the fetched orders to check populated data
  
      res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
    
  
  // Update order status (Pending, Confirm, Shipped, Delivered)
  router.put("/update-status/:id", async (req, res) => {
    try {
      const { status } = req.body;
      const validStatuses = ['Pending', 'Confirm', 'Shipped', 'Delivered'];
  
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
  
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
  
      order.status = status;
      await order.save();
      res.status(200).json({ message: "Order status updated", order });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  });

  router.get('/user-orders', async (req, res) => {
    try {
      // Assuming you want orders for a specific user or type
      const userId = req.user.id; // Extract from a decoded token or session
      const orders = await Order.find({ userId }); // Adjust this condition as needed
      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch orders.' });
    }
  });
  

  router.get("/:orderId", async (req, res) => {
    const { orderId } = req.params;
    try {
      const order = await Order.findById(orderId).populate("items.productId", "productName");
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.status(200).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  });

  // Add new routes
  router.put('/request-cancel/:orderId', async (req, res) => {
    try {
      const order = await Order.findById(req.params.orderId);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      
      order.status = 'CancellationRequested';
      await order.save();
      
      // Add notification logic here (e.g., send email to admin)
      console.log("Cancellation requested for order:", order._id);
      
      res.json({ message: 'Cancellation requested', order });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.delete('/cancel/:orderId', async (req, res) => {
    try {
      const order = await Order.findById(req.params.orderId);
      if (!order) return res.status(404).json({ error: 'Order not found' });
  
      // Restore stock
      await Promise.all(order.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }));
  
      await Order.findByIdAndDelete(req.params.orderId);
      
      // Add notification logic here (e.g., send confirmation to user)
      console.log("Order cancelled:", order._id);
      
      res.json({ message: 'Order cancelled and deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });  
  
  


module.exports = router;
