import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaMobileAlt, FaPlug, FaLaptop, FaBatteryFull, FaApple, FaHeadphonesAlt, FaTools } from "react-icons/fa";

const categories = [
  { name: "মোবাইল ফোন চারজার", items: 120, icon: <FaPlug size={30} />, link: "/products?category=Adapters" },
  { name: "ল্যাপটপ চারজার", items: 80, icon: <FaLaptop size={30} />, link: "/products?category=Adapters" },
  { name: "এয়ার ফোন / হেড ফোন", items: 200, icon: <FaHeadphonesAlt size={30} />, link: "/products?category=Headphones" },
  { name: "পাওয়ার ব্যাংক", items: 100, icon: <FaBatteryFull size={30} />, link: "/products?category=PowerBank" },
  { name: "স্মার্ট ওয়াচ", items: 60, icon: <FaApple size={30} />, link: "/products?category=SmartWatch" },
  { name: "মোবাইল গ্যাজেট", items: 90, icon: <FaTools size={30} />, link: "/products?category=MobileGadgets" },
  { name: "মোবাইল ফোন", items: 150, icon: <FaMobileAlt size={30} />, link: "/products?category=SmartPhones" },
  { name: "গেমিং অ্যাক্সেসরিজ", items: 110, icon: <FaTools size={30} />, link: "/products?category=GamingAccessories" },
];

const AllCategories = () => {
  const [counts, setCounts] = useState(categories.map(() => 0));
  
  useEffect(() => {
    const incrementCounts = () => {
      setCounts((prev) =>
        prev.map((count, index) => (count < categories[index].items ? count + 1 : count))
      );
    };
    const interval = setInterval(incrementCounts, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="categories-section" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold mb-4 text-primary">আমাদের ক্যাটাগরি দেখুন</h2>
          <p className="text-lg text-black">জনপ্রিয় ক্যাটাগরিগুলো ব্রাউজ করুন</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <motion.a
              key={index}
              href={category.link}
              className="flex flex-col items-center justify-center p-6 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 bg-secondary text-white border border-muted cursor-pointer"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 p-4 rounded-full bg-primary text-white">{category.icon}</div>
              <h3 className="text-lg font-semibold mb-2 text-white">{category.name}</h3>
              <p className="text-white">{counts[index]}+ প্রোডাক্ট</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllCategories;
