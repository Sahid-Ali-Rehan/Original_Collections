import React, { useState } from "react";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Navigations/Navbar";
import Footer from "../Footer/Footer";
import './Checkout.css';
import { LockClosedIcon, CreditCardIcon, ShoppingBagIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

const stripePromise = loadStripe("pk_test_51RSv6HQu2XY94ocpyNXlGLygbvTCIBSFrODrGTvAtAxnQQM0bFDNpC36pJ4EH9cb1GJEKSHigVz6xVWZFeHMZJSV001CPevlli");

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [activeStep] = useState(2);
  const [userDetails, setUserDetails] = useState({
    name: "",
    phone: "",
    jela: "",
    upazela: "",
    address: "",
    postalCode: "",
    paymentMethod: "COD",
  });

  // Get cart items and calculate prices
  const userId = localStorage.getItem("userId") || "guest";
  const cartItems = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
  const deliveryCharge = 120;
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price * (1 - item.discount / 100),
    0
  );
  const totalPrice = subtotal + deliveryCharge;
  const estimatedDeliveryDate = new Date();
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 7);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const requiredFields = ['name', 'phone', 'jela', 'upazela', 'address'];
    if (userDetails.paymentMethod === "Stripe" && !userDetails.postalCode) {
      toast.error("Postal code is required for card payments");
      return;
    }

    for (const field of requiredFields) {
      if (!userDetails[field]) {
        toast.error(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field`);
        return;
      }
    }

    try {
      setProcessing(true);
      let paymentIntentId = null;

      // Handle Stripe payment
      if (userDetails.paymentMethod === "Stripe") {
        if (!stripe || !elements) {
          toast.error("Payment system is not ready");
          return;
        }

        // Create payment intent
        const paymentIntentResponse = await fetch("https://original-collections.onrender.com/api/orders/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: totalPrice })
        });

        if (!paymentIntentResponse.ok) {
          throw new Error("Failed to initialize payment");
        }

        const { clientSecret } = await paymentIntentResponse.json();

        // Confirm card payment
        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: userDetails.name,
              phone: userDetails.phone,
              address: {
                city: userDetails.jela,
                line1: userDetails.address,
                postal_code: userDetails.postalCode
              }
            }
          }
        });

        if (stripeError) throw stripeError;
        paymentIntentId = paymentIntent.id;
      }

      // Prepare order data
      const orderItems = cartItems.map(item => ({
        productId: item._id,
        productName: item.productName,
        productImage: item.productImage,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor
      }));

      const order = {
        userId: userId !== "guest" ? userId : undefined,
        items: orderItems,
        deliveryCharge,
        totalAmount: totalPrice,
        status: "Pending",
        estimatedDeliveryDate,
        ...userDetails,
        paymentIntentId
      };

      // Submit order
      const response = await fetch("https://original-collections.onrender.com/api/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Order submission failed");
      }

      // Clear cart and redirect
      localStorage.removeItem(`cart_${userId}`);
      toast.success("Order placed successfully!");
      navigate("/success");

    } catch (error) {
      console.error("Checkout Error:", error);
      toast.error(error.message || "An error occurred during checkout");
    } finally {
      setProcessing(false);
    }
  };

  // Floating Input Component
  const FloatingInput = ({ label, name, type = 'text', required = false, textarea = false }) => (
    <div className="floating-input-group">
      {textarea ? (
        <textarea
          className="floating-input"
          placeholder=" "
          name={name}
          value={userDetails[name]}
          onChange={handleInputChange}
          required={required}
          rows="4"
        />
      ) : (
        <input
          className="floating-input"
          type={type}
          placeholder=" "
          name={name}
          value={userDetails[name]}
          onChange={handleInputChange}
          required={required}
        />
      )}
      <label className="floating-label">{label}</label>
    </div>
  );

  return (
    <div className="checkout-container">
      <Navbar />

      <div className="progress-steps">
        {[1, 2, 3].map((step) => (
          <div key={step} className="step-item">
            <div className={`step-circle ${activeStep >= step ? 'active' : ''}`}>
              {step}
            </div>
            {step < 3 && <div className="step-connector" />}
          </div>
        ))}
      </div>

      <div className="checkout-grid">
        {/* Checkout Form */}
        <div className="checkout-form">
          <form onSubmit={handleSubmit}>
            <div className="form-section">
              <h2 className="text-xl font-bold mb-4">
                <LockClosedIcon className="icon-spacing" />
                Shipping Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <FloatingInput label="Full Name" name="name" required />
                <FloatingInput label="Phone Number" name="phone" type="tel" required />
                <FloatingInput label="District" name="jela" required />
                <FloatingInput label="Upazila" name="upazela" required />
                <div className="col-span-2">
                  <FloatingInput label="Full Address" name="address" textarea required />
                </div>
                <FloatingInput label="Postal Code" name="postalCode" />
              </div>
            </div>

            <div className="payment-section">
              <h2 className="text-xl font-bold mb-4">
                <CreditCardIcon className="icon-spacing" />
                Payment Method
              </h2>
              <select
                className="payment-select"
                value={userDetails.paymentMethod}
                onChange={handleInputChange}
                name="paymentMethod"
              >
                <option value="COD">Cash on Delivery</option>
                <option value="Stripe">Credit/Debit Card</option>
              </select>

              {userDetails.paymentMethod === "Stripe" && (
                <div className="card-element-container">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#424770',
                          '::placeholder': { color: '#aab7c4' },
                          iconColor: '#666ee8'
                        },
                        invalid: { color: '#9e2146' }
                      }
                    }}
                  />
                  <div className="demo-notice">
                    <strong>Test Card:</strong> 4242 4242 4242 4242<br />
                    Any future date | Any 3-digit CVC
                  </div>
                  <div className="card-icons">
                    <img src="/visa.svg" alt="Visa" />
                    <img src="/mastercard.svg" alt="Mastercard" />
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="payment-button"
              disabled={processing || (userDetails.paymentMethod === "Stripe" && !stripe)}
            >
              {processing ? (
                <div className="spinner"></div>
              ) : (
                <>
                  {userDetails.paymentMethod === "Stripe" ? (
                    <><CreditCardIcon className="button-icon" /> Pay ৳{totalPrice.toFixed(2)}</>
                  ) : (
                    "Place Order (COD)"
                  )}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h2 className="text-xl font-bold mb-4">
            <ShoppingBagIcon className="icon-spacing" />
            Order Summary
          </h2>
          <div className="product-list">
            {cartItems.map((item, index) => (
              <div key={index} className="product-item">
                <img src={item.productImage} alt={item.productName} className="product-image" />
                <div className="product-details">
                  <h3>{item.productName}</h3>
                  <p>{item.selectedColor} / {item.selectedSize}</p>
                  <div className="product-meta">
                    <span>Qty: {item.quantity}</span>
                    <span>৳{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="price-breakdown">
            <div className="price-row">
              <span>Subtotal:</span>
              <span>৳{subtotal.toFixed(2)}</span>
            </div>
            <div className="price-row">
              <span>Delivery:</span>
              <span>৳{deliveryCharge.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Total:</span>
              <span>৳{totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="security-badge">
            <ShieldCheckIcon className="security-icon" />
            <span>Secure SSL Encryption</span>
          </div>
        </div>
      </div>

      <Footer />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

const Checkout = () => {
  const userId = localStorage.getItem("userId") || "guest";
  const cartItems = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];

  if (cartItems.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;