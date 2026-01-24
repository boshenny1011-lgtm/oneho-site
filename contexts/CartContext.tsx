'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface CartItem {
  productId: number;
  quantity: number;
  product?: {
    id: number;
    name: string;
    price: number;
    image?: string;
    sku?: string;
  };
}

interface CartContextType {
  items: CartItem[];
  addItem: (productId: number, quantity?: number) => Promise<void>;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getTotal: () => number;
  isLoading: boolean;
  cartAnimation: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cartAnimation, setCartAnimation] = useState(false);

  // 从 localStorage 加载购物车
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }, []);

  // 保存到 localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [items]);

  // 获取商品信息（用于添加到购物车时）
  const fetchProduct = useCallback(async (productId: number) => {
    try {
      const { getProductById } = await import('@/lib/store-api');
      return await getProductById(productId);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      return null;
    }
  }, []);

  const addItem = useCallback(async (productId: number, quantity: number = 1) => {
    setIsLoading(true);
    try {
      const product = await fetchProduct(productId);

      setItems(prev => {
        const existing = prev.find(item => item.productId === productId);

        if (existing) {
          return prev.map(item =>
            item.productId === productId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          const price = product?.prices?.price
            ? parseInt(product.prices.price) / Math.pow(10, product.prices.currency_minor_unit || 2)
            : 0;

          return [
            ...prev,
            {
              productId,
              quantity,
              product: product ? {
                id: product.id,
                name: product.name,
                price,
                image: product.images[0]?.src,
                sku: product.sku,
              } : undefined,
            },
          ];
        }
      });

      setCartAnimation(true);
      setTimeout(() => setCartAnimation(false), 600);
    } finally {
      setIsLoading(false);
    }
  }, [fetchProduct]);

  const removeItem = useCallback((productId: number) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems(prev =>
      prev.map(item =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getItemCount = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const getSubtotal = useCallback(() => {
    return items.reduce((sum, item) => {
      const price = item.product?.price || 0;
      return sum + price * item.quantity;
    }, 0);
  }, [items]);

  const getTotal = useCallback(() => {
    const subtotal = getSubtotal();
    // TODO: 添加税费和运费计算
    const tax = subtotal * 0.21; // 21% VAT (示例)
    const shipping = subtotal > 100 ? 0 : 10; // 免费配送超过 €100
    return subtotal + tax + shipping;
  }, [getSubtotal]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemCount,
        getSubtotal,
        getTotal,
        isLoading,
        cartAnimation,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
