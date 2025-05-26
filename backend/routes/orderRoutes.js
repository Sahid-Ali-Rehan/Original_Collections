const express = require("express");
const router = express.Router();
const Order = require("../models/orderModal");
const Product = require("../models/Product");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// New route for creating payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;
    
   // In create-payment-intent route
const paymentIntent = await stripe.paymentIntents.create({
  amount: Math.round(amount * 100),
  currency: 'usd', // Must use 'usd' for testing environment
  payment_method_types: ['card'],
  metadata: { integration_check: 'accept_a_payment' } // Add this line
});

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Stripe Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Modified checkout route
router.post("/checkout", async (req, res) => {
  try {
    const { 
      items,
      deliveryCharge,
      totalAmount,
      status = "Pending",
      estimatedDeliveryDate,
      name,
      phone,
      jela,
      upazela,
      address,
      paymentMethod,
      paymentIntentId,
      userId
    } = req.body;

    // Validate required fields
    const requiredFields = ['items', 'deliveryCharge', 'totalAmount', 'name', 
      'phone', 'jela', 'upazela', 'address', 'paymentMethod', 'userId'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    // Handle Stripe payment validation
    if (paymentMethod === "Stripe") {
      if (!paymentIntentId) {
        return res.status(400).json({ error: "Payment intent ID required for Stripe payments" });
      }
      
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({ error: "Payment not completed" });
      }
    }

    // Stock validation and reduction
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ error: `Product ${item.productId} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for ${product.productName}. Available: ${product.stock}`
        });
      }
      product.stock -= item.quantity;
      await product.save();
    }

    // Create order
    const order = new Order({
      userId,
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
      paymentIntentId: paymentMethod === "Stripe" ? paymentIntentId : undefined
    });

    await order.save();
    res.status(201).json({ 
      message: "Order placed successfully", 
      order: order.toObject() 
    });
  } catch (error) {
    console.error('Checkout Error:', error);
    res.status(500).json({ error: "Server error" });
  }
});

// Keep all your existing routes below...

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
