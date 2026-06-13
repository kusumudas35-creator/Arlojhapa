import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';

const CATEGORIES = [
  { name: 'Outerwear', cat: 'hoodies', img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000' },
  { name: 'Essentials', cat: 'tees', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000' },
  { name: 'Utility', cat: 'pants', img: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=1000' }
];

export const CategoryGrid = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 border-b border-brand-border">
      {CATEGORIES.map((item, idx) => (
        <Link 
          key={item.name} 
          to={`/shop?cat=${item.cat}`}
          className={cn(
            "relative group aspect-[4/5] overflow-hidden border-brand-border",
            idx !== 2 && "md:border-r"
          )}
        >
          <img 
            src={item.img} 
            alt={item.name}
            className="w-full h-full object-cover grayscale transition-transform duration-1000 group-hover:scale-110 group-hover:grayscale-0" 
          />
          <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-black/40 to-transparent">
            <h3 className="text-white text-3xl font-display font-medium uppercase tracking-tight">{item.name}</h3>
            <p className="text-white/60 text-[10px] uppercase tracking-widest mt-2">View Category</p>
          </div>
        </Link>
      ))}
    </section>
  );
};
