import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'el_pecado_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [channel, setChannel] = useState('domicilio');
  const [etaMinutes, setEtaMinutes] = useState(null);
  const [arrivalStatus, setArrivalStatus] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item) => {
    // item.id (el id del MenuItem) viaja con el carrito para poder vincular
    // el pedido con su contraparte en el OS al hacer checkout (ver Order.jsx).
    setItems((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (existing) {
        return prev.map((i) =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((name) => {
    setItems((prev) => prev.filter((i) => i.name !== name));
  }, []);

  const updateNote = useCallback((name, note) => {
    setItems((prev) => prev.map((i) => (i.name === name ? { ...i, note } : i)));
  }, []);

  const updateQuantity = useCallback((name, delta) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.name === name ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
        )
        .filter((i) => i.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setChannel('domicilio');
    setEtaMinutes(null);
    setArrivalStatus(null);
  }, []);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, updateNote, clearCart, count, subtotal, channel, setChannel, etaMinutes, setEtaMinutes, arrivalStatus, setArrivalStatus }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
