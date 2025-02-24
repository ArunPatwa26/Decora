import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [userId, setUserId] = useState(null);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [transactionId, setTransactionId] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      console.log("Razorpay SDK Loaded");
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (location.state) {
      setCart(location.state.cart || []);
      setTotalPrice(location.state.totalPrice || 0);
      setUserId(location.state.userId || null);
    }
  }, [location.state]);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearCart = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/cart/clear/${userId}`);
      setCart([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const handleRazorpayPayment = async () => {
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded. Please check your internet connection.");
      return;
    }

    const options = {
      key: "rzp_test_LoIkTKPLTo0StT",
      amount: totalPrice * 100,
      currency: "INR",
      name: "My Shop",
      description: "Order Payment",
      handler: async (response) => {
        setTransactionId(response.razorpay_payment_id);
        handleOrder(response.razorpay_payment_id);
      },
      prefill: {
        name: "User Name",
        email: "user@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleOrder = async (paymentId = null) => {
    if (!address.street || !address.city || !address.state || !address.pincode) {
      alert("Please fill in all address fields");
      return;
    }
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }

    const orderData = {
      user_id: String(userId),
      cart: cart.map((item) => ({
        cartItem: String(item.cartItem?._id),
        quantity: Number(item.quantity),
      })),
      address: { ...address, pincode: String(address.pincode) },
      total_price: Number(totalPrice),
      payment_method: paymentMethod,
      transaction_id: paymentId,
    };

    try {
      await axios.post("http://localhost:3000/api/order/create", orderData);
      alert("Order placed successfully!");
      await handleClearCart();
      navigate("/orders");
    } catch (error) {
      alert(`Failed to place order: ${error.response?.data?.message || "Unknown error"}`);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row">
        
        {/* Delivery Address Section */}
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h3 className="text-center text-primary mb-3">Delivery Address</h3>
            <div className="mb-3">
              <label className="form-label">Street</label>
              <input
                type="text"
                className="form-control"
                name="street"
                value={address.street}
                onChange={handleAddressChange}
                required
              />
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-control"
                  name="city"
                  value={address.city}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">State</label>
                <input
                  type="text"
                  className="form-control"
                  name="state"
                  value={address.state}
                  onChange={handleAddressChange}
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Pincode</label>
              <input
                type="text"
                className="form-control"
                name="pincode"
                value={address.pincode}
                onChange={handleAddressChange}
                required
              />
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="col-md-6">
          <div className="card shadow p-4">
            <h3 className="text-center text-primary mb-3">Payment Method</h3>
            <select
              className="form-select mb-3"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">Select Payment Method</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="Online Payment">Online Payment</option>
            </select>

            <button
              className="btn btn-success w-100"
              onClick={paymentMethod === "Online Payment" ? handleRazorpayPayment : () => handleOrder(null)}
            >
              {paymentMethod === "Online Payment" ? "Pay Now" : "Place Order"}
            </button>
          </div>
        </div>
      </div>

      {/* Order Summary Section */}
      <div className="row mt-4">
        <div className="col-md-12">
          <div className="card shadow p-4">
            <h3 className="text-center text-primary mb-3">Order Summary</h3>
            {cart.length === 0 ? (
              <p className="text-center">No items in cart.</p>
            ) : (
              <>
                {cart.map((item, index) => (
                  <div key={index} className="d-flex justify-content-between mb-2">
                    <span>{item.cartItem?.name}</span>
                    <span>₹{item.cartItem?.price} x {item.quantity}</span>
                  </div>
                ))}
                <hr />
                <h5 className="text-end">Total: ₹{totalPrice}</h5>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
