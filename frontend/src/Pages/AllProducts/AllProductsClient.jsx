import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../Components/Navigations/Navbar';
import Footer from '../../Components/Footer/Footer';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const AllProductsClient = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    productCode: '',
    category: '',
    subCategory: '',
    color: '',
    size: '',
    sort: 'low-to-high',
  });

  // Get URL parameters for category and subcategory
const location = useLocation();
const urlParams = new URLSearchParams(location.search);

const categoryFromUrl = urlParams.get('category');
const subCategoryFromUrl = urlParams.get('subcategory');

useEffect(() => {
    // Set the filters based on URL parameters if available
    setFilters((prevFilters) => ({
      ...prevFilters,
      category: categoryFromUrl || '',
      subCategory: subCategoryFromUrl || '',
    }));
  }, [categoryFromUrl, subCategoryFromUrl]);

  
  
  // Fetch products data and available filters
  useEffect(() => {
    const fetchProducts = async () => {
        try {
          const { data } = await axios.get('https://ruhana.onrender.com/api/products/fetch-products', {
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
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };
      
      

    fetchProducts();
  }, [filters, currentPage, perPage]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Get unique values for categories, subcategories, colors, sizes
  const getUniqueValues = (field) => {
    const values = products.map(product => product[field]).flat();
    return [...new Set(values)];
  };

  // Paginate products
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Calculate discounted price
  const calculateDiscountedPrice = (price, discount) => {
    return price - (price * (discount / 100));
  };

  // Filtered products after applying filters
  const applyFilters = () => {
    let result = [...products];
  
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter((product) => {
        const productName = product.productName?.toLowerCase() || ''; // Safely access productName
        const productCode = product.productCode?.toLowerCase() || ''; // Safely access productCode
  
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
      result = result.filter((product) => product.availableSizes.includes(filters.size));
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



  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleViewDetails = (productId) => {
    // Redirect to the product details page
    navigate(`/products/single/${productId}`);
  };


  return (
    <div className="container mx-auto bg-[#f4ebb4]">
      <Navbar />

      
  {/* Filter Bar */}

      <div className="mb-8">
  {/* Dropdown Button */}
  <div className="relative">
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

  {/* Dropdown Content */}
  {showFilters && (
    <div className="bg-white shadow-md rounded-lg p-6 mt-4">
      <h2 className="text-2xl font-semibold text-[#7b7c4d] mb-4">Filters</h2>
      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          name="productCode"
          value={filters.productCode}
          onChange={handleFilterChange}
          placeholder="Search by Product Code"
          className="p-3 border border-[#8d5c51] rounded-lg w-full sm:w-auto bg-[#faeed5] text-[#7b7c4d]"
        />
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
          placeholder="Search by name"
          className="p-3 border border-[#8d5c51] rounded-lg w-full sm:w-auto bg-[#faeed5] text-[#7b7c4d]"
        />
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="p-3 border border-[#8d5c51] rounded-lg w-full sm:w-auto bg-[#faeed5] text-[#7b7c4d]"
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
          className="p-3 border border-[#8d5c51] rounded-lg w-full sm:w-auto bg-[#faeed5] text-[#7b7c4d]"
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
          className="p-3 border border-[#8d5c51] rounded-lg w-full sm:w-auto bg-[#faeed5] text-[#7b7c4d]"
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
          className="p-3 border border-[#8d5c51] rounded-lg w-full sm:w-auto bg-[#faeed5] text-[#7b7c4d]"
        >
          <option value="">Select Size</option>
          {getUniqueValues('availableSizes').map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <select
          name="sort"
          value={filters.sort}
          onChange={handleFilterChange}
          className="p-3 border border-[#8d5c51] rounded-lg w-full sm:w-auto bg-[#faeed5] text-[#7b7c4d]"
        >
          <option value="low-to-high">Price: Low to High</option>
          <option value="high-to-low">Price: High to Low</option>
        </select>
      </div>
    </div>
  )}
</div>


     {/* Product Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
  {filteredProducts.length === 0 ? (
    <p className="col-span-4 text-center text-lg text-[#7b7c4d]">No products available.</p>
  ) : (
    filteredProducts.map((product) => {
      const discountedPrice = calculateDiscountedPrice(product.price, product.discount);

      return (
        <div
          key={product._id}
          className="bg-white shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-200"
          style={{  height: "440px" }}
       
       >
          <div className="relative group">
            <img
              src={product.images[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
              alt={product.name}
              className="w-full h-40 object-cover group-hover:opacity-0 transition-opacity duration-300"
          style={{  height: "300px" }}
            
            />
            <img
              src={product.images[1] || 'https://via.placeholder.com/400x300?text=No+Image'}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{  height: "300px" }}
          
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
    })
  )}
</div>


      {/* Pagination */}
      <div className="flex justify-center mt-8 p-6">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="p-2 border border-[#8d5c51] text-[#7b7c4d] hover:bg-[#faeed5]">Previous</button>
        <span className="p-2 text-[#7b7c4d]">Page {currentPage}</span>
        <button onClick={() => paginate(currentPage + 1)} className="p-2 border border-[#8d5c51]  text-[#7b7c4d] hover:bg-[#faeed5]">Next</button>
      </div>

      <Footer />
    </div>
  );
};

export default AllProductsClient;
