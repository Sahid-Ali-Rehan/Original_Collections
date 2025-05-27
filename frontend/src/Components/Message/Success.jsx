import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../Navigations/Navbar";
import Footer from "../Footer/Footer";
import Confetti from 'react-confetti';

const Success = () => {
  const navigate = useNavigate();
  const order = JSON.parse(localStorage.getItem("orderSuccess"));

  useEffect(() => {
    if (!order) navigate("/");
    const timer = setTimeout(() => {
      localStorage.removeItem("orderSuccess");
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
      <Confetti recycle={false} numberOfPieces={800} />
      <Navbar />
      
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-4xl mx-auto px-4 py-20 text-center"
      >
        <div className="bg-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 opacity-10" />
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex justify-center mb-8"
          >
            <svg className="w-32 h-32 text-green-500" fill="none" viewBox="0 0 24 24">
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
                stroke="currentColor"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>

          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Payment Successful!
          </h1>
          
          <div className="space-y-6 mb-12">
            <p className="text-xl text-gray-600">
              Thank you for your order! We've sent a confirmation email with your invoice.
            </p>
            
            <div className="inline-block p-4 bg-green-50 rounded-xl text-left">
              <p className="text-lg font-semibold">
                Estimated Delivery: {new Date(order.estimatedDeliveryDate).toLocaleDateString()}
              </p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                ৳{order.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/my-profile")}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-12 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            Track Your Order →
          </motion.button>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default Success;