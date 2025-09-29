import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAddresses } from "../Apis/auth";
import { useCart } from "../Context/CartContext";
import { createOrder } from "../Apis/product_api";
import { CreditCard, Banknote, QrCode, Smartphone, ChevronDown, CheckCircle2, Circle } from 'lucide-react';

const CardTypeIcons = {
  VISA: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1200px-Visa_Inc._logo.svg.png",
  MASTERCARD: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/1200px-MasterCard_Logo.svg.png",
  AMEX: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/American_Express_logo.svg/1200px-American_Express_logo.svg.png",
  DISCOVER: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Discover_Card_logo.svg/1200px-Discover_Card_logo.svg.png",
  RUPAY: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/RuPay-Logo.png/1200px-RuPay-Logo.png"
};



export default function CheckoutPage() {
  const { cart } = useCart();
  const [address, setAddress] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [addressLoading, setAddressLoading] = useState(true);
  const [addressError, setAddressError] = useState(null);
  const navigate = useNavigate();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('saved_card');
  const [useSavedCard, setUseSavedCard] = useState(true);

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
    setUseSavedCard(method === 'saved_card');
  };

  const paymentMethods = [
    { id: 'saved_card', label: 'VISA ending in 3681', icon: CardTypeIcons.VISA, nickname: 'Sweta Raj Patel' },
    { id: 'new_card', label: 'Credit or debit card', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'net_banking', label: 'Net Banking', icon: <Banknote className="w-5 h-5" /> },
    { id: 'upi_qr', label: 'Scan and Pay with UPI', icon: <QrCode className="w-5 h-5" /> },
    { id: 'upi_app', label: 'Other UPI Apps', icon: <Smartphone className="w-5 h-5" /> },
    { id: 'emi', label: 'EMI Unavailable', icon: null, disabled: true },
    { id: 'cod', label: 'Cash on Delivery/Pay on Delivery', icon: null },
  ];

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

  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState(null);

  const handleProceedOrder = async () => {
    if (!address || !address._id) {
      setOrderError("No address selected.");
      return;
    }
    if (!cart.length) {
      setOrderError("No items in cart.");
      return;
    }
    setOrderLoading(true);
    setOrderError(null);
    // Prepare order data
    const orderData = {
      shippingInfo: { address: address._id },
      orderItems: cart.map(item => ({
        name: item.name,
        product: item.id,
        quantity: item.quantity,
        price: item.price
      })),
      paymentInfo: { status: "Pending" },
      taxPrice: 0,
      shippingPrice: 0
    };
    const result = await createOrder(orderData);
    setOrderLoading(false);
    if (result.success) {
      navigate("/Order");
    } else {
      setOrderError(result.message || "Failed to place order.");
    }
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
                     <div className="flex-1 bg-white rounded-xl shadow-lg p-6 space-y-6">
          <div className="flex items-center space-x-2 pb-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Place Your Order</h2>
          </div>

          <div className="flex flex-col space-y-4">
            <h3 className="text-sm text-gray-500 uppercase font-semibold">Credit & Debit Cards</h3>
            
            {/* Saved Card Section */}
            <div
              className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-200 ${selectedPaymentMethod === 'saved_card' ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-200'} border-2`}
              onClick={() => handlePaymentMethodChange('saved_card')}
            >
              <div className="flex items-center space-x-4">
                {selectedPaymentMethod === 'saved_card' ? <CheckCircle2 className="w-6 h-6 text-blue-600" /> : <Circle className="w-6 h-6 text-gray-400" />}
                {CardTypeIcons.VISA && (
                  <img src={CardTypeIcons.VISA} alt="VISA" className="h-6 w-auto" />
                )}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-700">VISA ending in 3681</span>
                    <span className="text-sm font-light text-gray-500">VISA</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Nickname</p>
                <p className="font-medium text-gray-800">Sweta Raj Patel</p>
              </div>
            </div>

            {/* New Card Section */}
            <h3 className="text-sm text-gray-500 uppercase font-semibold pt-4">Another payment method</h3>
            <div
              className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200 ${selectedPaymentMethod === 'new_card' ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-200'} border-2`}
              onClick={() => handlePaymentMethodChange('new_card')}
            >
              <div className="flex items-center space-x-4">
                {selectedPaymentMethod === 'new_card' ? <CheckCircle2 className="w-6 h-6 text-blue-600" /> : <Circle className="w-6 h-6 text-gray-400" />}
                <CreditCard className="w-6 h-6 text-gray-600" />
                <span className="font-medium text-gray-700">Credit or debit card</span>
              </div>
            </div>
            {selectedPaymentMethod === 'new_card' && (
              <div className="p-4 bg-white rounded-b-xl border border-t-0 border-gray-200">
                <div className="flex space-x-2 mb-4">
                  <img src={CardTypeIcons.VISA} alt="VISA" className="h-5" />
                  <img src={CardTypeIcons.MASTERCARD} alt="MasterCard" className="h-5" />
                  <img src={CardTypeIcons.AMEX} alt="Amex" className="h-5" />
                  <img src={CardTypeIcons.RUPAY} alt="RuPay" className="h-5" />
                  <img src={CardTypeIcons.DISCOVER} alt="Discover" className="h-5" />
                </div>
                {/* Form to be added here */}
              </div>
            )}
            
            {/* Other Payment Methods */}
            {paymentMethods.filter(m => m.id !== 'saved_card' && m.id !== 'new_card').map(method => (
              <div
                key={method.id}
                className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200 ${selectedPaymentMethod === method.id ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-200'} border-2 ${method.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !method.disabled && handlePaymentMethodChange(method.id)}
              >
                <div className="flex items-center space-x-4">
                  {selectedPaymentMethod === method.id ? <CheckCircle2 className="w-6 h-6 text-blue-600" /> : <Circle className="w-6 h-6 text-gray-400" />}
                  {method.icon && (
                    <div className="text-gray-600">{method.icon}</div>
                  )}
                  <div className="flex items-center space-x-1">
                    <span className={`font-medium ${method.disabled ? 'text-gray-400' : 'text-gray-700'}`}>{method.label}</span>
                    {method.id === 'net_banking' && <ChevronDown className="w-4 h-4 text-gray-500" />}
                    {method.id === 'emi' && <span className="text-blue-500 text-sm font-medium">Why?</span>}
                    {method.id === 'cod' && <span className="text-sm text-gray-500">Cash, UPI and Cards accepted. <a href="#" className="text-blue-500">Know more.</a></span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
            className={`w-full sm:w-auto px-8 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition ${orderLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={orderLoading}
          >
            {orderLoading ? "Placing Order..." : "Proceed to Order"}
          </button>
          {orderError && (
            <div className="text-red-600 mt-2 text-sm">{orderError}</div>
          )}
        </div>
      </div>
   
    </div>
  );
}
