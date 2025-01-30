import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import featured from '/Featured/Featured.jpg';

const FeaturedProduct = () => {
  return (
    <section
      className="py-16"
      style={{ backgroundColor: "#FFFFFF" }} // Set background to white (using the theme color)
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
          {/* Product Image */}
          <div className="flex justify-center">
            <img
              src="/Featured/Featured.jpg" // Replace with product image URL
              alt="Featured Product"
              className="rounded-lg shadow-lg"
              style={{
                border: "4px solid #F68C1F", // Use muted color for border
                backgroundColor: "#F4EBB4", // Matches the color palette
              }}
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-center">
            <h2
              className="text-3xl font-bold mb-4"
              style={{ color: "#F68C1F" }} // Use your custom color for title
            >
              Handcrafted Rose Ribbon Vase
            </h2>
            <p
              className="text-md mb-6"
              style={{ color: "#56c5dc" }} // Use muted color for subtitle
            >
              Add a touch of elegance to your space with this beautifully handcrafted vase, wrapped in vibrant multicolor yarn and adorned with delicate pink fabric roses. Perfect as a decorative centerpiece or a charming gift for loved ones. Durable and lightweight, this vase effortlessly blends style and utility.
            </p>
            <div className="flex items-center mb-6">
              <p
                className="text-3xl font-bold mr-4"
                style={{ color: "#F68C1F" }} // Use muted color for price
              >
                ৳1299.00
              </p>
              <span
                className="text-sm line-through"
                style={{ color: "#56c5dc" }} // Use muted color for discount
              >
                ৳2000.00
              </span>
            </div>
            {/* Add to Cart Button */}
            <button
              className="flex items-center px-6 py-3 rounded-lg shadow-lg transition-all duration-300"
              style={{
                backgroundColor: "#F68C1F", // Button background color (primary theme color)
                color: "#fff", // Button text color
                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)", // Button shadow
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#56c5dc") // Hover effect
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#F68C1F")
              }
            >
              <FaShoppingCart className="mr-2" />
              View Products
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProduct;
