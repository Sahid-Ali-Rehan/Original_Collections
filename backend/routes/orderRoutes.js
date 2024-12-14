const express = require("express");
const router = express.Router();
const Order = require("../models/orderModal");
const Product = require("../models/Product");

// Checkout Route
router.post("/checkout", async (req, res) => {
    try {
      const {
        items,  // Ensure this includes productId for each item
        deliveryCharge,
        totalAmount,
        status,
        estimatedDeliveryDate,
        name,
        email,
        phone,
        state,
        jela,
        upazela,
        address,
        postalCode,
        zip,
        paymentMethod,
      } = req.body;
  
      // Validate required fields
      if (
        !items ||
        !deliveryCharge ||
        !totalAmount ||
        !name ||
        !email ||
        !phone ||
        !state ||
        !jela ||
        !upazela ||
        !address ||
        !postalCode ||
        !zip ||
        !paymentMethod
      ) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Reduce stock for each product in the order
      for (const item of items) {
        const product = await Product.findById(item.productId); // Ensure productId is being sent correctly
if (!product) {
  return res.status(404).json({ error: `Product with ID ${item.productId} not found.` });
}


        if (product.stock < item.quantity) {
          return res.status(400).json({
            error: `Not enough stock for ${product.name}. Available: ${product.stock}`,
          });
        }

        // Reduce stock
        product.stock -= item.quantity;
        await product.save(); // Save updated product stock
      }
  
      // Create order
      const order = new Order({
        items,
        deliveryCharge,
        totalAmount,
        status,
        estimatedDeliveryDate,
        name,
        email,
        phone,
        state,
        jela,
        upazela,
        address,
        postalCode,
        zip,
        paymentMethod,
      });
  
      await order.save();
      res.status(201).json({ message: "Order placed successfully", order });
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
  
  
  


module.exports = router;
