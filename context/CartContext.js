'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('nafha_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to load cart');
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('nafha_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    let success = false;
    let errorMsg = '';

    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      const currentInCart = existing ? existing.quantity : 0;
      
      if (currentInCart + quantity > product.stock) {
        errorMsg = `Max stock reached! Only ${product.stock} available.`;
        return prev;
      }

      success = true;
      if (existing) {
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity: quantity }];
    });

    if (success) {
      toast.success(`${quantity}x ${product.name} added to inventory!`);
    } else if (errorMsg) {
      toast.error(errorMsg);
    }
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      clearCart,
      isCartOpen, 
      setIsCartOpen,
      isCheckoutOpen, 
      setIsCheckoutOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
