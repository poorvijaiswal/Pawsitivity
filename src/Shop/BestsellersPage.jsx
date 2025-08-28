import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categoryProducts, getProductsByCategory } from '../data/products';
import { FaShoppingCart } from "react-icons/fa";

// Enhanced Star Rating Component with memoization
const StarRating = React.memo(({ rating, reviewCount }) => (
    <div className="flex flex-col items-start space-y-1 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
        <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-3 h-3 sm:w-4 sm:h-4 ${i < rating ? 'text-orange-500' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
            <span className="ml-1 text-xs text-orange-600 sm:text-sm">({rating})</span>
        </div>
        <span className="text-xs text-blue-600 hover:text-orange-700 sm:text-sm">{reviewCount} reviews</span>
    </div>
));

// Optimized Product Card with sleeker buttons
const ProductCard = React.memo(({ product, onAddToCart, cart, onQuantityChange, onRemoveFromCart }) => {
    const navigate = useNavigate();

    const cartItem = cart.find(item => item.id === product.id);
    const isInCart = !!cartItem;

    const handleProductClick = useCallback(() => {
        navigate(`/product/${product.id}`);
    }, [navigate, product.id]);

    const handleAddToCartClick = useCallback((e) => {
        e.stopPropagation();
        if (!isInCart) {
            onAddToCart(product);
        }
    }, [onAddToCart, product, isInCart]);

    // New: Remove from cart when quantity is 1 and user clicks '-'
    const handleDecrease = (e) => {
        e.stopPropagation();
        if (cartItem.quantity > 1) {
            onQuantityChange(product.id, cartItem.quantity - 1);
        } else {
            onRemoveFromCart(product.id);
        }
    };

    // Quantity controls for products already in cart
    return (
        <article className="relative p-4 transition-all duration-200 bg-white border rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1">
            {/* Product Image */}
            <div className="mb-4 cursor-pointer" onClick={handleProductClick}>
                <img 
                    src={product.image} 
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    width="300"
                    height="300"
                    className="object-cover w-full h-48 rounded-lg sm:h-56 lg:h-64" 
                    style={{ aspectRatio: '1/1' }}
                />
            </div>
            
            {/* Product Details */}
            <div className="space-y-3">
                <h3 
                    className="text-sm font-semibold text-gray-800 cursor-pointer sm:text-base hover:text-orange-700 line-clamp-2 min-h-[2.5rem]"
                    onClick={handleProductClick}
                >
                    {product.name}
                </h3>
                <p className="text-xs text-gray-500 sm:text-sm">by {product.author}</p>
                <StarRating rating={product.rating} reviewCount={product.reviewCount} />
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700 sm:text-sm">{product.format}</span>
                </div>
                {/* Sleek Buttons */}
                <div className="flex items-center justify-between mt-2 gap-2">
                    <span className="text-base font-bold text-red-700 sm:text-lg">₹{product.price}.00</span>
                    <div className="flex gap-1 items-center">
                        <button
                            onClick={handleProductClick}
                            className="px-3 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 transition-all duration-150 shadow-sm"
                            aria-label={`View details for ${product.name}`}
                        >
                            View
                        </button>
                        {isInCart ? (
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={handleDecrease}
                                    className="px-2 py-1 rounded bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 text-xs"
                                    aria-label="Decrease quantity"
                                >-</button>
                                <span className="px-2 text-xs">{cartItem.quantity}</span>
                                <button
                                    onClick={e => {
                                        e.stopPropagation();
                                        onQuantityChange(product.id, cartItem.quantity + 1);
                                    }}
                                    className="px-2 py-1 rounded bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 text-xs"
                                    aria-label="Increase quantity"
                                >+</button>
                            </div>
                        ) : (
                            <button
                                onClick={handleAddToCartClick}
                                className="px-3 py-1 text-xs font-medium rounded-md border transition-all duration-150 shadow-sm bg-orange-500 text-white hover:bg-orange-600 border-orange-500"
                                aria-label={`Add ${product.name} to cart`}
                            >
                                <FaShoppingCart className="inline-block mr-1 -mt-0.5" /> Cart
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
});

// Memoized Mobile Category Selector
const MobileCategorySelector = React.memo(({ categories, activeCategory, setActiveCategory }) => (
    <div className="mb-6 lg:hidden">
        <label htmlFor="category-select" className="sr-only">Select category</label>
        <select
            id="category-select"
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="w-full px-4 py-2 text-lg font-semibold bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
            {categories.map(category => (
                <option key={category} value={category}>{category}</option>
            ))}
        </select>
    </div>
));

// Notification component with "View Cart" button
const CartNotification = React.memo(({ show, onViewCart }) => {
    if (!show) return null;
    return (
        <div
            className="fixed z-50 px-6 py-4 text-white rounded-xl shadow-2xl top-24 right-4 flex items-center gap-4 animate-fade-in-up"
            style={{
                minWidth: 220,
                background: "linear-gradient(90deg, #FFA500 0%, #FFB300 100%)", // orange-yellow gradient
                color: "#fff",
                fontWeight: 600
            }}
        >
            <span className="font-semibold">Added to cart!</span>
            <button
                onClick={onViewCart}
                className="ml-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg font-semibold text-white shadow transition"
                style={{
                    background: "#FF5C00",
                    color: "#fff"
                }}
            >
                View Cart
            </button>
        </div>
    );
});

// --- Main BestsellersPage Component ---
export default function BestsellersPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [cart, setCart] = useState(() => {
        // Load cart from localStorage on mount
        try {
            const stored = localStorage.getItem("pawsitivity_cart");
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });
    const [showCartNotification, setShowCartNotification] = useState(false);
    const notificationTimeout = useRef(null);

    const navigate = useNavigate();

    // Memoize categories to prevent re-computation
    const categories = useMemo(() => ['All', ...Object.keys(categoryProducts)], []);

    // Memoize displayed products
    const displayedProducts = useMemo(() => 
        getProductsByCategory(activeCategory), 
        [activeCategory]
    );

    // Sync cart state with localStorage and listen for cart updates
    useEffect(() => {
        const syncCart = () => {
            try {
                const stored = localStorage.getItem("pawsitivity_cart");
                setCart(stored ? JSON.parse(stored) : []);
            } catch {
                setCart([]);
            }
        };
        window.addEventListener("pawsitivity_cart_updated", syncCart);
        // Also sync on mount in case localStorage changed elsewhere
        syncCart();
        return () => window.removeEventListener("pawsitivity_cart_updated", syncCart);
    }, []);

    // Optimized add to cart handler with useCallback
    const handleAddToCart = useCallback((product) => {
        setCart(prevCart => {
            if (prevCart.some(item => item.id === product.id)) return prevCart;
            const updatedCart = [...prevCart, { ...product, quantity: 1, addedAt: new Date().toISOString() }];
            localStorage.setItem("pawsitivity_cart", JSON.stringify(updatedCart));
            window.dispatchEvent(new Event("pawsitivity_cart_updated"));
            return updatedCart;
        });
        setShowCartNotification(true);
        if (notificationTimeout.current) clearTimeout(notificationTimeout.current);
        notificationTimeout.current = setTimeout(() => setShowCartNotification(false), 3500);
        return () => clearTimeout(notificationTimeout.current);
    }, []);

    // Memoize category change handler
    const handleCategoryChange = useCallback((category) => {
        setActiveCategory(category);
    }, []);

    // Add quantity change handler for cart items
    const handleQuantityChange = useCallback((productId, newQuantity) => {
        setCart(prevCart => {
            const updatedCart = prevCart.map(item =>
                item.id === productId
                    ? { ...item, quantity: Math.max(1, newQuantity) }
                    : item
            );
            localStorage.setItem("pawsitivity_cart", JSON.stringify(updatedCart));
            window.dispatchEvent(new Event("pawsitivity_cart_updated"));
            return updatedCart;
        });
    }, []);

    // Remove product from cart by id
    const handleRemoveFromCart = useCallback((productId) => {
        setCart(prevCart => {
            const updatedCart = prevCart.filter(item => item.id !== productId);
            localStorage.setItem("pawsitivity_cart", JSON.stringify(updatedCart));
            window.dispatchEvent(new Event("pawsitivity_cart_updated"));
            return updatedCart;
        });
    }, []);

    // Handler for "View Cart" button in notification
    const handleViewCart = useCallback(() => {
        setShowCartNotification(false);
        navigate('/cart');
    }, [navigate]);

    // Cart item count
    const cartCount = cart.length;

    return (
        <div className="min-h-screen font-sans bg-gray-50">
            {/* Floating Cart Button */}
            <button
                onClick={() => navigate('/cart')}
                className="fixed bottom-6 right-6 z-50 bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center w-14 h-14 hover:bg-orange-700 transition"
                aria-label="Go to cart"
            >
                <FaShoppingCart className="text-2xl" />
                {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5 shadow">
                        {cartCount}
                    </span>
                )}
            </button>

            <CartNotification show={showCartNotification} onViewCart={handleViewCart} />

            <main className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-8">
                {/* Header Section */}
                <header className="mb-6 text-center sm:mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                        Pawsitivity Shop
                    </h1>
                    <p className="mt-2 text-sm text-gray-600 sm:text-base">
                        Protecting animals, empowering communities
                    </p>
                </header>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 lg:gap-8">
                    
                    {/* Desktop Category Sidebar */}
                    <aside className="hidden lg:block lg:col-span-1" role="navigation" aria-label="Product categories">
                        <div className="sticky top-24">
                            <h2 className="pb-3 mb-4 text-lg font-bold text-gray-900 border-b-2 border-orange-200">
                                Shop by Category
                            </h2>
                            <ul className="space-y-2" role="list">
                                {categories.map(category => (
                                    <li key={category}>
                                        <button 
                                            onClick={() => handleCategoryChange(category)}
                                            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                activeCategory === category 
                                                    ? 'bg-orange-500 text-white shadow-md' 
                                                    : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                                            }`}
                                            aria-current={activeCategory === category ? 'page' : undefined}
                                        >
                                            {category}
                                            <span className="float-right text-xs opacity-75">
                                                ({category === 'All' ? Object.values(categoryProducts).flat().length : categoryProducts[category]?.length || 0})
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    {/* Main Products Section */}
                    <section className="lg:col-span-3">
                        <MobileCategorySelector 
                            categories={categories}
                            activeCategory={activeCategory}
                            setActiveCategory={handleCategoryChange}
                        />

                        {/* Category Header */}
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                                Bestsellers in {activeCategory}
                            </h2>
                            <p className="mt-1 text-sm text-gray-600">
                                {displayedProducts.length} products available
                            </p>
                        </div>

                        {/* Optimized Products Grid */}
                        <div className="grid grid-cols-2 gap-3 lg:grid-cols-2 xl:grid-cols-3 sm:gap-6" role="list">
                            {displayedProducts.map(product => (
                                <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    onAddToCart={handleAddToCart}
                                    cart={cart}
                                    onQuantityChange={handleQuantityChange}
                                    onRemoveFromCart={handleRemoveFromCart}
                                />
                            ))}
                        </div>
                    </section>
                </div>
            </main>

            {/* Optimized Footer */}
            <footer className="mt-12 bg-gray-800">
                <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-sm text-gray-400">
                            © 2025 Pawsitivity. Making roads safer for animals, one collar at a time.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
