import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt, FaPlus, FaMinus, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { useCart } from '../Context/CartContext'; // Import the context hook

export default function CartPage() {
  const navigate = useNavigate();
  // Use the context to get cart data and functions
  const { cart, loading, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const total = getCartTotal();

  const handleProceed = () => {
    // No need to save to storage, the context handles that
    navigate("/address");
  };

  const handleGoToShop = () => {
    navigate("/shop");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <svg className="animate-spin h-8 w-8 text-orange-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        <p className="mt-4 text-gray-500">Loading your cart...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <FaShoppingCart className="text-6xl text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
        <button
          onClick={handleGoToShop}
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
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6 font-medium"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">Your Cart</h1>
        <div className="divide-y divide-gray-200">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center gap-4 py-6"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg border"
              />
              <div className="flex-1 w-full">
                <h2 className="font-semibold text-lg text-gray-800">{item.name}</h2>
                <div className="text-sm text-gray-500 mb-2">{item.format}</div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-orange-600 text-lg">
                    ₹{item.price}
                  </span>
                  {item.originalPrice && (
                    <span className="text-gray-400 line-through text-sm">
                      ₹{item.originalPrice}
                    </span>
                  )}
                </div>
                <div className="flex items-center mt-3 gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                    aria-label="Decrease quantity"
                  >
                    <FaMinus />
                  </button>
                  <span className="px-3 py-1 border rounded text-gray-700 bg-gray-50">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                    aria-label="Increase quantity"
                  >
                    <FaPlus />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-4 p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600"
                    aria-label="Remove item"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
          <div className="text-lg font-semibold text-gray-800">
            Total: <span className="text-orange-600 font-bold">₹{total}</span>
          </div>
          <button
            onClick={handleProceed}
            className="w-full sm:w-auto px-8 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Processing...
              </span>
            ) : (
              "Proceed to Address"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};