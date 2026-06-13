import React from 'react';
import { ShoppingBag, ChevronRight, X, Minus, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCartStore } from '../store';
import { Link } from 'react-router-dom';

export const CartDrawer = () => {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, total } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 z-[100] backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
          >
            <div className="p-8 border-b border-brand-border flex items-center justify-between bg-brand-beige">
              <h2 className="text-[14px] font-black uppercase tracking-[0.2em] font-display">Your Archive ({items.length})</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:opacity-50 transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-16 h-16 bg-brand-gray rounded-full flex items-center justify-center">
                    <ShoppingBag size={24} strokeWidth={1} className="text-gray-400" />
                  </div>
                  <p className="text-gray-400 uppercase tracking-[0.2em] text-[11px] font-bold">Your bag is currently empty</p>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="btn-secondary text-[11px]"
                  >
                    Return to Shop
                  </button>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map((item, idx) => (
                    <motion.div 
                      key={item.variant.sku}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex gap-6 pb-6 border-b border-brand-border last:border-0"
                    >
                      <div className="w-24 h-24 bg-brand-gray rounded-xs overflow-hidden flex-shrink-0 border border-brand-border">
                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-start">
                          <Link 
                            to={`/product/${item.product.slug}`} 
                            onClick={() => setIsOpen(false)}
                            className="font-bold text-[13px] uppercase tracking-tight hover:underline decoration-1 underline-offset-4"
                          >
                            {item.product.name}
                          </Link>
                          <button onClick={() => removeItem(item.variant.sku)} className="text-gray-300 hover:text-brand-black transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-medium">
                          {item.variant.color} / {item.variant.size}
                        </p>
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center border border-brand-border rounded-xs">
                            <button 
                              onClick={() => updateQuantity(item.variant.sku, item.quantity - 1)}
                              className="p-1 px-2 border-r border-brand-border hover:bg-brand-gray"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-10 text-center text-[12px] font-black">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.variant.sku, item.quantity + 1)}
                              className="p-1 px-2 border-l border-brand-border hover:bg-brand-gray"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="text-[13px] font-black tracking-tight">Rs. {item.product.basePrice * item.quantity}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-8 border-t border-brand-border space-y-6 bg-brand-beige">
                <div className="flex justify-between items-center">
                  <span className="uppercase tracking-[0.2em] text-[11px] font-black">Subtotal</span>
                  <span className="text-lg font-black tracking-tighter">Rs. {total()}</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full py-4 border border-brand-border text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-white transition-all mb-2"
                >
                  Continue Shopping
                </button>
                <Link 
                  to="/checkout" 
                  onClick={() => setIsOpen(false)}
                  className="btn-primary w-full flex items-center justify-center gap-2 group shadow-xl"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
