import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../constants';
import { ProductCard } from '../ProductCard';

interface NewArrivalsProps {
  products: Product[];
}

export const NewArrivals = ({ products }: NewArrivalsProps) => {
  return (
    <section className="px-10 py-32 max-w-[1440px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
        <div className="space-y-4">
          <span className="zara-label">Latest Drop</span>
          <h2 className="text-5xl lg:text-7xl font-display font-black uppercase tracking-tighter">New Arrivals</h2>
        </div>
        <Link to="/shop" className="text-[12px] font-bold uppercase tracking-widest border-b border-brand-black pb-1 hover:opacity-50 transition-all">
          Explore All Products
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-1 gap-y-16">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
