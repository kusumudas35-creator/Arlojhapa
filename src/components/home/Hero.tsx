import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center border-b border-brand-border overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1552346154-21d32810acc1?q=80&w=2400" 
          alt="Hero Background" 
          className="w-full h-full object-cover grayscale opacity-20"
        />
      </div>
      
      <div className="container-wide relative z-10 px-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl"
        >
          <span className="zara-label">Spring/Summer 26 Drop</span>
          <h1 className="text-[80px] md:text-[120px] lg:text-[180px] leading-[0.8] font-black uppercase tracking-[-0.05em] mb-12">
            Boudha<br/><span className="font-serif italic font-light tracking-normal lowercase">Fashion</span>
          </h1>
          <div className="flex flex-col md:flex-row gap-10 items-start md:items-end">
            <Link to="/shop" className="btn-primary">
              Shop Collection
            </Link>
            <p className="text-sm font-light text-gray-500 max-w-[280px] leading-relaxed uppercase tracking-wider">
              Technical silhouettes inspired by stilled geometry. Designed in Kathmandu, for the world.
            </p>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 right-10 flex gap-20 text-[9px] uppercase tracking-[0.3em] font-bold text-gray-400">
        <div className="flex flex-col gap-1">
          <span>Coordinates</span>
          <span className="text-brand-black">27.7172° N, 85.3240° E</span>
        </div>
        <div className="flex flex-col gap-1">
          <span>Archive</span>
          <span className="text-brand-black">Release 01 // 2026</span>
        </div>
      </div>
    </section>
  );
};
