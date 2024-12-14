import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    images: [''],
    sizeChart: '',
    availableColors: [],
    availableSizes: [],
    stock: 0,
    price: 0,
    discount: 0,
    productCode: '',
    category: '',
    subCategory: '',
    isBestSeller: false,
  });

  // Helper function to capitalize first letter and format array
  const formatTags = (input) => {
    return input
      .split(',')
      .map((item) => item.trim())  // Remove extra spaces
      .map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()); // Capitalize
  };

  // Handler for text inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handler for dynamic images
  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData({ ...formData, images: updatedImages });
  };

  const addImageField = () => {
    if (formData.images.length < 5) {
      setFormData({ ...formData, images: [...formData.images, ''] });
    } else {
      toast.error('You can add a maximum of 5 images.');
    }
  };

  const removeImageField = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };

  // Handle the colors and sizes inputs
  const handleColorsChange = (e) => {
    const formattedColors = formatTags(e.target.value);
    setFormData({ ...formData, availableColors: formattedColors });
  };

  const handleSizesChange = (e) => {
    const formattedSizes = formatTags(e.target.value);
    setFormData({ ...formData, availableSizes: formattedSizes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      discount: Number(formData.discount),
    };
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/products/add', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(response.data.message);
      setFormData({
        productName: '',
        description: '',
        images: [''],
        sizeChart: '',
        availableColors: [],
        availableSizes: [],
        stock: 0,
        price: 0,
        discount: 0,
      });
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
      toast.error('Something went wrong.');
    }
  };
  
  

  return (
    <div className="p-8 bg-[#f4ebb4] min-h-screen">
      <h2 className="text-3xl font-bold text-[#8d5c51] mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
  <div className="grid grid-cols-2 gap-6">
    <input
      type="text"
      name="productName"
      placeholder="Product Name"
      value={formData.productName}
      onChange={handleChange}
      className="p-3 border rounded-lg w-full text-[#7b7c4d] bg-[#faeed5] placeholder:text-[#7b7c4d] focus:outline-none focus:ring-2 focus:ring-[#a0926c]"
      required
    />
    <input
      type="text"
      name="productCode"
      placeholder="Product Code"
      value={formData.productCode}
      onChange={handleChange}
      className="p-3 border rounded-lg w-full text-[#7b7c4d] bg-[#faeed5] placeholder:text-[#7b7c4d] focus:outline-none focus:ring-2 focus:ring-[#a0926c]"
      required
    />
    <textarea
      name="description"
      placeholder="Description"
      value={formData.description}
      onChange={handleChange}
      className="p-3 border rounded-lg w-full col-span-2 text-[#7b7c4d] bg-[#faeed5] placeholder:text-[#7b7c4d] focus:outline-none focus:ring-2 focus:ring-[#a0926c]"
      rows="3"
      required
    />
    <input
      type="number"
      name="price"
      placeholder="Price"
    //   value={formData.price}
      onChange={handleChange}
      className="p-3 border rounded-lg w-full text-[#7b7c4d] bg-[#faeed5] placeholder:text-[#7b7c4d] focus:outline-none focus:ring-2 focus:ring-[#a0926c]"
      required
    />
    <input
      type="number"
      name="discount"
      placeholder="Discount (%)"
    //   value={formData.discount}
      onChange={handleChange}
      className="p-3 border rounded-lg w-full text-[#7b7c4d] bg-[#faeed5] placeholder:text-[#7b7c4d] focus:outline-none focus:ring-2 focus:ring-[#a0926c]"
    />
    <input
      type="number"
      name="stock"
      placeholder="Stock"
    //   value={formData.stock}
      onChange={handleChange}
      className="p-3 border rounded-lg w-full text-[#7b7c4d] bg-[#faeed5] placeholder:text-[#7b7c4d] focus:outline-none focus:ring-2 focus:ring-[#a0926c]"
      required
    />
    <input
      type="text"
      name="category"
      placeholder="Category"
      value={formData.category}
      onChange={handleChange}
      className="p-3 border rounded-lg w-full text-[#7b7c4d] bg-[#faeed5] placeholder:text-[#7b7c4d] focus:outline-none focus:ring-2 focus:ring-[#a0926c]"
      required
    />
    <input
      type="text"
      name="subCategory"
      placeholder="Sub-Category"
      value={formData.subCategory}
      onChange={handleChange}
      className="p-3 border rounded-lg w-full text-[#7b7c4d] bg-[#faeed5] placeholder:text-[#7b7c4d] focus:outline-none focus:ring-2 focus:ring-[#a0926c]"
    />
    <input
      type="text"
      name="sizeChart"
      placeholder="Size Chart URL (optional)"
      value={formData.sizeChart}
      onChange={handleChange}
      className="p-3 border rounded-lg w-full col-span-2 text-[#7b7c4d] bg-[#faeed5] placeholder:text-[#7b7c4d] focus:outline-none focus:ring-2 focus:ring-[#a0926c]"
    />
  </div>

  {/* Dynamic Image URLs */}
  <div className="mt-4">
    <label className="font-semibold block mb-2 text-[#8d5c51]">Product Images (1-5)</label>
    {formData.images.map((image, index) => (
      <div key={index} className="flex items-center gap-2 mb-2">
        <input
          type="url"
          placeholder={`Image URL ${index + 1}`}
          value={image}
          onChange={(e) => handleImageChange(index, e.target.value)}
          className="p-2 border rounded-lg flex-1 text-[#7b7c4d] bg-[#faeed5] placeholder:text-[#7b7c4d] focus:outline-none focus:ring-2 focus:ring-[#a0926c]"
        />
        {formData.images.length > 1 && (
          <button
            type="button"
            onClick={() => removeImageField(index)}
            className="bg-[#996a6c] text-white px-3 py-1 rounded-lg"
          >
            Remove
          </button>
        )}
      </div>
    ))}
    {formData.images.length < 5 && (
      <button
        type="button"
        onClick={addImageField}
        className="bg-[#7d835f] text-white px-4 py-2 rounded-lg"
      >
        Add Image
      </button>
    )}
  </div>

  {/* Color and Size Input */}
  <div className="mt-4 grid grid-cols-2 gap-6">
    <div>
      <label className="font-semibold block mb-2 text-[#8d5c51]">Available Colors</label>
      <input
        type="text"
        placeholder="Enter colors (comma separated)"
        value={formData.availableColors.join(', ')}
        onChange={handleColorsChange}
        className="p-2 border rounded-lg w-full text-[#7b7c4d] bg-[#faeed5] placeholder:text-[#7b7c4d] focus:outline-none focus:ring-2 focus:ring-[#a0926c]"
      />
    </div>
    <div>
      <label className="font-semibold block mb-2 text-[#8d5c51]">Available Sizes</label>
      <input
        type="text"
        placeholder="Enter sizes (comma separated)"
        value={formData.availableSizes.join(', ')}
        onChange={handleSizesChange}
        className="p-2 border rounded-lg w-full text-[#7b7c4d] bg-[#faeed5] placeholder:text-[#7b7c4d] focus:outline-none focus:ring-2 focus:ring-[#a0926c]"
      />
    </div>
  </div>

  {/* Best Seller */}
  <div className="mt-4 flex items-center gap-2">
    <input
      type="checkbox"
      name="isBestSeller"
      checked={formData.isBestSeller}
      onChange={handleChange}
      className="h-5 w-5"
    />
    <label htmlFor="isBestSeller" className="text-[#8d5c51]">Best Seller</label>
  </div>

  <div className="mt-6">
    <button type="submit" className="bg-[#a0926c] text-white px-6 py-2 rounded-lg hover:bg-[#7b7c4d]">
      Add Product
    </button>
  </div>
</form>

    </div>
  );
};

export default AddProduct;
