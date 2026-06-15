import React from 'react';
import { Send, MapPin, Phone, Mail, Instagram } from 'lucide-react';

export const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        {/* Info */}
        <div className="space-y-12">
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400">Get in Touch</p>
            <h1 className="text-5xl lg:text-7xl font-display font-bold uppercase tracking-tight">CONTACT</h1>
            <p className="text-gray-500 max-w-sm font-light">
              We're here to help with your accounts, collaborate on creative projects, or just talk about the next game.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <MapPin className="mt-1" size={20} />
              <div className="space-y-1">
                <p className="text-xs uppercase font-bold tracking-widest leading-none">Studio Location</p>
                <p className="text-sm text-gray-500 font-light">Global Virtual Spaces</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="mt-1" size={20} />
              <div className="space-y-1">
                <p className="text-xs uppercase font-bold tracking-widest leading-none">Phone Support</p>
                <p className="text-sm text-gray-500 font-light">+1 800 123 4567 (10AM - 6PM)</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="mt-1" size={20} />
              <div className="space-y-1">
                <p className="text-xs uppercase font-bold tracking-widest leading-none">Email Us</p>
                <p className="text-sm text-gray-500 font-light">hello@funhub.com</p>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 btn-secondary">
               <Instagram size={16} /> Follow our Journey
            </a>
          </div>
        </div>

        {/* Form */}
        <div className="bg-brand-gray/30 p-10 lg:p-16 rounded-xs">
          <form className="space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                 <label className="text-[10px] uppercase tracking-widest font-bold">Your Name</label>
                 <input type="text" className="w-full border-b border-black/10 bg-transparent py-4 text-sm focus:outline-none focus:border-brand-black transition-colors" />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] uppercase tracking-widest font-bold">Email Address</label>
                 <input type="email" className="w-full border-b border-black/10 bg-transparent py-4 text-sm focus:outline-none focus:border-brand-black transition-colors" />
               </div>
             </div>
             <div className="space-y-2">
                 <label className="text-[10px] uppercase tracking-widest font-bold">Message Type</label>
                 <select className="w-full border-b border-black/10 bg-transparent py-4 text-sm focus:outline-none focus:border-brand-black">
                    <option>Order Inquiry</option>
                    <option>General Feedback</option>
                    <option>Collaboration</option>
                    <option>Wholesale</option>
                 </select>
             </div>
             <div className="space-y-2">
                 <label className="text-[10px] uppercase tracking-widest font-bold">How can we help?</label>
                 <textarea rows={4} className="w-full border-b border-black/10 bg-transparent py-4 text-sm focus:outline-none focus:border-brand-black resize-none" />
             </div>
             <button type="button" className="btn-primary w-full flex items-center justify-center gap-2">
               Shoot Message <Send size={16} />
             </button>
          </form>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="mt-32 aspect-[21/9] bg-brand-gray rounded-xs overflow-hidden grayscale relative flex items-center justify-center group">
         <img src="https://images.unsplash.com/photo-1542385311-20d09c69346d?q=80&w=2000" className="absolute inset-0 w-full h-full object-cover opacity-30" />
         <div className="relative text-center space-y-4">
            <MapPin size={32} className="mx-auto text-brand-black" />
            <p className="text-[10px] uppercase tracking-widest font-bold">Interactive map coming soon</p>
         </div>
      </div>
    </div>
  );
};
