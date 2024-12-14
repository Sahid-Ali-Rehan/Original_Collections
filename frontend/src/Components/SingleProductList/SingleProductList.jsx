import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom"; // For dynamic routing
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "../Navigations/Navbar";
import Footer from "../Footer/Footer";

const SingleProductList = () => {
  const { id } = useParams(); // Get the product ID from URL
  const [product, setProduct] = useState(null); // State to store fetched product
  const [mainImage, setMainImage] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(""); // State for selected size
  const [selectedColor, setSelectedColor] = useState(""); // State for selected color

  const imageRef = useRef(null);

  // Fetch product data based on ID
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
    return <div>Loading...</div>; // Or some other fallback for loading state
  }

  const discountedPrice = product.price * (1 - product.discount / 100);

  const handleSizeSelection = (size) => {
    setSelectedSize(size);
  };

  const handleColorSelection = (color) => {
    setSelectedColor(color);
  };

  const handleQuantityChange = (amount) => {
    if (amount > product.stock) {
      alert("Not enough stock available");
    } else {
      setQuantity(amount);
    }
  };

  const addToCart = (product) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error("Please log in to add items to your cart.");
      return;
    }

    if (!selectedSize || !selectedColor) {
      toast.error("Please select both size and color.");
      return;
    }

    const existingCartItems = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];

    const existingItem = existingCartItems.find(item => item._id === product._id && item.selectedSize === selectedSize && item.selectedColor === selectedColor);

    if (existingItem) {
      const updatedQuantity = existingItem.quantity + 1;
      if (updatedQuantity > product.stock) {
        toast.error(`Cannot add more than ${product.stock} items of ${product.productName} to the cart.`);
        return;
      }
      existingItem.quantity = updatedQuantity;
      localStorage.setItem(`cart_${userId}`, JSON.stringify(existingCartItems));
      toast.info('Product quantity increased in the cart!');
    } else {
      if (product.stock < 1) {
        toast.error("Out of stock!");
        return;
      }
      product.quantity = 1;
      product.selectedSize = selectedSize;
      product.selectedColor = selectedColor;
      existingCartItems.push(product);
      localStorage.setItem(`cart_${userId}`, JSON.stringify(existingCartItems));
      toast.success('Product added to the cart!');
    }
  };

  return (
    <div className=" bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mt-14 mb-14 mx-auto bg-white shadow-lg  p-4 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="relative overflow-hidden">
              <img
                src={mainImage}
                alt={product.productName}
                ref={imageRef}
                className="w-full rounded-lg object-cover transition-transform duration-300"
                onMouseMove={handleZoom}
                onMouseLeave={resetZoom}
                style={{ cursor: "zoom-in", height: "500px" }}
              />
            </div>
            <div className="flex space-x-2">
              {product.images && product.images.length > 0 ? (
                product.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-16 h-16 object-cover rounded-lg cursor-pointer border-2 border-transparent hover:border-red-500"
                    onClick={() => setMainImage(img)}
                  />
                ))
              ) : (
                <div>No images available</div>
              )}
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#8d5c51]">{product.productName}</h1>
            <p className="text-sm text-[#7d835f]">Product Code: {product.productCode}</p>
            <div className="mt-4">
              <p className="text-xl text-[#8d5c51] font-bold">
                Tk. {discountedPrice.toFixed(2)}{" "}
                <span className="line-through text-gray-400">Tk. {product.price}</span>
              </p>
              <p className="text-sm text-[#7b7c4d]">You Save: Tk. {(product.price - discountedPrice).toFixed(2)}</p>
            </div>

            {/* Select Size */}
            <div className="mt-6 mb-10">
              <label className="text-sm font-semibold text-[#7b7c4d]">Select Size:</label>
              <div className="flex space-x-4 mt-2">
                {product.availableSizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeSelection(size)}
                    className={`px-4 py-2 ${selectedSize === size ? "bg-[#8d5c51] text-white" : "bg-[#f4ebb4] hover:bg-[#8d5c51] hover:text-white"} transition`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Select Color */}
            <div className="mt-6 mb-10">
              <label className="text-sm font-semibold text-[#7b7c4d]">Select Color:</label>
              <div className="flex space-x-4 mt-2">
                {product.availableColors?.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorSelection(color)}
                    className={`px-4 py-2 ${selectedColor === color ? "bg-[#8d5c51] text-white" : "bg-[#f4ebb4] hover:bg-[#8d5c51] hover:text-white"} transition`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="mt-6 flex items-center space-x-4">
              <button onClick={() => addToCart(product)} className="px-32 py-3 bg-[#8d5c51] text-white hover:bg-[#7d835f] transition">
                Add to Cart
              </button>
            </div>
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
      <ToastContainer />
      <Footer />
    </div>
  );
};

export default SingleProductList;
