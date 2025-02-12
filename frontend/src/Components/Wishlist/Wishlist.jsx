import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://original-collections.onrender.com/api/users/wishlist",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWishlist(response.data.wishlist);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
      {wishlist.length === 0 ? (
        <div className="text-center">
          <p className="text-xl">Your wishlist is empty</p>
          <Link to="/products" className="text-blue-500 hover:underline">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlist.map((product) => (
            <div key={product._id} className="border p-4 rounded-lg">
              <img 
                src={product.images[0]} 
                alt={product.name} 
                className="w-full h-48 object-cover"
              />
              <h3 className="text-lg font-semibold mt-2">{product.productName}</h3>
              <p className="text-gray-600">৳{product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;