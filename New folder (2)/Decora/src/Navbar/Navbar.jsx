import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, ChevronDown } from "lucide-react";
import axios from "axios"; // Import axios

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // Check for logged-in user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  }, []);

  // Fetch cart count when user is available
  useEffect(() => {
    if (user?._id) {
      console.log("Fetching cart count for user ID:", user._id);
      fetchCartCount(user._id);
    }
  }, [user]); // Trigger when user changes

  // Function to fetch cart count
  const fetchCartCount = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/cart/${userId}`);
      console.log("Cart API Response:", response.data); // Debugging

      if (response.data && response.data.cartCount !== undefined) {
        setCartCount(response.data.cartCount);
      } else {
        setCartCount(0);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
      setCartCount(0);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setCartCount(0);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md py-3">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Left: Logo */}
        <Link to="/" className="text-2xl font-bold text-gray-800">
          Decora
        </Link>

        {/* Center: Search Bar */}
        <div className="flex flex-grow justify-center">
          <Link to="/search">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </Link>
        </div>

        {/* Right Side: User and Cart */}
        <div className="flex items-center space-x-4 relative">
          {/* Cart Icon with Badge */}
          <Link to="/cart" className="relative">
            <ShoppingCart className="w-6 h-6 text-gray-700 cursor-pointer" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* If Logged In - Show Profile Image & Dropdown */}
          {user ? (
            <div className="relative">
              <div
                className="flex items-center cursor-pointer space-x-2"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border"
                />
                <ChevronDown className="w-5 h-5 text-gray-600" />
              </div>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-2 z-50">
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  <Link to="/wishlist" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Wishlist
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            // If Not Logged In - Show Login & Signup Buttons
            <>
              <Link to="/login" className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100">
                Login
              </Link>
              <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
