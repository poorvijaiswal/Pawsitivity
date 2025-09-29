import React, { useState, useEffect } from "react";
import { getAllOrders } from "../../Apis/product_api";

export default function OrdersManager() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllOrders();
        if (response.success) {
          // Adjust for backend response structure
          setOrders(response.data.orders || response.data || []);
        } else {
          setError(response.message || "Failed to fetch orders");
        }
      } catch (err) {
        setError("Something went wrong while loading orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Filter orders by order ID (or _id)
  const filteredOrders = orders.filter((order) => {
    const orderId = order.id || order._id || "";
    return orderId.toLowerCase().includes(searchTerm.trim().toLowerCase());
  });

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex justify-between">
          Orders
        </h2>
        {/* Search Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center">
          <input
            type="text"
            placeholder="Search by Order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all w-full sm:w-64"
          />
        </div>
      </div>
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading orders...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-xs font-semibold text-gray-500">
                Order ID
              </th>
              <th className="px-4 py-2 text-xs font-semibold text-gray-500">
                Customer
              </th>
              <th className="px-4 py-2 text-xs font-semibold text-gray-500">
                Date
              </th>
              <th className="px-4 py-2 text-xs font-semibold text-gray-500">
                Status
              </th>
              <th className="px-4 py-2 text-xs font-semibold text-gray-500">
                Total (₹)
              </th>
              <th className="px-4 py-2 text-xs font-semibold text-gray-500">
                Coupon
              </th>
              <th className="px-4 py-2 text-xs font-semibold text-gray-500">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400">
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                const orderId = order.id || order._id;
                const customer = order.customer || order.user || {};
                const address = order.shippingInfo?.address || {};
                const items = order.items || order.orderItems || [];
                return (
                  <React.Fragment key={orderId}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-2">{orderId}</td>
                      <td className="px-4 py-2">
                        {customer.name || customer.fullName || customer.email || address.fullName || "-"}
                      </td>
                      <td className="px-4 py-2">
                        {order.date || order.createdAt ? new Date(order.createdAt || order.date).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === "Delivered" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {order.status || order.orderStatus || "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-2 font-bold">{order.total || order.totalAmount || "-"}</td>
                      <td className="px-4 py-2">{order.coupon || order.couponCode || (<span className="text-gray-400">—</span>)}</td>
                      <td className="px-4 py-2">
                        <button className="text-blue-600 hover:underline text-xs" onClick={() => setExpandedOrder(expandedOrder === orderId ? null : orderId)}>
                          {expandedOrder === orderId ? "Hide" : "View"}
                        </button>
                      </td>
                    </tr>
                    {expandedOrder === orderId && (
                      <tr>
                        <td colSpan={7} className="bg-gray-50 px-4 py-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Customer & Shipping Details */}
                            <div>
                              <div className="font-semibold text-gray-700 mb-2">Customer Details:</div>
                              <ul className="mb-2 text-sm text-gray-600">
                                <li><span className="font-medium">Name:</span> {customer.name || customer.fullName || address.fullName || "-"}</li>
                                <li><span className="font-medium">Email:</span> {customer.email || address.email || "-"}</li>
                                <li><span className="font-medium">Phone:</span> {customer.phone || customer.phoneNumber || address.phoneNumber || "-"}</li>
                              </ul>
                              <div className="font-semibold text-gray-700 mb-2">Shipping Address:</div>
                              <ul className="mb-2 text-sm text-gray-600">
                                {address.street && <li><span className="font-medium">Street:</span> {address.street}</li>}
                                {address.landmark && <li><span className="font-medium">Landmark:</span> {address.landmark}</li>}
                                {address.city && <li><span className="font-medium">City:</span> {address.city}</li>}
                                {address.state && <li><span className="font-medium">State:</span> {address.state}</li>}
                                {address.pinCode && <li><span className="font-medium">Pin Code:</span> {address.pinCode}</li>}
                                {address.country && <li><span className="font-medium">Country:</span> {address.country}</li>}
                                {address.email && <li><span className="font-medium">Email:</span> {address.email}</li>}
                                {address.phoneNumber && <li><span className="font-medium">Phone:</span> {address.phoneNumber}</li>}
                              </ul>
                            </div>
                            {/* Order Items & Summary */}
                            <div>
                              <div className="font-semibold text-gray-700 mb-2">
                                Order Items:
                              </div>
                              <ul className="mb-2">
                                {items.map((item, idx) => (
                                  <li
                                    key={idx}
                                    className="text-sm text-gray-600 mb-1"
                                  >
                                    {item.name ||
                                      item.productName ||
                                      item.title ||
                                      "-"}
                                    &times; {item.qty || item.quantity || 1}{" "}
                                    <span className="text-gray-400">
                                      ({item.price || item.unitPrice || "-"} ₹
                                      each)
                                    </span>
                                  </li>
                                ))}
                              </ul>
                              <div className="text-xs text-gray-500 mb-1">
                                Coupon Applied:{" "}
                                <span className="font-semibold text-blue-700">
                                  {order.coupon || order.couponCode || "None"}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">
                                Order Total:{" "}
                                <span className="font-semibold text-green-700">
                                  ₹{order.total || order.totalAmount || "-"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
