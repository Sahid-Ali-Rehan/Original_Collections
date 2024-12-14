import React from 'react';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaPlusCircle, FaBox, FaShoppingCart, FaUsers } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="bg-[#7b7c4d] w-64 p-5 text-[#f4ebb4] h-screen sticky top-0">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <ul>
        <li className="mb-4">
          <Link to="/admin" className="hover:text-[#a0926c] flex items-center">
            <FaTachometerAlt className="mr-3" /> Dashboard
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/admin/add-products" className="hover:text-[#a0926c] flex items-center">
            <FaPlusCircle className="mr-3" /> Add Products
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/admin/products" className="hover:text-[#a0926c] flex items-center">
            <FaBox className="mr-3" /> All Products
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/admin/orders" className="hover:text-[#a0926c] flex items-center">
            <FaShoppingCart className="mr-3" /> All Orders
          </Link>
        </li>
        <li className="mb-4">
          <Link to="/admin/users" className="hover:text-[#a0926c] flex items-center">
            <FaUsers className="mr-3" /> All Users
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
