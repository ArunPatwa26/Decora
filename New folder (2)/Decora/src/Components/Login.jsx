import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      user: JSON.parse(localStorage.getItem("user")) || null,
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;

    try {
      const response = await axios.post("http://localhost:3000/api/user/login", {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data));
        this.setState({ user: response.data });
        toast.success("✅ Login successful!");
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Invalid email or password");
    }
  };

  render() {
    return (
      <motion.div
        className="min-h-screen flex justify-center items-center bg-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

        {!this.state.user ? (
          <motion.div
            className="bg-white shadow-xl rounded-2xl p-8 w-96"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
              Sign In
            </h2>
            <form onSubmit={this.handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-600 text-sm">Email</label>
                <input
                  type="email"
                  name="email"
                  value={this.state.email}
                  onChange={this.handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-600 text-sm">Password</label>
                <input
                  type="password"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300 transition"
                  required
                />
              </div>
              <motion.button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
              >
                Login
              </motion.button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-4">
              Don't have an account? {" "}
              <Link to="/signup" className="text-blue-500 hover:underline">
                Sign up
              </Link>
            </p>
          </motion.div>
        ) : (
          <p className="text-center text-gray-700 mt-6">
            You're already logged in.
          </p>
        )}
      </motion.div>
    );
  }
}
