const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        
        productName: { type: String }, // Add product name here
        
        productImage: { type: String }, // Add product image URL here
        productDescription: { type: String }, // Add product description here
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        selectedSize: { type: String },
        productCode: { type: String },
        
        selectedColor: { type: String },
      },
    ],
    deliveryCharge: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, default: "Pending" },
    estimatedDeliveryDate: { type: Date, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    state: { type: String, required: true },
    jela: { type: String, required: true },
    upazela: { type: String, required: true },
    address: { type: String, required: true },
    postalCode: { type: String, required: true },
    zip: { type: String, required: true },
    paymentMethod: { type: String, enum: ["COD", "Card"], default: "COD" },
  });
  
  

module.exports = mongoose.model("Order", orderSchema);
