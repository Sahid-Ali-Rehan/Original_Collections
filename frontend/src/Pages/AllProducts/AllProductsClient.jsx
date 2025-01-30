import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../Components/Navigations/Navbar';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Loading from '../../Components/Loading/Loading';

const AllProductsClient = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    productCode: '',
    category: '',
    subCategory: '',
    color: '',
    size: '',
    sort: 'low-to-high',
  });

  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const categoryFromUrl = urlParams.get('category');
  const subCategoryFromUrl = urlParams.get('subcategory');

  useEffect(() => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      category: categoryFromUrl || '',
      subCategory: subCategoryFromUrl || '',
    }));
  }, [categoryFromUrl, subCategoryFromUrl]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('https://original-collections.onrender.com/api/products/fetch-products', {
          params: {
            search: filters.search,
            productCode: filters.productCode,
            category: filters.category,
            subCategory: filters.subCategory,
            color: filters.color,
            size: filters.size,
            sort: filters.sort,
            page: currentPage,
            perPage,
          },
        });
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters, currentPage, perPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  

  const getUniqueValues = (field) => {
    const values = products.map((product) => product[field]).flat();
    return [...new Set(values)];
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const calculateDiscountedPrice = (price, discount) => {
    return price - (price * (discount / 100));
  };

  const applyFilters = () => {
    let result = [...products];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter((product) => {
        const productName = product.productName?.toLowerCase() || '';
        const productCode = product.productCode?.toLowerCase() || '';
        return productName.includes(searchTerm) || productCode.includes(searchTerm);
      });
    }

    if (filters.category) {
      result = result.filter((product) => product.category === filters.category);
    }

    if (filters.subCategory) {
      result = result.filter((product) => product.subCategory === filters.subCategory);
    }

    if (filters.color) {
      result = result.filter((product) => product.availableColors.includes(filters.color));
    }

    if (filters.size) {
      result = result.filter((product) => product.availableSizes.some((size) => size.size === filters.size));
    }

    if (filters.sort === 'low-to-high') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'high-to-low') {
      result.sort((a, b) => b.price - a.price);
    }

    setFilteredProducts(result);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, products]);

  const navigate = useNavigate();

  const handleViewDetails = (productId) => {
    navigate(`/products/single/${productId}`);
  };

  return (
    <div className="container mx-auto bg-[#f4ebb4]">
      <Navbar />
      <div className="flex flex-col md:flex-row">
        {/* Left Sidebar */}
        <div className="md:w-1/4 p-4 bg-white shadow-md">
          <div className="mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full bg-[#7b7c4d] text-white p-3 sticky shadow-md text-lg flex justify-between items-center"
            >
              Filters
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transform ${showFilters ? 'rotate-180' : ''}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {showFilters && (
            <div className="bg-white shadow-md rounded-lg p-6 mt-4">
              <h2 className="text-2xl font-semibold text-[#7b7c4d] mb-4">Filters</h2>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  name="productCode"
                  value={filters.productCode}
                  onChange={handleFilterChange}
                  placeholder="Search by Product Code"
                  className="p-3 border border-[#8d5c51] rounded-lg w-full bg-[#faeed5] text-[#7b7c4d]"
                />
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search by name"
                  className="p-3 border border-[#8d5c51] rounded-lg w-full bg-[#faeed5] text-[#7b7c4d]"
                />
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="p-3 border border-[#8d5c51] rounded-lg w-full bg-[#faeed5] text-[#7b7c4d]"
                >
                  <option value="">Select Category</option>
                  {getUniqueValues('category').map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <select
                  name="subCategory"
                  value={filters.subCategory}
                  onChange={handleFilterChange}
                  className="p-3 border border-[#8d5c51] rounded-lg w-full bg-[#faeed5] text-[#7b7c4d]"
                >
                  <option value="">Select Subcategory</option>
                  {getUniqueValues('subCategory').map((subCategory) => (
                    <option key={subCategory} value={subCategory}>
                      {subCategory}
                    </option>
                  ))}
                </select>
                <select
                  name="color"
                  value={filters.color}
                  onChange={handleFilterChange}
                  className="p-3 border border-[#8d5c51] rounded-lg w-full bg-[#faeed5] text-[#7b7c4d]"
                >
                  <option value="">Select Color</option>
                  {getUniqueValues('availableColors').map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
                <select
                  name="size"
                  value={filters.size}
                  onChange={handleFilterChange}
                  className="p-3 border border-[#8d5c51] rounded-lg w-full bg-[#faeed5] text-[#7b7c4d]"
                >
                  <option value="">Select Size</option>
                  {getUniqueValues('availableSizes').map((size) => (
                    <option key={size.size} value={size.size}>
                      {size.size}
                    </option>
                  ))}
                </select>
                <select
                  name="sort"
                  value={filters.sort}
                  onChange={handleFilterChange}
                  className="p-3 border border-[#8d5c51] rounded-lg w-full bg-[#faeed5] text-[#7b7c4d]"
                >
                  <option value="low-to-high">Price: Low to High</option>
                  <option value="high-to-low">Price: High to Low</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="md:w-3/4 p-4">
  {loading ? (
    <Loading />  // Show loading component while data is being fetched
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.length === 0 ? (
        <p className="col-span-4 text-center text-lg text-[#7b7c4d]">No products available.</p>
      ) : (
        filteredProducts.map((product) => {
          const discountedPrice = calculateDiscountedPrice(product.price, product.discount);

          return (
            <div
              key={product._id}
              className="bg-white shadow-md overflow-hidden transform transition-transform duration-200 h-auto w-full lg:h-[460px] lg:w-[300px]"
            >
              <div className="relative group">
                {/* First Image (Default) */}
                <img
                  src={product.images[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                  alt={product.name}
                  className="w-full h-72 object-cover group-hover:opacity-0 transition-opacity duration-300"
                />
                {/* Second Image (On Hover) */}
                <img
                  src={product.images[1] || 'https://via.placeholder.com/400x300?text=No+Image+Hover'}
                  alt={product.name}
                  className="w-full h-72 object-cover opacity-0 group-hover:opacity-100 absolute top-0 left-0 transition-opacity duration-300"
                />
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg text-[#7b7c4d]">{product.productName}</h3>
                <p className="text-sm text-gray-600">{product.productCode}</p>
                <p className="font-semibold text-xl mt-2 text-[#7b7c4d]">
                  ৳{discountedPrice.toFixed(2)}{' '}
                  {product.discount > 0 && (
                    <span className="line-through text-sm text-gray-400">৳{product.price.toFixed(2)}</span>
                  )}
                </p>
              </div>

              <button
                onClick={() => handleViewDetails(product._id)}
                className="w-full bg-[#7b7c4d] text-white py-2 mt-4 hover:bg-[#a2a25b] transition duration-300"
              >
                View Details
              </button>
            </div>
          );
        })
      )}
    </div>
  )}

  {/* Pagination */}
  <div className="flex justify-center mt-8">
    <button
      onClick={() => paginate(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-4 py-2 bg-[#7b7c4d] text-white rounded-lg mr-2 disabled:opacity-50"
    >
      Previous
    </button>
    <button
      onClick={() => paginate(currentPage + 1)}
      className="px-4 py-2 bg-[#7b7c4d] text-white rounded-lg disabled:opacity-50"
    >
      Next
    </button>
  </div>
</div>

      </div>
    </div>
  );
};

export default AllProductsClient;
