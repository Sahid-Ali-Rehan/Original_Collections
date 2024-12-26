import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const RelatedProducts = ({ category }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await fetch(
          `https://ruhana.onrender.com/api/products/related/${category}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch related products");
        }
        const data = await response.json();
        setRelatedProducts(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    if (category) {
      fetchRelatedProducts();
    }
  }, [category]);

  if (relatedProducts.length === 0) return null;

  const calculateDiscountedPrice = (price, discount) => {
    return price - (price * discount) / 100;
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => {
          const discountedPrice = calculateDiscountedPrice(
            product.price,
            product.discount
          );
          return (
            <div
              key={product._id}
              className="bg-white shadow-lg mb-8 overflow-hidden transform transition-transform duration-300 hover:scale-105 rounded-md"
            >
              <div className="relative group">
                <img
                  src={product.images[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                  alt={product.productName}
                  className="w-full h-72 object-cover group-hover:opacity-0 transition-opacity duration-300"
                />
                <img
                  src={product.images[1] || 'https://via.placeholder.com/400x300?text=No+Image+Hover'}
                  alt={product.productName}
                  className="w-full h-72 object-cover opacity-0 group-hover:opacity-100 absolute top-0 left-0 transition-opacity duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-[#7b7c4d] truncate">
                  {product.productName}
                </h3>
                <p className="text-sm text-gray-600">{product.productCode}</p>
                <p className="font-semibold text-xl mt-2 text-[#7b7c4d]">
                  ৳{discountedPrice.toFixed(2)}{' '}
                  {product.discount > 0 && (
                    <span className="line-through text-sm text-gray-400">
                      ৳{product.price.toFixed(2)}
                    </span>
                  )}
                </p>
              </div>
              <Link to={`/products/single/${product._id}`}>
                <button
                  className="w-full bg-[#7b7c4d] text-white py-2 mt-4 hover:bg-[#a2a25b] transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#a2a25b] focus:ring-opacity-50"
                >
                  View Details
                </button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;
