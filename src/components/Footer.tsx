import React from 'react';
import { Instagram, Twitter, Facebook, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-brand-border pt-32 pb-20 px-10">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-20 lg:gap-10">
        <div className="lg:col-span-5 space-y-10">
          <h2 className="text-3xl font-display font-black tracking-tighter uppercase">Arlo Boudha</h2>
          <p className="text-sm font-light text-gray-500 max-w-sm leading-relaxed uppercase tracking-wider">
            Premium technical streetwear inspired by the spiritual geometry of Boudha. Designed in Kathmandu for the modern nomad.
          </p>
          <div className="flex gap-8 items-center text-brand-black">
             <a href="#" className="hover:opacity-40 transition-opacity"><Instagram size={20} /></a>
             <a href="#" className="hover:opacity-40 transition-opacity"><Twitter size={20} /></a>
             <a href="#" className="hover:opacity-40 transition-opacity"><Facebook size={20} /></a>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <h3 className="zara-label text-brand-black">Collection</h3>
          <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-gray-400">
            <li><Link to="/shop" className="hover:text-brand-black transition-colors">T-Shirts</Link></li>
            <li><Link to="/shop" className="hover:text-brand-black transition-colors">Hoodies</Link></li>
            <li><Link to="/shop" className="hover:text-brand-black transition-colors">Pants</Link></li>
            <li><Link to="/shop" className="hover:text-brand-black transition-colors">Outerwear</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <h3 className="zara-label text-brand-black">Support</h3>
          <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-gray-400">
            <li><Link to="/contact" className="hover:text-brand-black transition-colors">Contact</Link></li>
            <li><a href="#" className="hover:text-brand-black transition-colors">Shipping</a></li>
            <li><a href="#" className="hover:text-brand-black transition-colors">Returns</a></li>
            <li><a href="#" className="hover:text-brand-black transition-colors">Sizing</a></li>
          </ul>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <h3 className="zara-label text-brand-black">Location</h3>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 leading-loose">
            Boudha Tushal<br />
            Kathmandu, Nepal<br />
            44600
          </p>
          <div className="pt-4 flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-600">Online 24/7</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Deliveries 10AM - 6PM</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto mt-32 pt-10 border-t border-brand-border flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
          &copy; 2026 Arlo Boudha • All Rights Reserved.
        </div>
        <div className="flex gap-8 items-center grayscale opacity-100 grayscale-[0.8] hover:grayscale-0 transition-all">
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Esewa_logo.png" alt="eSewa" className="h-4" />
          <img src="https://khalti.com/static/img/logo1.png" alt="Khalti" className="h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Cash on Delivery</span>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
          Designed in Kathmandu
        </div>
      </div>
    </footer>
  );
};
