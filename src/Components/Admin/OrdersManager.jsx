import React, { useState } from 'react';

// Sample orders with customer and shipping details
const sampleOrders = [
  {
    id: 'ORD001',
    customer: {
      name: 'Rimjhim Shende',
      email: 'rimjhim@pawsitivity.com',
      phone: '+91 9876543210',
    },
    shipping: {
      address: '196 G Sector Silicon City, Indore 452012, India',
      city: 'Indore',
      state: 'MP',
      zip: '452012',
      country: 'India',
    },
    date: '2024-06-01',
    status: 'Delivered',
    total: 1299,
    coupon: 'PAWSUMMER20',
    items: [
      { name: 'Reflective Dog Collar', qty: 1, price: 599 },
      { name: 'QR Cat Collar', qty: 1, price: 700 }
    ]
  },
  {
    id: 'ORD002',
    customer: {
      name: 'Tushar Shende',
      email: 'tushar@pawsitivity.com',
      phone: '+91 8637215100',
    },
    shipping: {
      address: '201 H Sector Silicon City, Indore 452012, India',
      city: 'Indore',
      state: 'MP',
      zip: '452012',
      country: 'India',
    },
    date: '2024-06-02',
    status: 'Pending',
    total: 599,
    coupon: '',
    items: [
      { name: 'Reflective Dog Collar', qty: 1, price: 599 }
    ]
  },
];

export default function OrdersManager() {
  const [orders] = useState(sampleOrders);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter orders by order ID
  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex justify-between">Orders</h2>
        {/* Search Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3 items-center">
            <input
            type="text"
            placeholder="Search by Order ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all w-full sm:w-64"
            />
        </div>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Order ID</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Customer</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Date</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Status</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Total (₹)</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Coupon</th>
            <th className="px-4 py-2 text-xs font-semibold text-gray-500">Details</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-8 text-gray-400">No orders found.</td>
            </tr>
          ) : (
            filteredOrders.map(order => (
              <React.Fragment key={order.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2">{order.id}</td>
                  <td className="px-4 py-2">{order.customer.name}</td>
                  <td className="px-4 py-2">{order.date}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 font-bold">{order.total}</td>
                  <td className="px-4 py-2">{order.coupon || <span className="text-gray-400">—</span>}</td>
                  <td className="px-4 py-2">
                    <button
                      className="text-blue-600 hover:underline text-xs"
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    >
                      {expandedOrder === order.id ? 'Hide' : 'View'}
                    </button>
                  </td>
                </tr>
                {expandedOrder === order.id && (
                  <tr>
                    <td colSpan={7} className="bg-gray-50 px-4 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Customer & Shipping Details */}
                        <div>
                          <div className="font-semibold text-gray-700 mb-2">Customer Details:</div>
                          <ul className="mb-2 text-sm text-gray-600">
                            <li><span className="font-medium">Name:</span> {order.customer.name}</li>
                            <li><span className="font-medium">Email:</span> {order.customer.email}</li>
                            <li><span className="font-medium">Phone:</span> {order.customer.phone}</li>
                          </ul>
                          <div className="font-semibold text-gray-700 mb-2">Shipping Address:</div>
                          <ul className="mb-2 text-sm text-gray-600">
                            <li>{order.shipping.address}</li>
                            <li>{order.shipping.city}, {order.shipping.state} {order.shipping.zip}</li>
                            <li>{order.shipping.country}</li>
                          </ul>
                        </div>
                        {/* Order Items & Summary */}
                        <div>
                          <div className="font-semibold text-gray-700 mb-2">Order Items:</div>
                          <ul className="mb-2">
                            {order.items.map((item, idx) => (
                              <li key={idx} className="text-sm text-gray-600 mb-1">
                                {item.name} &times; {item.qty} <span className="text-gray-400">({item.price} ₹ each)</span>
                              </li>
                            ))}
                          </ul>
                          <div className="text-xs text-gray-500 mb-1">
                            Coupon Applied: <span className="font-semibold text-blue-700">{order.coupon || 'None'}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Order Total: <span className="font-semibold text-green-700">₹{order.total}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
