import React, { useState } from "react";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Navigations/Navbar";
import Footer from "../Footer/Footer";

const stripePromise = loadStripe("pk_test_51RSv6HQu2XY94ocpyNXlGLygbvTCIBSFrODrGTvAtAxnQQM0bFDNpC36pJ4EH9cb1GJEKSHigVz6xVWZFeHMZJSV001CPevlli");

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: "",
    phone: "",
    jela: "",
    upazela: "",
    address: "",
    paymentMethod: "COD",
  });

  const cartItems = JSON.parse(localStorage.getItem(`cart_${localStorage.getItem("userId")}`)) || [];
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
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    for (let key in userDetails) {
      if (!userDetails[key]) {
        toast.error(`Please fill in the ${key.replace(/([A-Z])/g, " $1").toLowerCase()} field.`);
        return;
      }
    }

    try {
      let paymentIntentId = null;
      
      if (userDetails.paymentMethod === "Stripe") {
        if (!stripe || !elements) {
          toast.error("Stripe is not initialized");
          return;
        }

        setProcessing(true);
        
        const paymentIntentResponse = await fetch("https://original-collections.onrender.com/api/orders/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: totalPrice })
        });

        if (!paymentIntentResponse.ok) {
          const errorData = await paymentIntentResponse.json();
          throw new Error(errorData.error || "Failed to create payment intent");
        }

        const { clientSecret } = await paymentIntentResponse.json();
        
        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: userDetails.name,
              phone: userDetails.phone,
              address: {
                city: userDetails.jela,
                line1: userDetails.address
              }
            }
          }
        });

        if (stripeError) {
          toast.error(stripeError.message);
          setProcessing(false);
          return;
        }

        paymentIntentId = paymentIntent.id;
      }

      const orderItems = cartItems.map(item => ({
        productId: item._id,
        productName: item.productName,
        productImage: item.productImage,
        productDescription: item.productDescription,
        quantity: item.quantity,
        price: item.price,
        discount: item.discount,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        productCode: item.productCode
      }));

      const order = {
        userId,
        items: orderItems,
        deliveryCharge,
        totalAmount: totalPrice,
        status: "Pending",
        estimatedDeliveryDate,
        ...userDetails,
        paymentIntentId
      };

      const response = await fetch("https://original-collections.onrender.com/api/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      const responseData = await response.json();

      if (response.ok) {
        localStorage.removeItem(`cart_${userId}`);
        toast.success("Order placed successfully!");
        localStorage.setItem("orderSuccess", JSON.stringify(responseData.order));
        navigate("/success");
      } else {
        toast.error(responseData.error || "Failed to place the order. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Order Summary */}
        <div className="lg:w-1/2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-center border-b pb-4">
                  <img 
                    src={item.productImage} 
                    alt={item.productName}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium">{item.productName}</h3>
                    <p className="text-sm text-gray-600">
                      {item.selectedColor} / {item.selectedSize}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm">
                        Qty: {item.quantity}
                      </span>
                      <span className="font-medium">
                        ৳{(item.price * (1 - item.discount/100) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>৳{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span>৳{deliveryCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-3">
                <span>Total:</span>
                <span>৳{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              Estimated delivery by {estimatedDeliveryDate.toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="lg:w-1/2">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={userDetails.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={userDetails.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="jela"
                  placeholder="District"
                  value={userDetails.jela}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="upazela"
                  placeholder="Upazila"
                  value={userDetails.upazela}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <textarea
                  name="address"
                  placeholder="Full Address"
                  value={userDetails.address}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary h-24"
                />
              </div>

              <div className="border-t pt-4">
                <label className="block mb-2 font-medium">Payment Method</label>
                <select
                  name="paymentMethod"
                  value={userDetails.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="COD">Cash on Delivery</option>
                  <option value="Stripe">Credit/Debit Card</option>
                </select>
              </div>

              {userDetails.paymentMethod === "Stripe" && (
                <div className="p-4 border rounded bg-gray-50">
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
                    }}
                    className="p-2"
                  />
                </div>
              )}

              <button 
                type="submit" 
                disabled={processing || (userDetails.paymentMethod === "Stripe" && !stripe)}
                className="w-full bg-primary text-white py-3 rounded hover:bg-secondary disabled:bg-gray-400 transition-colors"
              >
                {processing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Place Order"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

const Checkout = () => {
  const cartItems = JSON.parse(localStorage.getItem(`cart_${localStorage.getItem("userId")}`)) || [];

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
    <div>
      <Navbar />
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
      <Footer />
    </div>
  );
};

export default Checkout;