import React from 'react';
import { Hero } from '../components/home/Hero';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { NewArrivals } from '../components/home/NewArrivals';
import { BestSellers } from '../components/home/BestSellers';
import { InstagramFeed } from '../components/home/InstagramFeed';
import { Newsletter } from '../components/home/Newsletter';
import { PRODUCTS } from '../constants';

export const Home = () => {
  const featuredProducts = PRODUCTS.filter(p => p.featured);
  const bestSeller = PRODUCTS[0]; // Logic for best seller

  return (
    <div className="pb-20">
      <Hero />
      <CategoryGrid />
      <NewArrivals products={featuredProducts} />
      <BestSellers product={bestSeller} />
      
      {/* 5. Promotional Banner - Typography Driven */}
      <section className="py-24 bg-brand-black overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
          <span className="text-[300px] font-black uppercase tracking-tighter leading-none text-white whitespace-nowrap">
            2026 ARCHIVE
          </span>
        </div>
        <div className="container relative z-10 px-10 text-center space-y-10">
          <h2 className="text-white text-4xl md:text-6xl font-serif italic tracking-tight">Free Express Shipping inside Kathmandu Valley</h2>
          <div className="flex justify-center gap-10">
            <span className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold">No Minimum Order</span>
            <span className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold">Same Day Delivery</span>
          </div>
        </div>
      </section>

      <InstagramFeed />
      <Newsletter />
    </div>
  );
};
