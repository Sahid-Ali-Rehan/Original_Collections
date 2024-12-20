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

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Related Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <div key={product._id} className="border rounded-lg p-4 shadow-sm">
            <Link to={`/product/${product._id}`}>
              <img
                src={product.images[0]}
                alt={product.productName}
                className="w-full h-48 object-cover rounded-lg"
              />
              <h3 className="mt-2 text-lg font-semibold text-gray-700">
                {product.productName}
              </h3>
              <p className="text-gray-500 text-sm">{product.category}</p>
              <p className="mt-1 text-indigo-600 font-bold">
                Tk. {product.price.toFixed(2)}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
