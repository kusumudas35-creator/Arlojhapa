import React from 'react';
import { Instagram } from 'lucide-react';

export const InstagramFeed = () => {
  return (
    <section className="px-10 py-32 max-w-[1440px] mx-auto space-y-20">
      <div className="text-center space-y-4">
         <span className="zara-label">Community & Aesthetic</span>
         <h2 className="text-5xl lg:text-7xl font-display font-black uppercase tracking-tighter">@ArloBoudha</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[800px]">
        <div className="col-span-2 row-span-2 border border-brand-border overflow-hidden group relative">
           <img 
            src="https://images.unsplash.com/photo-1512411874258-299f2a9693eb?q=80&w=1000" 
            className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-105" 
            alt="Instagram feed"
           />
           <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-white/90 p-2 rounded-full"><Instagram size={20} /></div>
           </div>
        </div>
        <div className="border border-brand-border overflow-hidden relative group">
           <img src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Instagram 2" />
        </div>
        <div className="border border-brand-border overflow-hidden relative group">
           <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1000" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Instagram 3" />
        </div>
        <div className="col-span-2 border border-brand-border bg-brand-beige flex flex-col items-center justify-center p-12 text-center group">
           <h3 className="text-2xl font-serif italic mb-6">Join the Digital Ritual</h3>
           <p className="text-xs text-gray-500 uppercase tracking-widest leading-loose max-w-xs mb-8">Tag us for a chance to be featured in our lookbook.</p>
           <a href="#" className="text-[11px] font-bold uppercase tracking-widest border-b border-brand-black pb-1 hover:opacity-50 transition-all">Follow Instagram</a>
        </div>
      </div>
    </section>
  );
};
