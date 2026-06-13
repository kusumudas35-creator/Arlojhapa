import React from 'react';
import { ArrowRight } from 'lucide-react';

export const Newsletter = () => {
  return (
    <section className="bg-white border-t border-brand-border py-40">
      <div className="max-w-2xl mx-auto px-10 text-center space-y-12">
        <div className="space-y-4">
          <span className="zara-label">Direct Access</span>
          <h2 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tighter">Stay Ahead</h2>
          <p className="text-gray-400 text-sm font-light uppercase tracking-widest">Priority notifications for every drop.</p>
        </div>
        <form className="relative max-w-sm mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="YOUR EMAIL" 
            className="w-full border-b border-brand-black py-4 px-2 text-[10px] font-bold tracking-[0.2em] focus:outline-none transition-all placeholder:text-gray-300"
          />
          <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:opacity-50 transition-all">
            <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </section>
  );
};
