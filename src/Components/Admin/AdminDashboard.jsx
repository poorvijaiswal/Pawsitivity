import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';

// Dummy products data
const initialProducts = [
  {
    id: 1,
    name: 'Reflective Dog Collar - Small',
    category: 'Collars',
    price: 599,
    inventory: 45,
    image: '/src/assets/dog1.png'
  },
  {
    id: 2,
    name: 'Reflective Dog Collar - Medium',
    category: 'Collars',
    price: 699,
    inventory: 32,
    image: '/src/assets/dog2.png'
  },
  {
    id: 3,
    name: 'Reflective Dog Collar - Large',
    category: 'Collars',
    price: 799,
    inventory: 21,
    image: '/src/assets/dog1.png'
  },
  {
    id: 4,
    name: 'Pet ID Tag - Round',
    category: 'Accessories',
    price: 299,
    inventory: 67,
    image: '/src/assets/dog2.png'
  },
  {
    id: 5,
    name: 'Pet ID Tag - Bone Shaped',
    category: 'Accessories',
    price: 349,
    inventory: 53,
    image: '/src/assets/dog1.png'
  }
];

export default function AdminDashboard() {
    const { userData: user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('products');

  useEffect(() => {
    // Load products from localStorage if available
    const storedProducts = localStorage.getItem('pawsitivity_products');
    if (storedProducts) {
      try {
        setProducts(JSON.parse(storedProducts));
      } catch (error) {
        console.error('Error loading products', error);
      }
    }
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pawsitivity_products', JSON.stringify(products));
  }, [products]);

  const handleAddProduct = () => {
    setSelectedProduct({
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      name: '',
      category: '',
      price: 0,
      inventory: 0,
      image: '/src/assets/dog1.png'
    });
    setIsFormOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    
    if (selectedProduct.id) {
      // Update existing product
      setProducts(products.map(product => 
        product.id === selectedProduct.id ? selectedProduct : product
      ));
    } else {
      // Add new product
      setProducts([...products, selectedProduct]);
    }
    
    setIsFormOpen(false);
    setSelectedProduct(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedProduct({
      ...selectedProduct,
      [name]: name === 'price' || name === 'inventory' ? Number(value) : value
    });
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/')}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-purple-200">Welcome back, {user?.firstName || 'Admin'}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="mb-8 flex border-b border-gray-200">
          <button
            className={`pb-4 px-6 font-medium transition-colors ${
              currentTab === 'products' 
                ? 'text-purple-700 border-b-2 border-purple-700' 
                : 'text-gray-500 hover:text-purple-700'
            }`}
            onClick={() => setCurrentTab('products')}
          >
            Products
          </button>
          <button
            className={`pb-4 px-6 font-medium transition-colors ${
              currentTab === 'orders' 
                ? 'text-purple-700 border-b-2 border-purple-700' 
                : 'text-gray-500 hover:text-purple-700'
            }`}
            onClick={() => setCurrentTab('orders')}
          >
            Orders
          </button>
          <button
            className={`pb-4 px-6 font-medium transition-colors ${
              currentTab === 'customers' 
                ? 'text-purple-700 border-b-2 border-purple-700' 
                : 'text-gray-500 hover:text-purple-700'
            }`}
            onClick={() => setCurrentTab('customers')}
          >
            Customers
          </button>
          <button
            className={`pb-4 px-6 font-medium transition-colors ${
              currentTab === 'analytics' 
                ? 'text-purple-700 border-b-2 border-purple-700' 
                : 'text-gray-500 hover:text-purple-700'
            }`}
            onClick={() => setCurrentTab('analytics')}
          >
            Analytics
          </button>
        </div>

        {/* Products Tab Content */}
        {currentTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Product Management</h2>
              <div className="flex space-x-3">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleAddProduct}
                  className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
                >
                  <FaPlus />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inventory
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">₹{product.price.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.inventory}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Other tabs */}
        {currentTab === 'orders' && (
          <div className="bg-white p-6 rounded-lg shadow-md text-center py-16">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Orders Dashboard Coming Soon</h3>
            <p className="text-gray-500">This feature is currently under development.</p>
          </div>
        )}
        
        {currentTab === 'customers' && (
          <div className="bg-white p-6 rounded-lg shadow-md text-center py-16">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Customer Management Coming Soon</h3>
            <p className="text-gray-500">This feature is currently under development.</p>
          </div>
        )}
        
        {currentTab === 'analytics' && (
          <div className="bg-white p-6 rounded-lg shadow-md text-center py-16">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Analytics Dashboard Coming Soon</h3>
            <p className="text-gray-500">This feature is currently under development.</p>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {isFormOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedProduct.id ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={selectedProduct.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={selectedProduct.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="" disabled>Select a category</option>
                    <option value="Collars">Collars</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Trackers">Trackers</option>
                    <option value="Food">Food</option>
                    <option value="Toys">Toys</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      min="0"
                      step="0.01"
                      value={selectedProduct.price}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="inventory" className="block text-sm font-medium text-gray-700 mb-1">
                      Inventory
                    </label>
                    <input
                      type="number"
                      id="inventory"
                      name="inventory"
                      min="0"
                      value={selectedProduct.inventory}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    id="image"
                    name="image"
                    value={selectedProduct.image}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                  {selectedProduct.image && (
                    <div className="mt-2">
                      <img
                        src={selectedProduct.image}
                        alt="Product preview"
                        className="h-24 w-auto object-contain border rounded"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/src/assets/dog1.png';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
