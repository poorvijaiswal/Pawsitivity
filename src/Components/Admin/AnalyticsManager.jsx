import React from 'react';

const sampleAnalytics = {
  totalSales: 24500,
  totalOrders: 120,
  totalCustomers: 85,
  topProduct: 'Reflective Dog Collar',
  conversionRate: '7.2%',
};

export default function AnalyticsManager() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Analytics</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-yellow-700 mb-2">₹{sampleAnalytics.totalSales}</div>
          <div className="text-sm text-gray-700">Total Sales</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-green-700 mb-2">{sampleAnalytics.totalOrders}</div>
          <div className="text-sm text-gray-700">Total Orders</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="text-2xl font-bold text-blue-700 mb-2">{sampleAnalytics.totalCustomers}</div>
          <div className="text-sm text-gray-700">Total Customers</div>
        </div>
        <div className="bg-pink-50 border border-pink-200 rounded-lg p-6 text-center col-span-1 sm:col-span-2">
          <div className="text-xl font-bold text-pink-700 mb-2">{sampleAnalytics.topProduct}</div>
          <div className="text-sm text-gray-700">Top Product</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center col-span-1">
          <div className="text-2xl font-bold text-purple-700 mb-2">{sampleAnalytics.conversionRate}</div>
          <div className="text-sm text-gray-700">Conversion Rate</div>
        </div>
      </div>
    </div>
  );
}
