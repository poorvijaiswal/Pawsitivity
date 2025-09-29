// src/pages/CheckoutPage.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAddresses } from "../Apis/auth";
import { useCart } from "../Context/CartContext";
import { createOrder as createAppOrder } from "../Apis/product_api";

// Razorpay script loader
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const { cart } = useCart();
  const [address, setAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(true);
  const [addressError, setAddressError] = useState(null);
  const navigate = useNavigate();

  // Local UI states
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState(null);

  useEffect(() => {
    const userId = JSON.parse(localStorage.getItem("user"))?._id;
    if (userId) {
      getAddresses(userId).then((result) => {
        if (result.success && result.data.addresses && result.data.addresses.length > 0) {
          setAddress(result.data.addresses[result.data.addresses.length - 1]);
          setAddressError(null);
        } else {
          setAddress(null);
          setAddressError("No address found.");
        }
        setAddressLoading(false);
      }).catch(err => {
        setAddress(null);
        setAddressError("Failed to load addresses.");
        setAddressLoading(false);
      });
    } else {
      setAddress(null);
      setAddressError("User not logged in.");
      setAddressLoading(false);
    }
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Build order items payload for your app DB
  const buildAppOrderPayload = (paymentInfo = {}) => ({
    shippingInfo: { address: address?._id },
    orderItems: cart.map(item => ({
      name: item.name,
      product: item.id,
      quantity: item.quantity,
      price: item.price
    })),
    paymentInfo, // e.g. { status: "Paid", method: "Razorpay", razorpay_payment_id: "..."}
    taxPrice: 0,
    shippingPrice: 0,
    totalPrice: total
  });

  // Main proceed: single button that handles both Magic Checkout (online + COD)
  const handleProceedOrder = async () => {
    setOrderError(null);

    if (!address || !address._id) {
      setOrderError("No address selected.");
      return;
    }
    if (!cart.length) {
      setOrderError("No items in cart.");
      return;
    }

    setOrderLoading(true);

    try {
      // Load Razorpay script first
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK. Please check your internet connection.');
      }

      // 1) Create Razorpay Order (server-side) with better error handling
      const backendCreateOrderUrl = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/create-order`;
      
      const rzResp = await axios.post(backendCreateOrderUrl, { 
        amount: total,
        currency: 'INR',
        receipt: `order_${Date.now()}`,
        notes: {
          userId: JSON.parse(localStorage.getItem("user"))?._id,
          items: cart.length
        }
      }, {
        timeout: 10000, // 10 second timeout
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: false
      });

      const rzOrder = rzResp.data;

      if (!rzOrder || !rzOrder.id) {
        throw new Error("Failed to create Razorpay order.");
      }

      // 2) Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        order_id: rzOrder.id,
        amount: rzOrder.amount,
        currency: rzOrder.currency || "INR",
        name: "Pawsitivity",
        description: "Your order payment",
        prefill: {
          name: address.fullName || "",
          email: address.email || "",
          contact: address.phoneNumber || "",
        },
        theme: { color: "#EF6C00" },

        // Handler called on successful payment
        handler: async function (response) {
          try {
            // Verify payment signature with backend
            if (response && response.razorpay_payment_id && response.razorpay_order_id && response.razorpay_signature) {
              const verifyUrl = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/verify-payment`;
              const verifyResp = await axios.post(verifyUrl, {
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature
              });

              if (verifyResp.data && verifyResp.data.status === "success") {
                // Create order in app database
                const appOrderPayload = buildAppOrderPayload({
                  status: "Paid",
                  method: "Razorpay",
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                });

                const appCreateResp = await createAppOrder(appOrderPayload);
                if (appCreateResp.success) {
                  setOrderLoading(false);
                  navigate("/Order");
                } else {
                  throw new Error(appCreateResp.message || "Failed to save order in database.");
                }
              } else {
                throw new Error("Payment verification failed.");
              }
            } else {
              throw new Error("Invalid payment response received.");
            }
          } catch (err) {
            console.error("Payment handler error:", err);
            setOrderError(err.message || "Payment processing failed.");
            setOrderLoading(false);
          }
        },

        modal: {
          ondismiss: function () {
            setOrderLoading(false);
          }
        }
      };

      // Create and open Razorpay checkout
      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function (response) {
        console.error("Payment failed:", response.error);
        setOrderError(`Payment failed: ${response.error.description || 'Please try again.'}`);
        setOrderLoading(false);
      });

      rzp.open();

    } catch (err) {
      console.error("Checkout error:", err);
      
      let errorMessage = "Failed to start checkout.";
      
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        errorMessage = "Request timeout. Please check your internet connection and try again.";
      } else if (err.code === 'NETWORK_ERROR' || err.message.includes('Network Error')) {
        errorMessage = "Network error. Please check if the server is running and try again.";
      } else if (err.response?.status === 404) {
        errorMessage = "Server endpoint not found. Please ensure the backend server is running on the correct port.";
      } else if (err.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setOrderError(errorMessage);
      setOrderLoading(false);
    }
  };

  // QUICK GUARD: no items in cart
  if (!cart.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <h2 className="text-2xl font-bold text-gray-700 mb-2">No items in cart</h2>
        <button
          onClick={() => navigate("/shop")}
          className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition"
        >
          Go to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 sm:px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-4 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">Checkout</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Address */}
          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Shipping Address</h2>
            {addressLoading ? (
              <div className="text-gray-500">Loading address...</div>
            ) : address ? (
              <div className="bg-gray-50 rounded-lg p-4 text-gray-700 text-sm">
                <div><span className="font-semibold">Name:</span> {address.fullName}</div>
                <div><span className="font-semibold">Phone:</span> {address.phoneNumber}</div>
                <div><span className="font-semibold">Email:</span> {address.email}</div>
                <div><span className="font-semibold">Address:</span> {address.street}{address.landmark ? `, ${address.landmark}` : ""}</div>
                <div>
                  <span className="font-semibold">City/State/Pincode:</span> {address.city}, {address.state} - {address.pinCode}
                </div>
                <div><span className="font-semibold">Country:</span> {address.country}</div>
                {address.company && <div><span className="font-semibold">Company:</span> {address.company}</div>}
                {address.deliveryInstructions && <div><span className="font-semibold">Instructions:</span> {address.deliveryInstructions}</div>}
              </div>
            ) : (
              <div className="text-red-600">{addressError || "No address found."}</div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <h2 className="text-lg font-semibold mb-2 text-gray-800">Order Summary</h2>
            <div className="divide-y divide-gray-200">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center py-4 gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded border"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.format}</div>
                    <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-semibold text-orange-600">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-6">
              <span className="font-semibold text-gray-800">Total</span>
              <span className="text-xl font-bold text-orange-600">₹{total}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end items-center mt-8 gap-4">
          <button
            onClick={handleProceedOrder}
            className={`w-full sm:w-auto px-8 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition ${orderLoading || !address ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={orderLoading || !address}
          >
            {orderLoading ? "Processing..." : "Proceed to Payment"}
          </button>
        </div>

        {orderError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mt-4">
            <strong>Error:</strong> {orderError}
          </div>
        )}
      </div>
    </div>
  );
}
