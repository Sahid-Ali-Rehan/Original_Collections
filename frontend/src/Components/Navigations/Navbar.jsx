import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { HiMenu } from "react-icons/hi"; // For menu
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons"; // Cart Icon

// Dropdown Items as JSON
const categories = {
    mens: [
      { name: "kimono", link: "/category/panjabi" },
      { name: "Action", link: "/category/pajama" },
      { name: "T-Shirts", link: "/category/shirts" },
      { name: "Pants", link: "/category/pants" },
    ],
    womens: [
      { name: "Dresses", link: "/category/dresses" },
      { name: "Tops", link: "/category/tops" },
      { name: "Skirts", link: "/category/skirts" },
      { name: "Blouses", link: "/category/blouses" }, // New category added
    ],
    kids: [
      { name: "Kids' Tops", link: "/category/kids-tops" },
      { name: "Kids' Pants", link: "/category/kids-pants" },
      { name: "Kids' Jackets", link: "/category/kids-jackets" }, // New category added
    ],
    accessories: [
      { name: "Watches", link: "/category/watches" },
      { name: "Belts", link: "/category/belts" },
      { name: "Sunglasses", link: "/category/sunglasses" },
    ],
    footwear: [
      { name: "Men's Shoes", link: "/category/mens-shoes" },
      { name: "Women's Shoes", link: "/category/womens-shoes" },
      { name: "Kids' Shoes", link: "/category/kids-shoes" },
    ],
  };
  

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMensDropdownOpen, setIsMensDropdownOpen] = useState(false);
  const [isWomensDropdownOpen, setIsWomensDropdownOpen] = useState(false);
  const [isKidsDropdownOpen, setIsKidsDropdownOpen] = useState(false);
  const [isAccessoriesDropdownOpen, setIsAccessoriesDropdownOpen] = useState(false);
  const [isFootwearDropdownOpen, setIsFootwearDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  // Fetch the logged-in user data and check if the token exists in localStorage
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          const userId = decodedToken?.id;

          if (userId) {
            const response = await axios.get(`https://original-collections.onrender.com/api/users/${userId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (response.data.user) {
              setUser(response.data.user);
              setIsLoggedIn(true);
            } else {
              setIsLoggedIn(false);
            }
          } else {
            setIsLoggedIn(false);
          }
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoggedIn(false);
      }
    };

    fetchUser();
  }, []);


  const handleClick = () => {
    navigate('/products');
  };


  return (
    <nav className="p-3 backdrop-blur-md  shadow-lg z-50 sticky top-0">

      <div className="max-w-screen-xl mx-auto flex justify-between items-center lg:flex-row flex-row-reverse">

        {/* Logo */}
        <div className="flex items-center space-x-2 order-last lg:order-none">
          <img src="/Images/Navlogo.png" alt="Logo" className=" h-16 object-contain" />
        </div>

        {/* Desktop Menu */}
        <div className="relative hidden lg:flex items-center space-x-6">
          {/* Men's Items Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setIsMensDropdownOpen(true)}
            onMouseLeave={() => setIsMensDropdownOpen(false)}
          >
            <button className="text-primary hover:text-[#F9A02B] transition duration-200 text-md font-semibold">
              Men's Items
            </button>
            <div
  className={`absolute left-0 mt-2 space-y-2 bg-white shadow-lg w-48 border transition-all duration-500 ease-in-out ${isMensDropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"} z-50`}
>

              {categories.mens.map((item) => (
               <Link
               to={`/products?category=mens&subcategory=${item.name.toLowerCase()}`}
               key={item.name}
               className="block px-5 py-3 text-[#F68C1F] hover:bg-[#56C5DC] hover:text-white border-b hover:border-[#56C5DC] transition duration-200"
             >
               {item.name}
             </Link>
             
              ))}
            </div>
          </div>

          {/* Women's Items Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setIsWomensDropdownOpen(true)}
            onMouseLeave={() => setIsWomensDropdownOpen(false)}
          >
            <button className="text-primary hover:text-[#F9A02B] transition duration-200 text-md font-semibold">
              Women's Items
            </button>
            <div
              className={`absolute left-0 mt-2 space-y-2 bg-white shadow-lg w-48 border  transition-all duration-500 ease-in-out ${isWomensDropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
            >
              {categories.womens.map((item) => (
                  <Link
                  to={`/products?category=mens&subcategory=${item.name.toLowerCase()}`}
                  key={item.name}
                  className="block px-5 py-3 text-[#F68C1F] hover:bg-[#56C5DC] hover:text-white border-b hover:border-[#a0926c] transition duration-200"
                >
                  {item.name}
                </Link>
                
              ))}
            </div>
          </div>

          {/* Kid's Items Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setIsKidsDropdownOpen(true)}
            onMouseLeave={() => setIsKidsDropdownOpen(false)}
          >
            <button className="text-primary hover:text-[#F9A02B] transition duration-200 text-md font-semibold">
              Kid's Items
            </button>
            <div
              className={`absolute left-0 mt-2 space-y-2 bg-white shadow-lg w-48 border  transition-all duration-500 ease-in-out ${isKidsDropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
            >
              {categories.kids.map((item) => (
                  <Link
                  to={`/products?category=mens&subcategory=${item.name.toLowerCase()}`}
                  key={item.name}
                  className="block px-5 py-3 text-[#F68C1F] hover:bg-[#56C5DC] hover:text-white border-b hover:border-[#a0926c] transition duration-200"
                >
                  {item.name}
                </Link>
                
              ))}
            </div>
          </div>


         {/* Accessories Items Dropdown */}
         <div
            className="relative group"
            onMouseEnter={() => setIsAccessoriesDropdownOpen(true)}
            onMouseLeave={() => setIsAccessoriesDropdownOpen(false)}
          >
            <button className="text-primary hover:text-[#F9A02B] transition duration-200 text-md font-semibold">
              Accessories Items
            </button>
            <div
              className={`absolute left-0 mt-2 space-y-2 bg-white shadow-lg w-48 border  transition-all duration-500 ease-in-out ${isAccessoriesDropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
            >
              {categories.accessories.map((item) => (
                  <Link
                  to={`/products?category=mens&subcategory=${item.name.toLowerCase()}`}
                  key={item.name}
                  className="block px-5 py-3 text-[#F68C1F] hover:bg-[#56C5DC] hover:text-white border-b hover:border-[#a0926c] transition duration-200"
                >
                  {item.name}
                </Link>
                
              ))}
            </div>
          </div>

          {/* Footwear Items Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setIsFootwearDropdownOpen(true)}
            onMouseLeave={() => setIsFootwearDropdownOpen(false)}
          >
            <button className="text-primary hover:text-[#F9A02B] transition duration-200 text-md font-semibold">
              Footwear Items
            </button>
            <div
              className={`absolute left-0 mt-2 space-y-2 bg-white shadow-lg w-48 border  transition-all duration-500 ease-in-out ${isFootwearDropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
            >
              {categories.footwear.map((item) => (
                  <Link
                  to={`/products?category=mens&subcategory=${item.name.toLowerCase()}`}
                  key={item.name}
                  className="block px-5 py-3 text-[#F68C1F] hover:bg-[#56C5DC] hover:text-white border-b hover:border-[#a0926c] transition duration-200"
                >
                  {item.name}
                </Link>
                
              ))}
            </div>
          </div>

          <button onClick={handleClick} className="text-primary hover:text-[#F9A02B] transition duration-200 text-md font-semibold">
              All Products
            </button>


        </div>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden">
          <button
            className="text-[#8d5c51] text-3xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <HiMenu />
          </button>
        </div>

        {/* Cart and Avatar/ Login */}
        <div className="flex items-center space-x-4">
          {/* Cart */}
          <Link to="/cart" className="flex items-center">
            <FontAwesomeIcon
              icon={faShoppingCart}
              className="w-6 h-6 text-primary hover:text-[#F9A02B] transition-all duration-200"
            />
          </Link>

          {/* Avatar or Login/Signup */}
          {isLoggedIn ? (
            <span className="w-7 h-7 flex items-center justify-center text-primary bg-[#F9A02B] rounded-full text-md">
              {user?.fullname?.[0]}
            </span>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="text-primary hover:text-[#F9A02B] transition duration-200 text-sm font-semibold"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-primary hover:text-[#F9A02B] transition duration-200 text-sm font-semibold"
              >
                Sign Up
              </Link>
            </div>
          )}

          
        </div>
      </div>

     {/* Mobile Menu */}
{isMenuOpen && (
  <div className="lg:hidden bg-white px-6 py-4 space-y-4 mt-4 border-t">
    {/* Men's Items */}
    <div className="space-y-2">
      <button
        className="w-full text-left text-lg text-primary  font-semibold"
        onClick={() => setIsMensDropdownOpen(!isMensDropdownOpen)}
      >
        Men's Items
      </button>
      {isMensDropdownOpen && (
        <div className="space-y-2">
          {categories.mens.map((item) => (
              <Link
              to={`/products?category=mens&subcategory=${item.name.toLowerCase()}`}
              key={item.name}
              className="block px-5 py-3 text-[#56C5DC] hover:bg-[#56C5DC] hover:text-white border-b hover:border-[#a0926c] transition duration-200"
            >
              {item.name}
            </Link>
            
          ))}
        </div>
      )}
    </div>

    {/* Women's Items */}
    <div className="space-y-2">
      <button
        className="w-full text-left text-lg text-primary font-semibold"
        onClick={() => setIsWomensDropdownOpen(!isWomensDropdownOpen)}
      >
        Women's Items
      </button>
      {isWomensDropdownOpen && (
        <div className="space-y-2">
          {categories.womens.map((item) => (
              <Link
              to={`/products?category=mens&subcategory=${item.name.toLowerCase()}`}
              key={item.name}
              className="block px-5 py-3 text-[#56C5DC] hover:bg-[#56C5DC] hover:text-white border-b hover:border-[#a0926c] transition duration-200"
            >
              {item.name}
            </Link>
            
          ))}
        </div>
      )}
    </div>

    {/* Kid's Items */}
    <div className="space-y-2">
      <button
        className="w-full text-left text-lg text-primary font-semibold"
        onClick={() => setIsKidsDropdownOpen(!isKidsDropdownOpen)}
      >
        Kid's Items
      </button>
      {isKidsDropdownOpen && (
        <div className="space-y-2">
          {categories.kids.map((item) => (
              <Link
              to={`/products?category=mens&subcategory=${item.name.toLowerCase()}`}
              key={item.name}
              className="block px-5 py-3 text-[#56C5DC] hover:bg-[#56C5DC] hover:text-white border-b hover:border-[#a0926c] transition duration-200"
            >
              {item.name}
            </Link>
            
          ))}
        </div>
      )}
    </div>

    {/* Accessories Items */}
    <div className="space-y-2">
      <button
        className="w-full text-left text-lg text-primary font-semibold"
        onClick={() => setIsAccessoriesDropdownOpen(!isAccessoriesDropdownOpen)}
      >
        Accessories Items
      </button>
      {isAccessoriesDropdownOpen && (
        <div className="space-y-2">
          {categories.accessories.map((item) => (
             <Link
             to={`/products?category=mens&subcategory=${item.name.toLowerCase()}`}
             key={item.name}
             className="block px-5 py-3 text-[#56C5DC] hover:bg-[#56C5DC] hover:text-white border-b hover:border-[#a0926c] transition duration-200"
           >
             {item.name}
           </Link>
           
          ))}
        </div>
      )}
    </div>

    {/* Footwear Items */}
    <div className="space-y-2">
      <button
        className="w-full text-left text-lg text-primary font-semibold"
        onClick={() => setIsFootwearDropdownOpen(!isFootwearDropdownOpen)}
      >
        Footwear Items
      </button>
      {isFootwearDropdownOpen && (
        <div className="space-y-2">
          {categories.footwear.map((item) => (
              <Link
              to={`/products?category=mens&subcategory=${item.name.toLowerCase()}`}
              key={item.name}
              className="block px-5 py-3 text-[#56C5DC] hover:bg-[#56C5DC] hover:text-white border-b hover:border-[#a0926c] transition duration-200"
            >
              {item.name}
            </Link>
            
          ))}
        </div>
      )}
    </div>

    <button onClick={handleClick} className="text-primary hover:text-[#F9A02B] transition duration-200 text-md font-semibold">
              All Products
            </button>
  </div>
)}

    </nav>
  );
};

export default Navbar;
