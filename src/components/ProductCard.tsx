import React, { memo } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Product } from '../constants';
import { ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = memo(({ product }: ProductCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group flex flex-col h-full bg-white"
    >
      <Link to={`/product/${product.slug}`} className="flex-1 flex flex-col">
        <div className="aspect-[3/4] bg-brand-beige overflow-hidden relative mb-6">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute top-4 right-4 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
             <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-sm">
                <ShoppingBag size={16} />
             </div>
          </div>
          {!product.variants.some(v => v.stock > 0) && (
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] border border-brand-black px-4 py-2 bg-white">Sold Out</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-start gap-4">
            <h3 className="text-[13px] font-bold uppercase tracking-tight group-hover:underline decoration-1 underline-offset-4">{product.name}</h3>
            <span className="text-[13px] font-medium font-display">Rs. {product.basePrice}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] text-gray-400 uppercase tracking-widest">
            <span>{product.category}</span>
            <span className="text-brand-black font-bold h-0 overflow-hidden group-hover:h-auto transition-all">Add +</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';
