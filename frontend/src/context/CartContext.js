import React, { createContext, useEffect, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        // Validate cart data
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      }
    } catch (error) {
      console.error('Error parsing cart data:', error);
      localStorage.removeItem('cart');
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    if (!product || !product.product_id) {
      console.error('Invalid product data');
      return;
    }

    if (quantity <= 0) {
      console.error('Quantity must be greater than 0');
      return;
    }

    setCart(prev => {
      const existingItem = prev.find(item => item.product_id === product.product_id);
      
      if (existingItem) {
        // Update quantity of existing item
        const newQuantity = existingItem.quantity + quantity;
        
        // Check stock availability
        if (product.stock && newQuantity > product.stock) {
          console.warn(`Cannot add more items. Stock limit: ${product.stock}`);
          return prev;
        }
        
        return prev.map(item => 
          item.product_id === product.product_id 
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        // Add new item to cart
        if (product.stock && quantity > product.stock) {
          console.warn(`Cannot add items. Stock limit: ${product.stock}`);
          return prev;
        }
        
        return [...prev, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    if (!productId) return;
    
    setCart(prev => prev.filter(item => item.product_id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (!productId || newQuantity < 0) return;
    
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prev => prev.map(item => {
      if (item.product_id === productId) {
        // Check stock availability
        if (item.stock && newQuantity > item.stock) {
          console.warn(`Cannot update quantity. Stock limit: ${item.stock}`);
          return item;
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculate total items in cart
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  // Calculate total price
  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  };

  // Get formatted total price
  const getFormattedTotal = () => {
    const total = getTotalPrice();
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(total);
  };

  // Check if item is in cart
  const isInCart = (productId) => {
    return cart.some(item => item.product_id === productId);
  };

  // Get item quantity in cart
  const getItemQuantity = (productId) => {
    const item = cart.find(item => item.product_id === productId);
    return item ? item.quantity : 0;
  };

  const contextValue = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
    getCartTotal: getTotalPrice, // Alias for backward compatibility
    getFormattedTotal,
    isInCart,
    getItemQuantity
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};
