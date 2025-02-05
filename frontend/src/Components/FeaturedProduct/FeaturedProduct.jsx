import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import featured from '/Featured/Featured.png';

const FeaturedProduct = () => {
  return (
    <section
      className="py-16"
      style={{ backgroundColor: "#FFFFFF" }} // পটভূমির রঙ সাদা নির্ধারণ করা হয়েছে
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
          {/* পণ্যের ছবি */}
          <div className="flex justify-center">
            <img
              src="/Featured/Featured.png" // পণ্যের ছবির URL
              alt="বিশেষ পণ্য"
              className="rounded-lg shadow-lg"
              style={{
                border: "4px solid #F68C1F", // বর্ডারের রঙ
                backgroundColor: "#F4EBB4", // ব্যাকগ্রাউন্ডের রঙ
              }}
            />
          </div>

          {/* পণ্যের বিবরণ */}
          <div className="flex flex-col justify-center">
            <h2
              className="text-3xl font-bold mb-4"
              style={{ color: "#F68C1F" }} // শিরোনামের রঙ
            >
              অপ্পো সুপারভুক চার্জার ৬৫ওয়াট
            </h2>
            <p
              className="text-md mb-6"
              style={{ color: "#56c5dc" }} // উপশিরোনামের রঙ
            >
              অপ্পো সুপারভুক ৬৫ওয়াট চার্জারের সাথে দ্রুত চার্জিং অভিজ্ঞতা নিন। এটি উন্নত নিরাপত্তা বৈশিষ্ট্য সহ ডিজাইন করা হয়েছে, যা অতিরিক্ত চার্জিং, অতিরিক্ত গরম হওয়া এবং শর্ট সার্কিট থেকে সুরক্ষা প্রদান করে। কমপ্যাক্ট ডিজাইনের কারণে এটি বহন করাও সহজ। অপ্পো স্মার্টফোন এবং বিভিন্ন ইউএসবি টাইপ-সি ডিভাইসের সাথে সামঞ্জস্যপূর্ণ।
            </p>
            <div className="flex items-center mb-6">
              <p
                className="text-3xl font-bold mr-4"
                style={{ color: "#F68C1F" }} // দামের রঙ
              >
                ৳১২৯৯.০০
              </p>
              <span
                className="text-sm line-through"
                style={{ color: "#56c5dc" }} // ডিসকাউন্টকৃত মূল্যের রঙ
              >
                ৳১৫৪৯.০০
              </span>
            </div>
            {/* কার্টে যোগ করার বোতাম */}
            <button
              className="flex items-center px-6 py-3 rounded-lg shadow-lg transition-all duration-300"
              style={{
                backgroundColor: "#F68C1F", // বোতামের ব্যাকগ্রাউন্ড রঙ
                color: "#fff", // বোতামের টেক্সট রঙ
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)", // বোতামের ছায়া
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#56c5dc") // হোভার এফেক্ট
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#F68C1F")
              }
            >
              <FaShoppingCart className="mr-2" />
              পণ্য দেখুন
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProduct;
