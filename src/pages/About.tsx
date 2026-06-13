import React from 'react';
import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

export const About = () => {
  return (
    <div className="pb-32">
      {/* Hero Header - Bauhaus Style */}
      <header className="px-10 py-32 border-b border-brand-border bg-brand-beige overflow-hidden">
        <div className="max-w-[1440px] mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="zara-label">Brand Philosophy // Release 01</span>
            <h1 className="text-[14vw] md:text-[10vw] font-display font-black uppercase tracking-tighter leading-[0.75] mb-16">
              Arlo <br />
              <span className="font-serif italic font-light lowercase tracking-normal">Boudha</span>
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              <p className="text-2xl md:text-3xl font-serif italic text-gray-500 leading-relaxed">
                "A digital-physical ritual bridging ancestral spirituality with modern urban silhouettes."
              </p>
              <div className="flex flex-col justify-end gap-8">
                <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-gray-400">Est. 2026 // Kathmandu Valley</p>
                <div className="h-px w-full bg-brand-black" />
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Brand Pillars - Grid Layout */}
      <section className="px-10 py-40 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-32">
          {[
            {
              id: '01',
              title: 'The Meaning',
              text: 'Arlo is a modern kinetic prefix denoting strength and forward motion. Boudha anchors us in the spiritual heart of Kathmandu. Together, they represent the dual existence of the modern nomad.'
            },
            {
              id: '02',
              title: 'Geometry',
              text: 'Our silhouettes are driven by the "Stilled Geometry" of the valley. The perfect circle of the stupa, the architectural square of the base, and the technical lines of the urban sprawl.'
            },
            {
              id: '03',
              title: 'The Craft',
              text: 'We utilize 400GSM heavy cotton, high-density 3D puff embroidery, and custom-milled textiles. Every piece is designed for the weight of the streets and the stillness of the temple.'
            }
          ].map((item) => (
            <div key={item.id} className="space-y-8">
              <span className="text-[11px] font-black tracking-[0.4em] text-gray-300">{item.id} / CONCEPT</span>
              <h3 className="text-xl font-display font-bold uppercase tracking-tight">{item.title}</h3>
              <p className="text-sm font-light text-gray-500 leading-loose uppercase tracking-wider">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Aesthetic Section */}
      <section className="border-y border-brand-border h-[80vh] grid grid-cols-1 md:grid-cols-2">
        <div className="bg-brand-black p-10 lg:p-24 flex flex-col justify-between text-white border-r border-brand-border">
          <div className="space-y-4">
             <span className="zara-label text-white/40">Visual DNA</span>
             <h2 className="text-6xl font-display font-black uppercase tracking-tighter leading-none">The<br/>Palette</h2>
          </div>
          <div className="space-y-12">
             <div className="flex gap-10">
               <div className="space-y-4">
                 <div className="w-16 h-16 bg-[#0A0A0A] border border-white/20" />
                 <span className="text-[9px] uppercase tracking-widest font-bold opacity-40">Night #0A</span>
               </div>
               <div className="space-y-4">
                 <div className="w-16 h-16 bg-[#F5F5F5] border border-white/20" />
                 <span className="text-[9px] uppercase tracking-widest font-bold opacity-40">Cloud #F5</span>
               </div>
               <div className="space-y-4">
                 <div className="w-16 h-16 bg-[#E5E4E2] border border-white/20" />
                 <span className="text-[9px] uppercase tracking-widest font-bold opacity-40">Bone #E5</span>
               </div>
             </div>
             <p className="max-w-xs text-[10px] uppercase tracking-[0.2em] font-medium text-white/50 leading-loose">
               Inspired by the aged stone of stupas and the depth of midnight in the valley alleys.
             </p>
          </div>
        </div>
        <div className="relative overflow-hidden group">
          <img 
             src="https://images.unsplash.com/photo-1512411874258-299f2a9693eb?q=80&w=2000" 
             className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
             alt="Aesthetic"
          />
        </div>
      </section>

      {/* Community Call */}
      <section className="py-40 bg-brand-gray text-center">
        <div className="max-w-2xl mx-auto px-10 space-y-12">
           <h2 className="text-5xl font-display font-black uppercase tracking-tighter">Join the Digital Ritual</h2>
           <p className="text-lg font-serif italic text-gray-500">
             Follow us as we document the transition of Kathmandu's street culture.
           </p>
           <a href="#" className="inline-block border-b-2 border-brand-black pb-2 text-[12px] font-bold uppercase tracking-[0.3em] hover:opacity-50 transition-all">
             Instagram / @ArloBoudha
           </a>
        </div>
      </section>
    </div>
  );
};
