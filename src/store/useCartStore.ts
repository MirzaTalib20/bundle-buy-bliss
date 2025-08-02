
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type CartState = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      addItem: (item) => 
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          
          if (existingItem) {
            const updatedItems = state.items.map((i) => 
              i.id === item.id 
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            );
            
            const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
            const newTotalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            return {
              items: updatedItems,
              totalItems: newTotalItems,
              totalPrice: newTotalPrice
            };
          }
          
          const newItems = [...state.items, item];
          const newTotalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
          const newTotalPrice = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          
          return {
            items: newItems,
            totalItems: newTotalItems,
            totalPrice: newTotalPrice
          };
        }),
      removeItem: (itemId) =>
        set((state) => {
          const updatedItems = state.items.filter((i) => i.id !== itemId);
          const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
          const newTotalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          
          return {
            items: updatedItems,
            totalItems: newTotalItems,
            totalPrice: newTotalPrice
          };
        }),
      updateQuantity: (itemId, quantity) =>
        set((state) => {
          const updatedItems = state.items.map((item) => {
            if (item.id === itemId) {
              return { ...item, quantity };
            }
            return item;
          });
          
          const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
          const newTotalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          
          return {
            items: updatedItems,
            totalItems: newTotalItems,
            totalPrice: newTotalPrice
          };
        }),
      clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
    }),
    {
      name: 'cart-storage',
    }
  )
);
