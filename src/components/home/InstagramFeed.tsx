import React from 'react';
import { Instagram } from 'lucide-react';

export const InstagramFeed = () => {
  return (
    <section className="px-10 py-32 max-w-[1440px] mx-auto space-y-20">
      <div className="text-center space-y-4">
         <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#FF1053] mb-2 block">Unleash Your Desires</span>
         <h2 className="text-5xl lg:text-7xl font-display font-black uppercase tracking-tighter text-[#FF1053] drop-shadow-[0_0_10px_rgba(255,16,83,0.3)]">@EroticHub</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[800px]">
        <div className="col-span-2 row-span-2 border border-[#FF1053]/20 overflow-hidden group relative bg-black">
           <img 
            src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=1000" 
            className="w-full h-full object-cover opacity-60 saturate-50 transition-all duration-1000 group-hover:opacity-100 group-hover:saturate-150 group-hover:scale-105" 
            alt="Intimate feed"
           />
           <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-[#FF1053]/90 text-white p-2 rounded-full shadow-[0_0_15px_#FF1053]"><Instagram size={20} /></div>
           </div>
        </div>
        <div className="border border-[#FF1053]/20 overflow-hidden relative group bg-black">
           <img src="https://images.unsplash.com/photo-1504285906208-1123df7a7605?q=80&w=1000" className="w-full h-full object-cover opacity-60 saturate-50 hover:opacity-100 hover:saturate-150 transition-all duration-700" alt="Intimate 2" />
        </div>
        <div className="border border-[#FF1053]/20 overflow-hidden relative group bg-black">
           <img src="https://images.unsplash.com/photo-1510486828551-512ffae76472?q=80&w=1000" className="w-full h-full object-cover opacity-60 saturate-50 hover:opacity-100 hover:saturate-150 transition-all duration-700" alt="Intimate 3" />
        </div>
        <div className="col-span-2 border border-[#FF1053]/20 bg-[#120A0A] flex flex-col items-center justify-center p-12 text-center group relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-t from-[#FF1053]/10 to-transparent"></div>
           <h3 className="text-3xl font-serif italic mb-6 text-rose-100 drop-shadow-md relative z-10">Dive Into Pleasure</h3>
           <p className="text-xs text-[#FF1053] uppercase tracking-widest leading-loose max-w-xs mb-8 relative z-10 font-medium">Explore the depths of your imagination.</p>
           <a href="#" className="text-[11px] font-bold uppercase tracking-[0.25em] text-white border-b-2 border-[#FF1053] pb-1 hover:text-[#FF1053] hover:shadow-[0_2px_10px_rgba(255,16,83,0.8)] transition-all relative z-10">Sensual Collection</a>
        </div>
      </div>
    </section>
  );
};
