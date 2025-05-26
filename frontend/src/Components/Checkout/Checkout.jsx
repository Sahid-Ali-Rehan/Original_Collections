import React, { useState } from "react";
import { useEffect } from "react";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Navigations/Navbar";
import Footer from "../Footer/Footer";


const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  
  const [userDetails, setUserDetails] = useState({
    name: "",
    phone: "",
    jela: "",
    upazela: "",
    address: "",
    paymentMethod: "COD",
  });
  
  const [processing, setProcessing] = useState(false);
  const cartItems = JSON.parse(localStorage.getItem(`cart_${localStorage.getItem("userId")}`)) || [];

  const deliveryCharge = 120;
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price * (1 - item.discount / 100),
    0
  ) + deliveryCharge;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    const userId = localStorage.getItem("userId");

    if (!userId || userId === "undefined") {
  toast.error("Please login to complete your order");
  navigate("/login");
  return;
}
    // Validate all fields
    const requiredFields = ['name', 'phone', 'jela', 'upazela', 'address'];
    for (const field of requiredFields) {
      if (!userDetails[field]) {
        toast.error(`Please fill in the ${field} field`);
        setProcessing(false);
        return;
      }
    }

    let paymentIntentId = null;
    
    try {
      // Handle Stripe payment
      if (userDetails.paymentMethod === "Stripe") {
        if (!stripe || !elements) {
          toast.error("Stripe is not initialized");
          return;
        }

        // Create payment intent
        const paymentIntentResponse = await fetch(
          "https://original-collections.onrender.com/api/orders/create-payment-intent",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: totalPrice }),
          }
        );

        if (!paymentIntentResponse.ok) {
          throw new Error("Failed to create payment intent");
        }

        const { clientSecret } = await paymentIntentResponse.json();

        // Confirm card payment
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: userDetails.name,
              phone: userDetails.phone,
              address: {
                city: userDetails.upazela,
                country: "BD",
              }
            }
          }
        });

        if (error) throw error;
        if (paymentIntent.status !== "succeeded") {
          throw new Error("Payment failed");
        }
        paymentIntentId = paymentIntent.id;
      }

      // Prepare order items
      const orderItems = cartItems.map(item => ({
        productId: item._id,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
      }));

      // Submit order
      const orderResponse = await fetch(
        "https://original-collections.onrender.com/api/orders/checkout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
  ...userDetails,
  items: orderItems,
  deliveryCharge,
  totalAmount: totalPrice,
  estimatedDeliveryDate: new Date(),
  userId: localStorage.getItem("userId"), // Use stored user ID
  paymentIntentId
}),
        }
      );

      const responseData = await orderResponse.json();
      
      if (!orderResponse.ok) {
        throw new Error(responseData.error || "Order submission failed");
      }

      // Clear cart and handle success
      localStorage.removeItem(`cart_${localStorage.getItem("userId")}`);
      localStorage.setItem("orderSuccess", JSON.stringify(responseData.order));
      navigate("/success");
    } catch (error) {
      console.error("Checkout Error:", error);
      toast.error(error.message || "An error occurred during checkout");
    } finally {
      setProcessing(false);
    }
  };

// Add authentication check
useEffect(() => {
  const userId = localStorage.getItem("userId");
  if (!userId || userId === "undefined") {
    navigate("/login");
  }
}, [navigate]);

  if (cartItems.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="text-center my-10">
          <h2 className="text-xl text-primary font-bold">Your Cart is Empty</h2>
        </div>
        <Footer />
      </div>
    );
  }

  

  return (
    <div className="bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto mt-10 p-6 bg-white shadow-lg">
        <h2 className="text-2xl text-primary font-bold mb-6">Checkout</h2>
        
        {/* Order Summary */}
        <div className="border p-4 rounded mb-6">
          <h3 className="font-bold text-primary text-lg mb-4">Order Summary</h3>
          <ul className="space-y-2">
            {cartItems.map((item) => (
              <li key={item._id + item.selectedSize + item.selectedColor} className="flex justify-between">
                <p>{item.productName} (x{item.quantity})</p>
                <p>
                  Tk. {(item.quantity * item.price * (1 - item.discount / 100)).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-semibold mt-4">
            <p>Delivery Charge:</p>
            <p>Tk. {deliveryCharge.toFixed(2)}</p>
          </div>
          <div className="flex justify-between font-bold text-lg mt-4">
            <p>Total:</p>
            <p>Tk. {totalPrice.toFixed(2)}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 mb-6">
            <input type="text" name="name" placeholder="Full Name" value={userDetails.name} onChange={handleInputChange} required className="border p-3 rounded w-full" />
            <input type="text" name="phone" placeholder="Phone Number" value={userDetails.phone} onChange={handleInputChange} required className="border p-3 rounded w-full" />
            <input type="text" name="jela" placeholder="District (Jela)" value={userDetails.jela} onChange={handleInputChange} required className="border p-3 rounded w-full" />
            <input type="text" name="upazela" placeholder="Sub-district (Upazela)" value={userDetails.upazela} onChange={handleInputChange} required className="border p-3 rounded w-full" />
            <textarea name="address" placeholder="Delivery Address" value={userDetails.address} onChange={handleInputChange} required className="border p-3 rounded w-full" />
            <select 
  name="paymentMethod" 
  value={userDetails.paymentMethod} 
  onChange={handleInputChange}
>
  <option value="COD">Cash on Delivery</option>
  <option value="Stripe">Credit/Debit Card (Stripe)</option>
</select>

            
{userDetails.paymentMethod === "Stripe" && (
  <div className="border p-4 rounded">
    <CardElement
      options={{
        style: {
          base: {
            fontSize: "16px",
            color: "#424770",
            "::placeholder": {
              color: "#aab7c4",
            },
          },
          invalid: {
            color: "#9e2146",
          },
        },
        hidePostalCode: true
      }}
      onChange={(e) => {
        if (e.error) {
          toast.error(e.error.message);
        }
      }}
    />
  </div>
)}
          </div>
          <button 
            type="submit" 
            disabled={processing}
            className={`px-6 py-3 text-white rounded transition w-full ${
              processing ? "bg-gray-400" : "bg-primary hover:bg-secondary"
            }`}
          >
            {processing ? "Processing..." : "Place Order"}
          </button>
        </form>
      </div>
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default Checkout;
