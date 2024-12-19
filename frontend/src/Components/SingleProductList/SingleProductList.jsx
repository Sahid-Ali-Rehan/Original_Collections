import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Navigations/Navbar";
import Footer from "../Footer/Footer";
import { motion } from "framer-motion"; // Adding framer-motion for animations

const SingleProductList = () => {
  const { id } = useParams(); // Get the product ID from URL
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(""); // State for selected size
  const [selectedColor, setSelectedColor] = useState(""); // State for selected color

  const imageRef = useRef(null);

  useEffect(() => {
    if (!id) {
      console.error("Product ID is missing.");
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://ruhana.onrender.com/api/products/single/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        const data = await response.json();
        setProduct(data);
        setMainImage(data.images[0]);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchProduct();
  }, [id]);

  const handleZoom = (e) => {
    const image = imageRef.current;
    const { left, top, width, height } = image.getBoundingClientRect();
    const offsetX = e.clientX - left;
    const offsetY = e.clientY - top;

    const percentX = offsetX / width;
    const percentY = offsetY / height;

    const scale = 2; // Adjust zoom scale
    image.style.transformOrigin = `${percentX * 100}% ${percentY * 100}%`;
    image.style.transform = `scale(${scale})`;
  };

  const resetZoom = () => {
    const image = imageRef.current;
    image.style.transform = "scale(1)";
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const selectedSizePrice = product.availableSizes?.find(sizeObj => sizeObj.size === selectedSize)?.sizePrice || product.price;
  const discountedPrice = selectedSizePrice * (1 - product.discount / 100);

  const handleSizeSelection = (size) => {
    setSelectedSize(size);
  };

  const handleColorSelection = (color) => {
    setSelectedColor(color);
  };

  const handleQuantityChange = (amount) => {
    if (amount > product.stock) {
      toast.error("Not enough stock available");
    } else {
      setQuantity(amount);
    }
  };

  const addToCart = (product) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("Please log in to add items to your cart.");
      return;
    }

    if (!selectedSize || !selectedColor) {
      toast.error("Please select both size and color.");
      return;
    }

    const selectedSizePrice = product.availableSizes?.find(
      (sizeObj) => sizeObj.size === selectedSize
    )?.sizePrice;

    if (!selectedSizePrice) {
      toast.error("Invalid size selected.");
      return;
    }

    const existingCartItems = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
    const existingItem = existingCartItems.find(
      (item) =>
        item._id === product._id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );

    if (existingItem) {
      const updatedQuantity = existingItem.quantity + 1;
      if (updatedQuantity > product.stock) {
        toast.error(`Cannot add more than ${product.stock} items of ${product.productName} to the cart.`);
        return;
      }
      existingItem.quantity = updatedQuantity;
      localStorage.setItem(`cart_${userId}`, JSON.stringify(existingCartItems));
      toast.info("Product quantity increased in the cart!");
    } else {
      if (product.stock < 1) {
        toast.error("Out of stock!");
        return;
      }
      const cartItem = {
        ...product,
        price: selectedSizePrice,
        quantity: 1,
        selectedSize,
        selectedColor,
      };
      existingCartItems.push(cartItem);
      localStorage.setItem(`cart_${userId}`, JSON.stringify(existingCartItems));
      toast.success("Product added to the cart!");
    }
  };

  return (
    <div className="bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto bg-white py-14 px-6 sm:px-12 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <div className="relative overflow-hidden">
              <img
                src={mainImage}
                alt={product.productName}
                ref={imageRef}
                className="w-full rounded-xl object-cover transition-transform duration-300"
                onMouseMove={handleZoom}
                onMouseLeave={resetZoom}
                style={{ cursor: "zoom-in", height: "500px" }}
              />
            </div>
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-16 h-16 object-cover rounded-lg cursor-pointer border-2 border-transparent hover:border-indigo-500 transition-all"
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-3xl font-extrabold text-gray-800">{product.productName}</h1>
            <p className="text-lg text-gray-600">Product Code: {product.productCode}</p>
            <div>
              <p className="text-2xl font-bold text-indigo-600">
                Tk. {discountedPrice.toFixed(2)}{" "}
                <span className="line-through text-gray-400">Tk. {selectedSizePrice}</span>
              </p>
              <p className="text-md text-gray-500">You Save: Tk. {(selectedSizePrice - discountedPrice).toFixed(2)}</p>
            </div>

            {/* Size Selection */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-700">Select Size</h3>
              <div className="grid grid-cols-4 gap-2 mt-3">
                {product.availableSizes.map((sizeObj) => (
                  <motion.button
                    key={sizeObj.size}
                    className={`px-4 py-2 border rounded-lg text-sm transition-all ${
                      selectedSize === sizeObj.size
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                    onClick={() => handleSizeSelection(sizeObj.size)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {sizeObj.size} - Tk. {sizeObj.sizePrice}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-700">Select Color</h3>
              <div className="flex space-x-3 mt-3">
                {product.availableColors.map((color) => (
                  <motion.button
                    key={color}
                    className={`w-8 h-8 rounded-full border transition-all ${
                      selectedColor === color ? "border-indigo-600" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelection(color)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.95 }}
                  ></motion.button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-700">Quantity</h3>
              <div className="flex items-center space-x-4 mt-3">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  -
                </button>
                <span className="text-lg">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  +
                </button>
              </div>
            </div>

            <motion.button
              onClick={() => addToCart(product)}
              className="w-full py-4 bg-indigo-600 text-white text-lg font-bold rounded-xl mt-6 hover:bg-indigo-700 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add to Cart
            </motion.button>
          </div>
        </div>

        <div className="mt-10">
          {/* Tabs */}
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("description")}
              className={`px-4 py-2 text-sm font-medium ${activeTab === "description" ? "bg-[#8d5c51] text-white" : "bg-[#f4ebb4] text-black"}`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab("sizeChart")}
              className={`px-4 py-2 text-sm font-medium ${activeTab === "sizeChart" ? "bg-[#8d5c51] text-white" : "bg-[#f4ebb4] text-black"}`}
            >
              Size Chart
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "description" && (
            <div className="mt-4 text-[#7b7c4d]">
              <p>{product.description}</p>
            </div>
          )}
          {activeTab === "sizeChart" && (
  <div className="mt-4">
    <img
      src={product.sizeChart}
      alt="Size Chart"
      className="w-full h-auto object-contain" // You can adjust these styles as per your preference
    />
  </div>
)}

        </div>


      </div>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default SingleProductList;

