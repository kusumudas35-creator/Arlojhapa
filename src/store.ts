import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product, ProductVariant } from './constants';

interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, variant: ProductVariant, quantity: number) => void;
  removeItem: (sku: string) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  setIsOpen: (isOpen: boolean) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (product, variant, quantity) => {
        const items = get().items;
        const existingItem = items.find((item) => item.variant.sku === variant.sku);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.variant.sku === variant.sku
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ items: [...items, { product, variant, quantity }] });
        }
        set({ isOpen: true });
      },
      removeItem: (sku) => {
        set({ items: get().items.filter((item) => item.variant.sku !== sku) });
      },
      updateQuantity: (sku, quantity) => {
        if (quantity <= 0) {
          get().removeItem(sku);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.variant.sku === sku ? { ...item, quantity } : item
          ),
        });
      },
      setIsOpen: (isOpen) => set({ isOpen }),
      clearCart: () => set({ items: [] }),
      total: () => {
        return get().items.reduce((acc, item) => acc + item.product.basePrice * item.quantity, 0);
      },
    }),
    {
      name: 'arlo-boudha-cart',
      partialize: (state) => ({ items: state.items }), // Only persist items
    }
  )
);
