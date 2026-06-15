import React from 'react';
import { ArrowRight } from 'lucide-react';

export const Newsletter = () => {
  return (
    <section className="bg-[#050000] border-t border-[#FF1053]/20 py-40">
      <div className="max-w-2xl mx-auto px-10 text-center space-y-12">
        <div className="space-y-4">
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#FF1053] block">Direct Access</span>
          <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,16,83,0.5)]">Stay Intimate</h2>
          <p className="text-[#FF1053]/60 text-sm font-light uppercase tracking-widest">Priority notifications for exclusive uncensored content.</p>
        </div>
        <form className="relative max-w-sm mx-auto group" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="YOUR EMAIL" 
            className="w-full bg-transparent border-b border-[#FF1053]/40 py-4 px-2 text-[10px] font-bold tracking-[0.2em] text-white focus:outline-none transition-all placeholder:text-gray-500 focus:border-[#FF1053] focus:shadow-[0_4px_10px_rgba(255,16,83,0.2)]"
          />
          <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-[#FF1053] hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,16,83,0.8)] transition-all">
            <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </section>
  );
};

