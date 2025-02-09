import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

gsap.registerPlugin(ScrollTrigger);

const MyProfile = () => {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  
  const formRef = useRef(null);
  const detailsRef = useRef(null);
  const statusRef = useRef(null);
  const deleteRef = useRef(null);

  useEffect(() => {
    // Fetch user profile data
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");  // Assuming userId is saved in localStorage
        const response = await axios.get(
          `https://original-collections.onrender.com/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfileData(response.data);
      } catch (error) {
        toast.error("Failed to load profile data");
      }
    };

    fetchProfile();

    // Initial animations
    gsap.fromTo(
      ".profile-section",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.3,
        scrollTrigger: {
          trigger: ".profile-container",
          start: "top center",
        },
      }
    );

    gsap.fromTo(
      formRef.current,
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        scrollTrigger: {
          trigger: formRef.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  const animateOrderSections = () => {
    gsap.fromTo(
      [detailsRef.current, statusRef.current, deleteRef.current],
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
      }
    );
  };

  const handleTrackOrder = async () => {
    if (!orderId.trim()) {
      toast.error("Please enter an order ID");
      return;
    }
  
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://original-collections.onrender.com/api/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Order data received:", response.data);  // Debugging line to inspect response data
      if (response.data) {
        setOrder(response.data);
        setTimeout(animateOrderSections, 100);
      }
    } catch (error) {
      toast.error("Order not found. Please check your Order ID");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusProgress = () => {
    const statusOrder = ["Pending", "Confirm", "Shipped", "Delivered"];
    const currentIndex = statusOrder.indexOf(order?.status || "");
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };

  return (
    <div className="min-h-screen bg-white px-4 py-12 profile-container">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-12 text-center profile-section">
          My Profile
        </h1>

        {/* Order Tracking Section */}
        <div className="profile-section">
          <div ref={formRef} className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-100">
            <h2 className="text-2xl font-bold text-primary mb-6">Track Your Order</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter Your Order ID"
                className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:ring-2 focus:ring-blue-200 transition-all"
              />
              <button
                onClick={handleTrackOrder}
                disabled={loading}
                className="px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-blue-600 disabled:bg-gray-400 transition-all"
              >
                {loading ? "Searching..." : "Track Order"}
              </button>
            </div>
          </div>

          {order && (
            <div className="space-y-8">
              {/* Order Details */}
              <div ref={detailsRef} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-primary mb-6">Order Details</h3>
                <div className="grid md:grid-cols-2 gap-6 text-gray-700">
                  <div className="space-y-3">
                    <p><span className="font-semibold">Order ID:</span> {order._id}</p>
                    <p><span className="font-semibold">Address:</span> {order.address}</p>
                    <p><span className="font-semibold">Jela:</span> {order.jela}</p>
                  </div>
                  <div className="space-y-3">
                    <p><span className="font-semibold">Payment Method:</span> {order.paymentMethod}</p>
                    <p><span className="font-semibold">Upazela:</span> {order.upazela}</p>
                    <p><span className="font-semibold">Total:</span> TK. {order.totalAmount}</p>
                  </div>
                </div>
              </div>

              {/* Order Status */}
              <div ref={statusRef} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h3 className="text-xl font-bold text-primary mb-6">Order Status</h3>
                <div className="relative pt-8">
                  <div className="absolute h-1.5 bg-gray-200 w-full top-8 left-0 rounded-full">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${getStatusProgress()}%` }}
                    />
                  </div>
                  <div className="flex justify-between">
                    {["Pending", "Confirm", "Shipped", "Delivered"].map((status) => (
                      <div key={status} className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full mb-2 flex items-center justify-center ${
                            order.status === status 
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {["Pending", "Confirm", "Shipped", "Delivered"].indexOf(status) + 1}
                        </div>
                        <span className={`text-sm ${order.status === status ? "font-bold text-green-500" : "text-gray-500"}`}>
                          {status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              {order.items && (
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                  <h3 className="text-xl font-bold text-primary mb-6">Order Items</h3>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-semibold">{item.productId?.productName || "Product"}</p>
                          <p className="text-sm text-gray-500">
                            {item.selectedSize}, {item.selectedColor}
                          </p>
                        </div>
                        <div className="text-right">
                          <p>TK. {item.price}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cancellation Section */}
              {order && !["Shipped", "Delivered"].includes(order.status) && (
                <div ref={deleteRef} className="bg-white rounded-2xl shadow-lg p-8 border border-red-100 text-center">
                  <h3 className="text-xl font-bold text-red-600 mb-4">Need to Cancel Order?</h3>
                  <p className="text-gray-600 mb-6">
                    You can request cancellation before shipping. Contact support for immediate assistance.
                  </p>
                  <button
                    onClick={() => toast.info("Cancellation request feature coming soon")}
                    className="px-6 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-400"
                  >
                    Request Cancellation
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
