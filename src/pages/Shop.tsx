import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS, CATEGORIES } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

export const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('cat') || 'all';
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    if (currentCategory === 'all') return PRODUCTS;
    return PRODUCTS.filter(p => p.category === currentCategory);
  }, [currentCategory]);

  return (
    <div className="px-10 py-16 max-w-[1440px] mx-auto space-y-16">
      <header className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-gray-400">Arlo Archive</p>
            <h1 className="text-5xl lg:text-7xl font-display font-black uppercase tracking-tighter">The Catalogue</h1>
          </div>
          
          <div className="flex items-center gap-8 mb-2">
             <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider border-b border-brand-black pb-1"
             >
               <SlidersHorizontal size={14} /> Filter
             </button>
             <div className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-wider opacity-30 cursor-not-allowed">
               Sort by <ChevronDown size={14} />
             </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap gap-x-12 gap-y-6 border-b border-brand-border pb-6 no-scrollbar overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSearchParams({ cat: cat.slug })}
              className={`text-[13px] uppercase tracking-[0.2em] font-bold transition-all whitespace-nowrap ${
                currentCategory === cat.slug ? 'text-brand-black underline underline-offset-[1.5rem] decoration-2' : 'text-gray-400 hover:text-brand-black'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.05,
                ease: [0.215, 0.61, 0.355, 1] 
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-20 text-center space-y-4">
           <p className="text-gray-400 text-sm uppercase tracking-widest">No products found in this category.</p>
           <button 
            onClick={() => setSearchParams({ cat: 'all' })}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
