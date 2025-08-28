import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddressPage() {
  const [address, setAddress] = useState({
    fullName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    company: "",
    deliveryInstructions: "",
    billingSameAsShipping: true,
    billingAddress: {}
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!address.fullName.trim()) errs.fullName = "Full name is required.";
    if (!address.email.trim() || !/\S+@\S+\.\S+/.test(address.email)) errs.email = "Valid email is required.";
    if (!/^[6-9]\d{9}$/.test(address.phone)) errs.phone = "Valid 10-digit phone is required.";
    if (!address.address1.trim()) errs.address1 = "Address is required.";
    if (!address.city.trim()) errs.city = "City is required.";
    if (!address.state.trim()) errs.state = "State is required.";
    if (!address.postalCode.trim() || !/^\d{5,6}$/.test(address.postalCode)) errs.postalCode = "Valid postal code is required.";
    if (!address.country) errs.country = "Country is required.";
    if (!address.billingSameAsShipping) {
      const b = address.billingAddress;
      if (!b.address1) errs.billingAddress = "Billing address required";
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "billingSameAsShipping") {
      setAddress({ ...address, billingSameAsShipping: checked });
    } else {
      setAddress({ ...address, [name]: value });
    }
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    const finalAddress = { shipping: address };
    if (!address.billingSameAsShipping) {
      finalAddress.billing = address.billingAddress;
    }
    localStorage.setItem("checkout_address", JSON.stringify(finalAddress));
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center px-2 py-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-orange-200 p-0 flex flex-col"
        style={{
          maxHeight: "calc(100vh - 32px)",
          overflowY: "auto",
          marginTop: "16px",
          marginBottom: "16px"
        }}
      >
        {/* Header */}
        <div className="bg-white rounded-t-2xl px-8 py-6 flex items-center justify-between border-b border-orange-200 sticky top-0 z-10">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
            <span className="hidden sm:inline">Back</span>
          </button>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 text-center w-full -ml-8 sm:-ml-12">
            Address
          </h1>
          <span className="w-8" />
        </div>
        {/* Form Body */}
        <div className="px-8 py-10 sm:px-12 flex-1">
          {/* Full Name and Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
            <InputField name="fullName" label="Full Name" value={address.fullName} onChange={handleChange} error={errors.fullName} />
            <InputField name="email" label="Email" type="email" value={address.email} onChange={handleChange} error={errors.email} />
          </div>
          {/* Phone */}
          <InputField name="phone" label="Phone Number" type="tel" value={address.phone} onChange={handleChange} error={errors.phone} />
          {/* Address lines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
            <InputField name="address1" label="Street Address" value={address.address1} onChange={handleChange} error={errors.address1} />
            <InputField name="address2" label="Address Line 2 (Optional)" value={address.address2} onChange={handleChange} optional />
          </div>
          {/* City, State, Postal, Country */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-5">
            <InputField name="city" label="City" value={address.city} onChange={handleChange} error={errors.city} />
            <InputField name="state" label="State" value={address.state} onChange={handleChange} error={errors.state} />
            <InputField name="postalCode" label="Postal / Pincode" value={address.postalCode} onChange={handleChange} error={errors.postalCode} />
            <InputField name="country" label="Country" value={address.country} onChange={handleChange} error={errors.country} />
          </div>
          {/* Optional extras */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
            <InputField name="company" label="Company (Optional)" value={address.company} onChange={handleChange} optional />
            <TextareaField name="deliveryInstructions" label="Delivery Instructions" value={address.deliveryInstructions} onChange={handleChange}  />
          </div>
          {/* Billing address option */}
          <div className="flex items-center mt-4 mb-2">
            <input type="checkbox" name="billingSameAsShipping" checked={address.billingSameAsShipping} onChange={handleChange} id="billingSame" className="mr-2 accent-orange-500" />
            <label htmlFor="billingSame" className="text-gray-700">Billing address same as shipping</label>
          </div>
          {/* Conditionally show billing address */}
          {!address.billingSameAsShipping && (
            <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-orange-50">
              <h3 className="text-lg font-semibold mb-2 text-orange-700">Billing Address</h3>
              <InputField name="billing_address1" label="Street Address" value={address.billingAddress.address1 || ''} onChange={(e) => {
                setAddress({ ...address, billingAddress: { ...address.billingAddress, address1: e.target.value } });
              }} error={errors.billingAddress} />
            </div>
          )}
          {Object.values(errors).some(Boolean) && (
            <div className="text-red-600 mt-3 text-sm">{Object.values(errors).find(Boolean)}</div>
          )}
        </div>
        <div className="px-8 pb-8 sm:px-12 bg-white rounded-b-2xl border-t border-orange-100">
          <button
            type="submit"
            className="w-full py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 shadow-md transition text-lg"
          >
            Continue to Checkout
          </button>
        </div>
      </form>
    </div>
  );
}

// Reusable components:
function InputField({ name, label, type = "text", value, onChange, error, optional }) {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">
        {label} {optional && <span className="text-gray-400">(Optional)</span>}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-md focus:border-orange-500 focus:ring-orange-200 transition-all`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

function TextareaField({ name, label, value, onChange }) {
  return (
    <div className="mt-4">
      <label className="block text-gray-700 font-medium mb-1">{label} <span className="text-gray-400">(Optional)</span></label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows="3"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-orange-500 focus:ring-orange-200 transition-all"
      />
    </div>
  );
}
