import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    image: null,
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image change
  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, address, image } = formData;

    if (!name || !email || !password || !address || !image) {
      toast.error("❌ All fields are required!");
      return;
    }

    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("password", password);
    data.append("address", address);
    data.append("profilePicture", image);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/register",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("API Response:", response.data);

      if (response.data.success === true) {
        toast.success("✅ Sign Up Successful!");

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        toast.error(response.data.message || "❌ Registration failed!");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      toast.error(error.response?.data?.message || "❌ Signup failed!");
    }
  };

  return (
    <motion.div
      className="min-h-screen flex justify-center items-center bg-gray-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="bg-white shadow-lg rounded-2xl p-8 w-96 transform hover:scale-105 transition duration-300"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Sign Up
        </h2>

        {/* Toast Notifications */}
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 text-sm">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300 transition"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300 transition"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300 transition"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 text-sm">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300 transition"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-600 text-sm">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border rounded-lg transition"
              required
            />
          </div>

          <motion.button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition transform hover:scale-105"
            whileHover={{ scale: 1.05 }}
          >
            Sign Up
          </motion.button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default SignUp;
