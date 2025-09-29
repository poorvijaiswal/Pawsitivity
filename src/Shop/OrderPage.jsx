import React, { useEffect, useState } from "react";
import { getUserOrders } from "../Apis/product_api";
import { useAuth } from "../Components/Auth/AuthContext";

function OrderPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user || !user._id) {
        setError("User not found. Please login.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      const result = await getUserOrders(user._id);
      if (result.success && result.data && result.data.orders) {
        setOrders(result.data.orders);
      } else {
        setError(result.message || "Failed to fetch orders");
      }
      setLoading(false);
    };
    if (!authLoading) {
      fetchOrders();
    }
  }, [user, authLoading]);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      {loading ? (
        <div className="text-center text-gray-500">Loading orders...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-500">No orders found.</div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <div className="mb-2 text-sm text-gray-600">
                Order ID: <span className="font-mono">{order._id}</span>
              </div>
              <div className="mb-2 text-sm text-gray-600">
                Placed on: {new Date(order.createdAt).toLocaleString()}
              </div>
              <div className="mb-2 text-sm text-gray-600">
                Status:{" "}
                <span className="font-semibold">
                  {order.paymentInfo?.status || "Pending"}
                </span>
              </div>
              <div className="mb-2 text-sm text-gray-600">
                Total Amount:{" "}
                <span className="font-bold text-orange-600">
                  ₹{order.totalAmount}
                </span>
              </div>
              <div className="mb-2 text-sm text-gray-600">
                Shipping Address:{" "}
                <span className="font-medium grid grid-cols-1 gap-1">
                  {order.shippingInfo?.address ? (
                    <>
                      {order.shippingInfo.address.street && (
                        <div>street: {order.shippingInfo.address.street}</div>
                      )}
                      {order.shippingInfo.address.phoneNumber && (
                        <div>
                          phoneNumber: {order.shippingInfo.address.phoneNumber}
                        </div>
                      )}
                      {order.shippingInfo.address.address && (
                        <div>address: {order.shippingInfo.address.address}</div>
                      )}
                      {order.shippingInfo.address.addressLine1 && (
                        <div>
                          addressLine1:{" "}
                          {order.shippingInfo.address.addressLine1}
                        </div>
                      )}
                      {order.shippingInfo.address.addressLine2 && (
                        <div>
                          addressLine2:{" "}
                          {order.shippingInfo.address.addressLine2}
                        </div>
                      )}
                      {order.shippingInfo.address.landmark && (
                        <div>
                          landmark: {order.shippingInfo.address.landmark}
                        </div>
                      )}
                      {order.shippingInfo.address.city && (
                        <div>city: {order.shippingInfo.address.city}</div>
                      )}
                      {order.shippingInfo.address.state && (
                        <div>state: {order.shippingInfo.address.state}</div>
                      )}
                      {order.shippingInfo.address.pinCode && (
                        <div>pinCode: {order.shippingInfo.address.pinCode}</div>
                      )}
                      {order.shippingInfo.address.country && (
                        <div>country: {order.shippingInfo.address.country}</div>
                      )}
                      {order.shippingInfo.address.email && (
                        <div>email: {order.shippingInfo.address.email}</div>
                      )}
                    </>
                  ) : (
                    "N/A"
                  )}
                </span>
              </div>
              <div className="mt-4">
                <h2 className="font-semibold mb-2">Items:</h2>
                <ul className="space-y-2">
                  {order.orderItems.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <span>{item.name}</span>
                      <span className="text-gray-500">
                        Qty: {item.quantity}
                      </span>
                      <span className="text-orange-600 font-bold">
                        ₹{item.price * item.quantity}
                      </span>
                    </li>
                  ))}
                  <li>
                    <div className="mb-2 text-sm text-gray-600">
                      Total Amount:{" "}
                      <span className="font-bold text-orange-600">
                        ₹{order.totalAmount}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderPage;
