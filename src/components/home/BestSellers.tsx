import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../constants';

interface BestSellersProps {
  product: Product;
}

export const BestSellers = ({ product }: BestSellersProps) => {
  return (
    <section className="bg-brand-beige border-y border-brand-border py-40">
      <div className="px-10 max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-12">
          <div className="space-y-6">
            <span className="zara-label">Community Favorites</span>
            <h2 className="text-6xl lg:text-8xl font-display font-black uppercase tracking-tighter leading-none">
              The Best<br />Sellers
            </h2>
            <p className="text-lg text-gray-500 font-light max-w-md leading-relaxed">
              Refined over thousands of miles. Our most coveted silhouettes featuring signature Arlo embroidery and custom-milled weights.
            </p>
          </div>
          <Link to="/shop" className="btn-secondary inline-block">
            Shop Favorites
          </Link>
        </div>
        <div className="relative aspect-[4/5] group overflow-hidden">
           <img 
            src={product.images[1] || product.images[0]} 
            alt={product.name}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" 
           />
           <div className="absolute top-10 right-10 bg-white/90 p-8 backdrop-blur-sm border border-brand-border max-w-[200px]">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2">Editor's Pick</p>
              <p className="text-sm font-serif italic mb-4">"The 400GSM weight is a game changer for the valley winters."</p>
              <div className="text-[11px] font-bold border-t border-brand-border pt-4">{product.name}</div>
           </div>
        </div>
      </div>
    </section>
  );
};
