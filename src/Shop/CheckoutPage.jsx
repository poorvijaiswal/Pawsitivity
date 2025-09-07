import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAddresses } from "../Apis/auth";
import { useCart } from "../Context/CartContext";

export default function CheckoutPage() {
  const { cart } = useCart();
  const [address, setAddress] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [addressLoading, setAddressLoading] = useState(true);
  const [addressError, setAddressError] = useState(null);
  const navigate = useNavigate();

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
      });
    } else {
      setAddress(null);
      setAddressError("User not logged in.");
      setAddressLoading(false);
    }
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleProceedOrder = () => {
    // Pass address and cart to order page (or order API)
    navigate("/order", { state: { address, cart, total } });
  };

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
            className="w-full sm:w-auto px-8 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition"
          >
            Proceed to Order
          </button>
        </div>
      </div>
    </div>
  );
}
