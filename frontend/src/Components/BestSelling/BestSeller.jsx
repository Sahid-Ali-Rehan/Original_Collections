import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Loading from '../Loading/Loading';

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all products from your API
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://original-collections.onrender.com/api/products/fetch-products"); // Replace with your API URL
        const data = await response.json();
        // Filter the products to get only the best sellers
        const bestSellers = data.filter((product) => product.isBestSeller === true);
        setProducts(bestSellers);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleViewDetails = (productId) => {
    // Redirect to the product details page
    navigate(`/products/single/${productId}`);
  };


  if (loading) {
    return <Loading/>;
  }

  return (
    <div>
      {/* Heading for Best Sellers */}
      <h2 className="text-3xl font-bold text-center text-[#7d835f] mt-10 mb-6">
        Best Sellers
      </h2>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
          {products.map((product) => {
            const discountedPrice = product.discount ? product.price - (product.price * product.discount) / 100 : product.price;

            return (
              <div
                key={product._id}
                className="bg-white shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-200"
                style={{ height: "440px" }}
              >
                <div className="relative group">
                  <img
                    src={product.images[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={product.name}
                    className="w-full h-40 object-cover group-hover:opacity-0 transition-opacity duration-300"
                    style={{ height: "300px" }}
                  />
                  <img
                    src={product.images[1] || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ height: "300px" }}
                  />
                  {product.stock === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-sm font-bold">
                      Out of Stock
                    </div>
                  )}
                </div>
                <div className="p-4 bg-[#f5efe9]">
                  <h3 className="text-md font-semibold text-[#7d835f] truncate">{product.productName}</h3>
                  <p className="text-sm font-bold text-[#8d5c51] mt-1">
                    ৳{discountedPrice.toFixed(2)}{' '}
                    <span className="line-through text-[#7b7c4d] text-xs">৳{product.price.toFixed(2)}</span>
                  </p>
                  <p className="text-xs text-[#7b7c4d] mt-1 truncate">Code: {product.productCode}</p>
                  <button
                  className={`mt-3 w-full py-1.5 px-3 text-sm font-medium ${product.stock === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-[#8d5c51] text-white hover:bg-[#7d835f]'}`}
                  disabled={product.stock === 0}
                  onClick={() => handleViewDetails(product._id)} // Handle button click
                >
                  {product.stock === 0 ? 'Out of Stock' : 'View Details'}
                </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div>No Best Seller products available.</div>
      )}
    </div>
  );
};

export default BestSellers;
