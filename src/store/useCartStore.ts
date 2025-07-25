
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
            
            return {
              items: updatedItems,
              totalItems: state.totalItems + item.quantity,
              totalPrice: state.totalPrice + (item.price * item.quantity)
            };
          }
          
          return {
            items: [...state.items, item],
            totalItems: state.totalItems + item.quantity,
            totalPrice: state.totalPrice + (item.price * item.quantity)
          };
        }),
      removeItem: (itemId) =>
        set((state) => {
          const itemToRemove = state.items.find((i) => i.id === itemId);
          
          if (!itemToRemove) return state;
          
          return {
            items: state.items.filter((i) => i.id !== itemId),
            totalItems: state.totalItems - itemToRemove.quantity,
            totalPrice: state.totalPrice - (itemToRemove.price * itemToRemove.quantity)
          };
        }),
      updateQuantity: (itemId, quantity) =>
        set((state) => {
          const updatedItems = state.items.map((item) => {
            if (item.id === itemId) {
              const quantityDiff = quantity - item.quantity;
              return { ...item, quantity };
            }
            return item;
          });
          
          return {
            items: updatedItems,
            totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
            totalPrice: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
          };
        }),
      clearCart: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
    }),
    {
      name: 'cart-storage',
    }
  )
);
