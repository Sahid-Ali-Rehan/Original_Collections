import React from "react";
import { FaMale, FaFemale, FaChild, FaTshirt, FaShoePrints } from "react-icons/fa"; // Importing icons

const categories = [
  { name: "Men's Clothing", items: "150+ Items", icon: <FaMale size={30} /> },
  { name: "Women's Clothing", items: "200+ Items", icon: <FaFemale size={30} /> },
  { name: "Kids' Wear", items: "120+ Items", icon: <FaChild size={30} /> },
  { name: "Accessories", items: "80+ Items", icon: <FaTshirt size={30} /> },
  { name: "Footwear", items: "100+ Items", icon: <FaShoePrints size={30} /> },
];

const AllCategories = () => {
  return (
    <section
      className="py-16"
      style={{ backgroundColor: "#faeed5" }} // Main background
    >
      <div className="container mx-auto px-4">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h2
            className="text-4xl font-extrabold mb-2"
            style={{ color: "#8d5c51" }} // Main title color
          >
            Explore Categories
          </h2>
          <p
            className="text-lg"
            style={{ color: "#7b7c4d" }} // Subtitle color
          >
            Explore our Popular Categories
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {categories.map((category, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-6 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
              style={{
                backgroundColor: "#f4ebb4", // Card background
                border: "1px solid #ceba98", // Border color
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)", // Subtle shadow
              }}
            >
              <div
                className="mb-4 p-4 rounded-full"
                style={{
                  backgroundColor: "#afc48a", // Icon background
                  color: "#7d835f", // Icon color
                }}
              >
                {category.icon}
              </div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: "#8d5c51" }} // Title color
              >
                {category.name}
              </h3>
              <p style={{ color: "#7d835f" }}>{category.items}</p>
            </div>
          ))}
        </div>

        {/* CTA Button
        <div className="flex justify-center mt-12">
          <button
            className="px-8 py-3 rounded-lg font-semibold shadow-md transition-all duration-300"
            style={{
              backgroundColor: "#996a6c", // Button background
              color: "#fff", // Button text
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Button shadow
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#7b7c4d")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#996a6c")
            }
          >
            All Categories
          </button>
        </div> */}
      </div>
    </section>
  );
};

export default AllCategories;
