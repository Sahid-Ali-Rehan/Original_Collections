import React, { useState, useEffect } from "react";
import { FaMale, FaFemale, FaChild, FaTshirt, FaShoePrints } from "react-icons/fa";

const categories = [
  { name: "Men's Clothing", items: 150, icon: <FaMale size={30} /> },
  { name: "Women's Clothing", items: 200, icon: <FaFemale size={30} /> },
  { name: "Kids' Wear", items: 120, icon: <FaChild size={30} /> },
  { name: "Accessories", items: 80, icon: <FaTshirt size={30} /> },
  { name: "Footwear", items: 100, icon: <FaShoePrints size={30} /> },
];

const AllCategories = () => {
  const [visible, setVisible] = useState(false);
  const [counts, setCounts] = useState(categories.map(() => 0));

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("categories-section");
      const rect = section.getBoundingClientRect();
      if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
        setVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (visible) {
      const incrementCounts = () => {
        setCounts((prev) =>
          prev.map((count, index) =>
            count < categories[index].items ? count + 1 : count
          )
        );
      };

      const interval = setInterval(incrementCounts, 20);
      return () => clearInterval(interval);
    }
  }, [visible]);

  return (
    <section id="categories-section" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold mb-4 text-primary">
            Explore Categories
          </h2>
          <p className="text-lg text-black">
            Explore our Popular Categories
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {categories.map((category, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-6 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 bg-secondary text-white border border-muted"
            >
              <div className="mb-4 p-4 rounded-full bg-primary text-white">
                {category.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">
                {category.name}
              </h3>
              <p className="text-primary">
                {counts[index]}+ Items
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllCategories;
