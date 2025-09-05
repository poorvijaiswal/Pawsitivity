import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaArrowLeft, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminProduct from '../Admin/AdminProduct';

// Initial categories
const initialCategories = ['Dogs', 'Cats', 'Cattle', 'Birds', 'Accessories', 'Trackers'];

export default function AdminDashboard() {
  const { user, logout, isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState(initialCategories);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [currentTab, setCurrentTab] = useState('products');
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [offers, setOffers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pawsitivity_topOffers')) || [];
    } catch {
      return [];
    }
  });
  const [newOffer, setNewOffer] = useState('');
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [editOfferIndex, setEditOfferIndex] = useState(null);

  // Add state to track specification entries with stable IDs
  const [specificationEntries, setSpecificationEntries] = useState([]);

  // New state for color variants and secondary images
  const [colorVariants, setColorVariants] = useState([]);
  const [secondaryImages, setSecondaryImages] = useState([]);
  const [secondaryImageFiles, setSecondaryImageFiles] = useState([]);
  const [variantImageFiles, setVariantImageFiles] = useState({}); // { color: File }

  useEffect(() => {
    if (!loading && (!isLoggedIn || user?.userType !== 'admin')) {
      navigate('/admin/login');
    }
  }, [loading, isLoggedIn, user, navigate]);

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

  // Initialize specification entries when product is selected
  useEffect(() => {
    if (selectedProduct && selectedProduct.specifications) {
      const entries = Object.entries(selectedProduct.specifications).map(([key, value], index) => ({
        id: `spec-${Date.now()}-${index}`, // Stable unique ID
        key,
        value
      }));
      setSpecificationEntries(entries);
    } else if (selectedProduct) {
      setSpecificationEntries([]);
    }
  }, [selectedProduct?.id]); // Only re-run when product ID changes

  useEffect(() => {
    if (selectedProduct) {
      setColorVariants(selectedProduct.colorVariants || []);
      setSecondaryImages(selectedProduct.secondaryImages || []);
      setSecondaryImageFiles([]);
      setVariantImageFiles({});
    }
  }, [selectedProduct?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-2 border-yellow-600 rounded-full border-t-transparent animate-spin"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || user?.userType !== 'admin') {
    return null; // Don't render anything while redirecting
  }

  const emptyProduct = {
    id: null,
    name: '',
    author: '',
    rating: 0,
    reviewCount: 0,
    format: '',
    price: 0,
    originalPrice: 0,
    inStock: true,
    stockCount: 0,
    category: '',
    description: '',
    features: [''],
    specifications: {},
    benefits: [''],
    colorVariants: [], // [{ color, image }]
    secondaryImages: [], // [url, url]
    videos: []
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
    
    // Create preview URLs
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(previewUrls);
  };

  // Remove image from selection
  const removeImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index);
    
    // Revoke the removed URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index]);
    
    setSelectedImages(newImages);
    setImagePreviewUrls(newPreviewUrls);
  };

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const handleAddProduct = () => {
    setSelectedProduct({
      ...emptyProduct,
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    });
    setSelectedImages([]);
    setImagePreviewUrls([]);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct({...product});
    setSelectedImages([]);
    setImagePreviewUrls([]);
    setIsFormOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    
    // Convert specification entries back to object
    const specifications = {};
    specificationEntries.forEach(entry => {
      if (entry.key.trim() && entry.value.trim()) {
        specifications[entry.key.trim()] = entry.value.trim();
      }
    });
    
    const imageUrls = selectedImages.length > 0 
      ? imagePreviewUrls 
      : selectedProduct.images || [];
    
    // Save colorVariants and secondaryImages
    const productToSave = {
      ...selectedProduct,
      colorVariants,
      secondaryImages,
      inStock: selectedProduct.stockCount > 0,
      features: selectedProduct.features.filter(f => f.trim() !== ''),
      specifications
    };

    if (products.find(p => p.id === selectedProduct.id)) {
      setProducts(products.map(product =>
        product.id === selectedProduct.id ? productToSave : product
      ));
    } else {
      setProducts([...products, productToSave]);
    }

    setIsFormOpen(false);
    setSelectedProduct(null);
    setSelectedImages([]);
    setImagePreviewUrls([]);
    setSpecificationEntries([]);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = value;
    
    if (type === 'number') {
      processedValue = Number(value);
    } else if (type === 'checkbox') {
      processedValue = checked;
    }

    setSelectedProduct({
      ...selectedProduct,
      [name]: processedValue,
    });
  };

  const handleArrayInputChange = (index, value, field) => {
    const updatedArray = [...selectedProduct[field]];
    updatedArray[index] = value;
    setSelectedProduct({
      ...selectedProduct,
      [field]: updatedArray
    });
  };

  const addArrayItem = (field) => {
    setSelectedProduct({
      ...selectedProduct,
      [field]: [...selectedProduct[field], '']
    });
  };

  const removeArrayItem = (index, field) => {
    const updatedArray = selectedProduct[field].filter((_, i) => i !== index);
    setSelectedProduct({
      ...selectedProduct,
      [field]: updatedArray
    });
  };

  const handleSpecificationChange = (key, value) => {
    setSelectedProduct({
      ...selectedProduct,
      specifications: {
        ...selectedProduct.specifications,
        [key]: value
      }
    });
  };

  const handleSpecificationKeyChange = (oldKey, newKey) => {
    if (oldKey === newKey) return; // No change needed
    
    const newSpecs = { ...selectedProduct.specifications };
    const value = newSpecs[oldKey];
    delete newSpecs[oldKey];
    newSpecs[newKey] = value;
    
    setSelectedProduct({
      ...selectedProduct,
      specifications: newSpecs
    });
  };

  const addSpecification = () => {
    const newKey = `New Spec ${Object.keys(selectedProduct.specifications).length + 1}`;
    setSelectedProduct({
      ...selectedProduct,
      specifications: {
        ...selectedProduct.specifications,
        [newKey]: ''
      }
    });
  };

  const removeSpecification = (key) => {
    const { [key]: removed, ...rest } = selectedProduct.specifications;
    setSelectedProduct({
      ...selectedProduct,
      specifications: rest
    });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Category management functions
  const handleAddCategory = () => {
    const normalized = newCategory.trim();
    if (normalized && !categories.map(c => c.toLowerCase()).includes(normalized.toLowerCase())) {
      setCategories([...categories, normalized]);
      setNewCategory('');
      setIsCategoryModalOpen(false);
    }
  };

  const handleDeleteCategory = (categoryToDelete) => {
    if (window.confirm(`Are you sure you want to delete the "${categoryToDelete}" category?`)) {
      setCategories(categories.filter(cat => cat !== categoryToDelete));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-yellow-500 shadow-lg">
        <div className="container px-4 py-6 mx-auto">
          <div className="flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 text-yellow-900 transition-colors rounded-lg hover:bg-yellow-400 hover:text-yellow-800"
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-yellow-900 sm:text-3xl">
                  Admin Dashboard
                </h1>
                <p className="text-yellow-800">Welcome back, {user?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => navigate('/shop')}
                className="px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base text-yellow-700 transition-all bg-yellow-200 rounded-lg shadow-md hover:bg-yellow-300 hover:shadow-lg"
              >
                View Shop
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm sm:px-6 sm:py-2 sm:text-base text-yellow-700 transition-all bg-yellow-200 rounded-lg shadow-md hover:bg-yellow-300 hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-2 py-4 mx-auto sm:px-4 sm:py-8">
        {/* Tabs */}
        {/* Responsive Tabs */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex overflow-x-auto scrollbar-hide">
              {['products', 'categories', 'orders', 'analytics', 'offers'].map((tab) => (
                <button
                  key={tab}
                  className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition-all whitespace-nowrap border-b-2 sm:px-6 sm:py-4 sm:text-base ${
                    currentTab === tab
                      ? 'text-yellow-700 border-yellow-500 bg-yellow-50'
                      : 'text-gray-500 hover:text-yellow-700 border-transparent hover:bg-gray-50'
                  }`}
                  onClick={() => setCurrentTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Tab */}
        {currentTab === 'products' && <AdminProduct />}

        {/* Categories Tab */}
        {currentTab === 'categories' && (
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">Top Offers Management</h2>
                <p className="text-sm text-gray-600 sm:text-base">Add, edit, or remove offers for the homepage carousel. (Max 55 characters each)</p>
              </div>
              <button
                onClick={() => { setNewOffer(''); setEditOfferIndex(null); setIsOfferModalOpen(true); }}
                className="flex items-center px-4 py-2 text-sm text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 shadow-md transition-all"
              >
                <FaPlus className="mr-2" />
                Add Offer
              </button>
            </div>
            <div className="space-y-4">
              {offers.length === 0 && (
                <div className="text-gray-500 text-center py-8">No offers added yet.</div>
              )}
              {offers.map((offer, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                  <span className="text-gray-800 text-sm font-medium break-all">{offer}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditOffer(idx)}
                      className="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteOffer(idx)}
                      className="px-3 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium text-gray-700">Active Category</span>
                    </p>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold leading-4 text-green-800 bg-green-100 rounded-full">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other tabs content - simplified */}
        {['orders', 'analytics'].map((tab) => (
        {/* Other tabs */}
        {['orders', 'customers', 'analytics'].map((tab) =>
          currentTab === tab && (
            <div key={tab} className="p-8 text-center bg-white rounded-lg shadow-lg border border-gray-200 sm:p-12 sm:py-20">
              <div className="text-gray-300 mb-6">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center sm:w-20 sm:h-20">
                  <span className="text-2xl sm:text-3xl">🚧</span>
                </div>
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-700 sm:text-2xl">{tab.charAt(0).toUpperCase() + tab.slice(1)} Dashboard Coming Soon</h3>
              <p className="text-gray-500 text-base sm:text-lg">This feature is currently under development.</p>
            </div>
          )
        )}
      </div>

      {/* Enhanced Product Form Modal - improved responsive design */}
      {isFormOpen && selectedProduct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/70 backdrop-blur-sm sm:p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden border border-gray-200 sm:rounded-2xl"
          >
            {/* Modal Header - simplified */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 sm:p-6">
              <h3 className="text-lg font-bold text-gray-900 sm:text-2xl">
                {selectedProduct.id && products.find(p => p.id === selectedProduct.id) ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 hover:text-gray-700 transition-colors"
              >
                <FaTimes className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Modal Body - improved responsive design */}
            <div className="overflow-y-auto max-h-[calc(95vh-120px)] bg-white">
              <form onSubmit={handleSaveProduct} className="p-4 space-y-6 sm:p-8 sm:space-y-8">
                {/* Basic Information */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {/* Product Name */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={selectedProduct.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      required
                    />
                  </div>
                  {/* Author */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Author</label>
                    <input
                      type="text"
                      name="author"
                      value={selectedProduct.author}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  {/* Format */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Format</label>
                    <input
                      type="text"
                      name="format"
                      value={selectedProduct.format}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  {/* Price */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Price (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      min="0"
                      step="0.01"
                      value={selectedProduct.price}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      required
                    />
                  </div>
                  {/* Original Price */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Original Price</label>
                    <input
                      type="number"
                      name="originalPrice"
                      min="0"
                      step="0.01"
                      value={selectedProduct.originalPrice}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  {/* Stock Count */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Stock Count *</label>
                    <input
                      type="number"
                      name="stockCount"
                      min="0"
                      value={selectedProduct.stockCount}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      required
                    />
                  </div>
                  {/* Rating */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Rating</label>
                    <input
                      type="number"
                      name="rating"
                      min="0"
                      max="5"
                      step="0.1"
                      value={selectedProduct.rating}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  {/* Review Count */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Review Count</label>
                    <input
                      type="number"
                      name="reviewCount"
                      min="0"
                      value={selectedProduct.reviewCount}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>
                  {/* Category */}
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Category *
                      <button
                        type="button"
                        onClick={() => setIsCategoryModalOpen(true)}
                        className="ml-2 px-2 py-1 text-yellow-700 border border-yellow-300 rounded-md hover:bg-yellow-50"
                        title="Add new category"
                        style={{ verticalAlign: 'middle', display: 'inline-block' }}
                      >
                        <FaPlus />
                      </button>
                    </label>
                    <select
                      name="category"
                      value={selectedProduct.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={selectedProduct.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                {/* Enhanced Image Upload Section */}
                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Primary Image</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {colorVariants.map((variant, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row gap-2 items-center bg-yellow-50 p-3 rounded-lg">
                        <input
                          type="text"
                          value={variant.color}
                          onChange={e => handleColorVariantChange(idx, 'color', e.target.value)}
                          placeholder="Color name (e.g. Yellow, Red)"
                          className="flex-1 px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                        <label className="flex items-center gap-2 cursor-pointer">
                          <span className="text-xs text-gray-700">Primary Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => handleVariantImageUpload(idx, e.target.files[0])}
                            className="hidden"
                          />
                          <span className="px-2 py-1 bg-yellow-200 rounded text-xs">Upload</span>
                        </label>
                        {variant.image && (
                          <img src={variant.image} alt={variant.color} className="w-12 h-12 object-cover rounded border" />
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveColorVariant(idx)}
                          className="text-red-600 hover:text-red-800 p-2"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddColorVariant}
                      className="flex items-center px-3 py-2 text-sm text-yellow-700 border border-yellow-300 rounded-md hover:bg-yellow-50"
                    >
                      <FaPlus className="w-4 h-4 mr-2" />
                      Add Color Variant
                    </button>
                  </div>
                </div>

                {/* Secondary Images Section */}
                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Secondary Images (shared for all variants)</label>
                  <div className="mb-4">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-yellow-300 border-dashed rounded-lg cursor-pointer bg-yellow-50 hover:bg-yellow-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FaUpload className="w-8 h-8 mb-4 text-yellow-500" />
                        <p className="mb-2 text-sm text-yellow-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-yellow-500">PNG, JPG, GIF up to 10MB each</p>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleSecondaryImagesUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {secondaryImages.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                      {secondaryImages.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Secondary ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveSecondaryImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <FaTimes className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Videos Section */}
                <div className="col-span-2">
                  <label className="block mb-2 text-sm font-medium text-gray-700">Product Videos (comma separated URLs)</label>
                  <input
                    type="text"
                    name="videos"
                    value={selectedProduct.videos.join(',')}
                    onChange={e => setSelectedProduct({
                      ...selectedProduct,
                      videos: e.target.value.split(',').map(url => url.trim()).filter(Boolean)
                    })}
                    className="w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Paste video URLs separated by comma"
                  />
                </div>

                {/* Enhanced Form Actions */}
                <div className="flex flex-col pt-6 space-y-3 border-t border-gray-200 sm:flex-row sm:space-y-0 sm:space-x-4 sm:pt-8">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 px-4 py-2 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all sm:px-6 sm:py-3 sm:text-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 text-base font-medium text-white bg-yellow-600 border border-transparent rounded-lg shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all sm:px-6 sm:py-3 sm:text-lg"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Enhanced Category Management Modal - improved responsive design */}
      {/* Category Modal */}
      {isCategoryModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-200"
          >
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 sm:text-xl">Add New Category</h3>
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="p-2 text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 hover:text-gray-700 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block mb-3 text-sm font-bold text-gray-700">Category Name</label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                    placeholder="Enter category name"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                  />
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCategory}
                    className="flex-1 px-4 py-3 text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-all font-medium"
                  >
                    Add Category
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Offer Modal */}
      {isOfferModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-200"
          >
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {editOfferIndex !== null ? 'Edit Offer' : 'Add New Offer'}
              </h3>
              <label className="block mb-2 text-sm font-medium text-gray-700">Offer Text (max 55 chars)</label>
              <input
                type="text"
                value={newOffer}
                onChange={e => setNewOffer(e.target.value.slice(0, 55))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all"
                placeholder="Enter offer text"
                maxLength={55}
              />
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => { setIsOfferModalOpen(false); setNewOffer(''); setEditOfferIndex(null); }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={editOfferIndex !== null ? handleSaveEditedOffer : handleAddOffer}
                  className="px-4 py-2 text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition-all font-medium"
                >
                  {editOfferIndex !== null ? 'Save' : 'Add'}
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-2 text-right">{newOffer.length}/55</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
