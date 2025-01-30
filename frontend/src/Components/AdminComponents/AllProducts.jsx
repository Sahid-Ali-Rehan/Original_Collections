import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://original-collections.onrender.com/api/products/fetch-products', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to fetch products');
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://original-collections.onrender.com/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Product deleted successfully');
      setProducts(products.filter(product => product._id !== id)); // Remove deleted product from the list
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  // Navigate to edit page on button click
  const handleEdit = (productId) => {
    navigate(`/edit-product/${productId}`); // Navigate to edit page with productId
  };

  return (
    <div className="p-8 bg-[#f4ebb4] min-h-screen">
      <h2 className="text-3xl font-bold text-[#8d5c51] mb-6">All Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const discount = product.discount || 0;
          const originalPrice = product.price;
          const discountedPrice = discount > 0 ? originalPrice - (originalPrice * discount) / 100 : originalPrice;

          return (
            <div key={product._id} className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="h-72 overflow-hidden rounded-lg mb-4">
                <img
                  src={product.images[0]}
                  alt={product.productName}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-[#8d5c51] truncate">{product.productName}</h3>
              <p className="text-[#7b7c4d] text-sm mb-4 truncate">{product.description}</p>

              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-col">
                  {discount > 0 ? (
                    <p className="text-lg font-bold text-[#8d5c51] line-through">
                      BDT: {Math.floor(originalPrice)}
                    </p>
                  ) : null}
                  <p className="text-lg font-bold text-[#8d5c51]">
                    BDT: {Math.floor(discountedPrice)}
                  </p>
                </div>
                {product.stock > 0 ? (
                  <span className="text-sm text-green-600 font-semibold">In Stock</span>
                ) : (
                  <span className="text-sm text-red-600 font-semibold">Out of Stock</span>
                )}
              </div>

              <p className="text-sm text-gray-500 mb-4">Product Code: {product.productCode}</p>

              <div className="mb-4">
                {product.price < 50 && product.stock > 10 ? (
                  <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-semibold">Worth It!</span>
                ) : null}
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleEdit(product._id)} // Navigating to edit page with product ID
                  className="bg-[#a0926c] text-white px-4 py-2 rounded-lg hover:bg-[#7d835f] transition-all duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-[#996a6c] text-white px-4 py-2 rounded-lg hover:bg-[#7d4f4b] transition-all duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllProducts;
