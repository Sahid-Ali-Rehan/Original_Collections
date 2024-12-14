import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "../Navigations/Navbar";
import Footer from "../Footer/Footer";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const userId = localStorage.getItem("userId");
  
    if (!userId) {
      toast.error("Please log in to view your cart.");
      navigate("/login"); // Redirect to login if user is not logged in
      return;
    }
  
    const storedCart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
    
    // Ensure all items have productId set, if not, assign _id as productId
    const updatedCart = storedCart.map(item => ({
      ...item,
      productId: item.productId || item._id, // Assign _id as productId if productId is missing
    }));
    
    setCartItems(updatedCart);
  
    // Calculate total price
    const total = updatedCart.reduce((acc, item) => {
      return acc + item.quantity * item.price * (1 - item.discount / 100);
    }, 0);
    setTotalPrice(total);
  }, [navigate]);
  
  const handleQuantityChange = (item, amount) => {
    const userId = localStorage.getItem("userId");
  
    if (!userId) {
      toast.error("Please log in to update cart.");
      navigate("/login");
      return;
    }
  
    const updatedCartItems = cartItems.map((cartItem) => {
      if (cartItem._id === item._id && cartItem.selectedSize === item.selectedSize && cartItem.selectedColor === item.selectedColor) {
        const newQuantity = cartItem.quantity + amount;
  
        if (newQuantity <= 0) return null; // Prevent negative or zero quantity
        if (newQuantity > item.stock) { // Use stock value from product schema
          toast.error(`Cannot exceed the stock quantity of ${item.stock}`);
          return cartItem; // Do not update the quantity if it exceeds stock
        }
  
        return { ...cartItem, quantity: newQuantity };
      }
      return cartItem;
    }).filter(Boolean); // Remove invalid items
  
    setCartItems(updatedCartItems);
    localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCartItems));
  
    const total = updatedCartItems.reduce((acc, item) => {
      return acc + item.quantity * item.price * (1 - item.discount / 100);
    }, 0);
    setTotalPrice(total);
  };
  
  const handleRemoveItem = (item) => {
    const userId = localStorage.getItem("userId");
  
    if (!userId) {
      toast.error("Please log in to remove items from your cart.");
      navigate("/login");
      return;
    }
  
    const updatedCartItems = cartItems.filter((cartItem) => {
      return !(cartItem._id === item._id && cartItem.selectedSize === item.selectedSize && cartItem.selectedColor === item.selectedColor);
    });
  
    setCartItems(updatedCartItems);
    
    // Make sure the productId is correctly assigned if missing
    updatedCartItems.forEach(item => {
      if (!item.productId) {
        item.productId = item._id; // Assign productId if it's missing
      }
    });
  
    localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCartItems));
  
    // Recalculate total price
    const total = updatedCartItems.reduce((acc, item) => {
      return acc + item.quantity * item.price * (1 - item.discount / 100);
    }, 0);
    setTotalPrice(total);
  };
  

  if (cartItems.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="text-center my-10">
          <h2 className="text-xl font-bold">Your Cart is Empty</h2>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className=" bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mt-14 mb-14 mx-auto bg-white shadow-lg p-4 md:p-10">
        <h2 className="text-2xl font-bold text-[#8d5c51] mb-6">Your Shopping Cart</h2>

        <div className="space-y-6">
          {cartItems.map((item) => (
            <div key={item._id + item.selectedSize + item.selectedColor} className="flex justify-between items-center">
              <div className="flex items-center">
                <img src={item.images[0]} alt={item.productName} className="w-20 h-20 object-cover rounded-lg" />
                <div className="ml-4">
                  <p className="font-semibold text-[#8d5c51]">{item.productName}</p>
                  <p className="text-sm text-[#7b7c4d]">Size: {item.selectedSize}</p>
                  <p className="text-sm text-[#7b7c4d]">Color: {item.selectedColor}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(item, -1)}
                    className="px-2 py-1 bg-[#8d5c51] text-white rounded"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item, 1)}
                    className="px-2 py-1 bg-[#8d5c51] text-white rounded"
                  >
                    +
                  </button>
                </div>
                <p className="text-lg font-semibold text-[#8d5c51]">
                  Tk. {(item.quantity * item.price * (1 - item.discount / 100)).toFixed(2)}
                </p>
                <button
                  onClick={() => handleRemoveItem(item)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <p className="text-lg font-semibold text-[#8d5c51]">Total: Tk. {totalPrice.toFixed(2)}</p>
          <button
      className="px-6 py-3 bg-[#8d5c51] text-white rounded-lg hover:bg-[#7d835f] transition"
      onClick={() => navigate("/checkout")}
    >
      Checkout
    </button>
        </div>
      </div>
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default Cart;
