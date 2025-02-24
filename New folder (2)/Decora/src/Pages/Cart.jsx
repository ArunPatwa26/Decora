import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // Fetch userId from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const userId = parsedUser ? parsedUser._id : null;

    if (userId) {
      setUserId(userId);
      console.log("User ID:", userId);
    } else {
      console.error("User ID not found in localStorage");
    }
  }, []);

  // Fetch Cart Items
  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:3000/api/cart/${userId}`)
      .then((response) => {
        console.log("Cart API Response:", response.data);

        if (response.data.success && response.data.cart && response.data.cart.products) {
          setCart(response.data.cart.products);
        } else {
          setCart([]);
        }
      })
      .catch((error) => console.error("Error fetching cart:", error));
  }, [userId]);

  // Remove item from cart
  const removeFromCart = (itemId) => {
    if (!userId) return;

    axios
      .delete(`http://localhost:3000/api/cart/remove`, {
        data: { userId, itemId },
      })
      .then((response) => {
        console.log("Remove Response:", response.data);
        if (response.data.success) {
          setCart((prevCart) => prevCart.filter((item) => item._id !== itemId));
        }
      })
      .catch((error) => console.error("Error removing item:", error.response?.data || error));
  };

  // Calculate total price
  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.cartItem?.price || 0) * item.quantity,
    0
  );

  const proceedToOrder = () => {
    navigate("/order", { state: { cart, totalPrice, userId } });
  };

  // If cart is empty
  if (cart.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center text-2xl font-semibold text-gray-700">
          🛒 Your cart is empty!
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          🛒 Your Shopping Cart
        </h2>

        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex items-center bg-white p-4 rounded-lg shadow-md border"
            >
              <img
                src={item.cartItem?.imageUrl || "/placeholder.jpg"}
                alt={item.cartItem?.name || "Unknown Product"}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="ml-4 flex-1">
                <h3 className="text-xl font-semibold text-gray-800">
                  {item.cartItem?.name || "Unknown Product"}
                </h3>
                <p className="text-gray-600">
                  Price: ₹{item.cartItem?.price?.toFixed(2) || "N/A"}
                </p>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
              </div>

              <button
                onClick={() => removeFromCart(item._id)}
                className="ml-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                ❌ Remove
              </button>
            </div>
          ))}
        </div>

        {/* Total Price Section */}
        <div className="mt-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800">
            Total: ₹{totalPrice.toFixed(2)}
          </h3>
          <button
            onClick={proceedToOrder}
            className="mt-4 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition font-semibold text-lg"
          >
            ✅ Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
