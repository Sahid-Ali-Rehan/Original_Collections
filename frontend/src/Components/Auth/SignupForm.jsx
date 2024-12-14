import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AiOutlineMail, AiOutlineUser, AiOutlinePhone, AiOutlineLock } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phonenumber: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false); // state to toggle password visibility
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Password strength check
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error("Password must be at least 8 characters long, with uppercase, lowercase, number, and special character.");
      return;
    }
  
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
  
    try {
      const { data } = await axios.post("https://ruhana.onrender.com/api/auth/signup", formData);
      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#f4ebb4]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-center text-[#8d5c51] mb-4">Sign Up</h2>
        <div className="flex items-center mb-4 border-b border-[#7b7c4d]">
          <AiOutlineUser className="text-2xl text-[#7b7c4d] mr-2" />
          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            value={formData.fullname}
            onChange={handleChange}
            className="w-full focus:outline-none text-[#7d835f]"
            required
          />
        </div>
        <div className="flex items-center mb-4 border-b border-[#7b7c4d]">
          <AiOutlineMail className="text-2xl text-[#7b7c4d] mr-2" />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full focus:outline-none text-[#7d835f]"
            required
          />
        </div>
        <div className="flex items-center mb-4 border-b border-[#7b7c4d]">
          <AiOutlinePhone className="text-2xl text-[#7b7c4d] mr-2" />
          <input
            type="text"
            name="phonenumber"
            placeholder="Phone Number"
            value={formData.phonenumber}
            onChange={handleChange}
            className="w-full focus:outline-none text-[#7d835f]"
            required
          />
        </div>
        <div className="flex items-center mb-4 border-b border-[#7b7c4d]">
          <AiOutlineLock className="text-2xl text-[#7b7c4d] mr-2" />
          <input
            type={showPassword ? "text" : "password"} // toggle password visibility
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full focus:outline-none text-[#7d835f]"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)} // toggle showPassword state
            className="ml-2 text-[#996a6c]"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <div className="flex items-center mb-6 border-b border-[#7b7c4d]">
          <AiOutlineLock className="text-2xl text-[#7b7c4d] mr-2" />
          <input
            type={showPassword ? "text" : "password"} // toggle confirm password visibility
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full focus:outline-none text-[#7d835f]"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#8d5c51] text-white py-2 rounded-md hover:bg-[#7b7c4d] transition-all"
        >
          Sign Up
        </button>
        <p className="text-center text-[#7b7c4d] mt-4">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-[#8d5c51] font-semibold"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
