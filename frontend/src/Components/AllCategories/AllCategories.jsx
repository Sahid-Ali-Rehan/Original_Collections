import React, { useState, useEffect } from "react";
import { FaMobileAlt, FaPlug, FaLaptop, FaBatteryFull, FaApple, FaHeadphonesAlt, FaLink, FaGamepad } from "react-icons/fa";

const categories = [
  { name: "Mobile Phones", items: 150, icon: <FaMobileAlt size={30} />, link: "/products?category=MobilePhones" },
  { name: "Mobile Charging Adapter", items: 120, icon: <FaPlug size={30} />, link: "/products?category=Adapters" },
  { name: "Laptop Charging Adapter", items: 80, icon: <FaLaptop size={30} />, link: "/products?category=Adapters" },
  { name: "Power Bank", items: 100, icon: <FaBatteryFull size={30} />, link: "/products?category=PowerBank" },
  { name: "Smart Watch", items: 60, icon: <FaApple size={30} />, link: "/products?category=SmartWatch" },
  { name: "Headphone / Earphone", items: 200, icon: <FaHeadphonesAlt size={30} />, link: "/products?category=Headphones" },
  { name: "Cables", items: 180, icon: <FaLink size={30} />, link: "/products?category=Cables" },
  { name: "Gaming Accessories", items: 90, icon: <FaGamepad size={30} />, link: "/products?category=GamingAccessories" },
];

const AllCategories = () => {
  const [visible, setVisible] = useState(false);
  const [counts, setCounts] = useState(categories.map(() => 0));

  // Function to check if section is in view
  const handleScroll = () => {
    const section = document.getElementById("categories-section");
    if (!section) return;
    
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight - 100 && rect.bottom >= 0) {
      setVisible(true);
    }
  };

  useEffect(() => {
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

      const interval = setInterval(incrementCounts, 30); // Slow down counting effect
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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
              <p className="text-white">
                {counts[index]}+ Items
              </p>
              <a
                href={category.link}
                className="mt-4 text-white underline"
              >
                View Products
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllCategories;
