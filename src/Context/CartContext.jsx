import React, { createContext, useContext, useState, useEffect } from "react";
import {
  addToCartAPI,
  getCartAPI,
  updateCartItemAPI,
  removeCartItemAPI,
  clearCartAPI,
} from "../Apis/cart";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = JSON.parse(localStorage.getItem("user"))?._id;

  // This function fetches the cart from the backend and updates the state
  const fetchAndSetCart = async () => {
    if (!userId) {
      // For guest users, get from local storage
      const savedCart = localStorage.getItem("pawsitivity_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      return;
    }
    
    // For logged-in users, get from API
    try {
      const result = await getCartAPI(userId);
      if (result.success && result.cart && result.cart.products) {
        setCart(
          result.cart.products.map((p) => ({
            id: p.product._id,
            name: p.product.product || p.product.name || p.product.title || "Product",
            image: Array.isArray(p.product.image) ? (p.product.image[0]?.url || p.product.image[0]) : (p.product.image?.url || p.product.image || "/api/placeholder/400/400"),
            price: p.product.discountedPrice || p.product.price || 0,
            originalPrice: p.product.price || 0,
            quantity: p.quantity,
            format: p.product.format || ""
          }))
        );
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error("Failed to fetch cart from API:", error);
      setCart([]);
    }
  };

  // Initial fetch on component mount and when userId changes
  useEffect(() => {
    setLoading(true);
    fetchAndSetCart().finally(() => setLoading(false));
  }, [userId]);

  // Sync cart to localStorage for guest users
  useEffect(() => {
    if (!userId) {
      localStorage.setItem("pawsitivity_cart", JSON.stringify(cart));
    }
  }, [cart, userId]);

  const addToCart = async (product, quantity = 1) => {
    if (userId) {
      await addToCartAPI(userId, product.id || product._id, quantity);
      await fetchAndSetCart();
    } else {
      const existingItem = cart.find((item) => item.id === (product.id || product._id));
      if (existingItem) {
        setCart((prevCart) =>
          prevCart.map((item) =>
            item.id === (product.id || product._id)
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        );
      } else {
        setCart((prevCart) => [
          ...prevCart,
          {
            id: product._id || product.id,
            name: product.product || product.name || product.title || "Product",
            image: Array.isArray(product.image) ? (product.image[0]?.url || product.image[0]) : (product.image?.url || product.image || "/api/placeholder/400/400"),
            price: product.discountedPrice || product.price || 0,
            originalPrice: product.price || 0,
            quantity,
            format: product.format || ""
          }
        ]);
      }
    }
  };

  const removeFromCart = async (productId) => {
    if (userId) {
      await removeCartItemAPI(userId, productId);
      await fetchAndSetCart(); // Always await refresh
    } else {
      setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    if (userId) {
      await updateCartItemAPI(userId, productId, quantity);
      await fetchAndSetCart(); // Always await refresh
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = async () => {
    if (userId) {
      await clearCartAPI(userId);
    }
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};