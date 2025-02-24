import React, { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const user = JSON.parse(localStorage.getItem("user")); // Get user from localStorage
      if (!user || !user._id) {
        setError("User not found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/api/order/user/${user._id}`);
        const ordersWithProducts = await Promise.all(
          response.data.orders.map(async (order) => {
            const updatedProducts = await Promise.all(
              order.products.map(async (product) => {
                const productResponse = await axios.get(`http://localhost:3000/api/products/${product.cartItem}`);
                return { ...product, productDetails: productResponse.data };
              })
            );
            return { ...order, products: updatedProducts };
          })
        );
        setOrders(ordersWithProducts);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/order/${orderId}`);
      setOrders(orders.filter(order => order._id !== orderId));
    } catch (err) {
      alert("Failed to cancel order. Try again later.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600 bg-red-100 px-4 py-2 rounded-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Orders</h2>
      {orders.length === 0 ? (
        <p className="text-gray-600 text-center bg-gray-100 py-4 rounded-md">
          No orders found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white shadow-md rounded-lg p-5 border border-gray-200">
              <h5 className="text-lg font-medium text-blue-600 mb-2">Order ID: {order._id}</h5>
              <p className="text-gray-700"><strong>Total Price:</strong> ₹{order.total_price}</p>
              <p className="text-gray-700"><strong>Payment Status:</strong> {order.payment_status}</p>
              <p className="text-gray-700"><strong>Payment Method:</strong> {order.payment_method}</p>

              <h6 className="text-gray-500 mt-4 font-medium">Delivery Address</h6>
              <p className="text-gray-600 text-sm">
                {order.address.street}, {order.address.city}, {order.address.state}, {order.address.pincode}
              </p>

              <h6 className="text-gray-500 mt-4 font-medium">Ordered Products</h6>
              <ul className="mt-2 space-y-3">
                {order.products.map((product, index) => (
                  <li key={index} className="flex items-center gap-4 bg-gray-100 p-3 rounded-md">
                    <img src={product.productDetails.imageUrl} alt={product.productDetails.name} className="w-16 h-16 object-cover rounded" />
                    <div>
                      <p className="text-gray-800 font-semibold">{product.productDetails.name}</p>
                      <p className="text-gray-600">Price: ₹{product.productDetails.price}</p>
                      <p className="text-gray-600">Quantity: {product.quantity}</p>
                    </div>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCancelOrder(order._id)}
                className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md w-full"
              >
                Cancel Order
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
