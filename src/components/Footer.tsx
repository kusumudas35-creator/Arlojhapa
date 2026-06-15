import React from 'react';
import { Instagram, Twitter, Facebook, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-[#050000] border-t border-[#FF1053]/20 pt-32 pb-20 px-10">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-20 lg:gap-10">
        <div className="lg:col-span-5 space-y-10">
          <h2 className="text-3xl font-display font-black tracking-tighter uppercase text-white">Erotic<span className="text-[#FF1053]">hub</span></h2>
          <p className="text-sm font-light text-gray-500 max-w-sm leading-relaxed uppercase tracking-wider">
            Premium uncensored experiences designed for your deepest fantasies.
          </p>
          <div className="flex gap-8 items-center text-[#FF1053]">
             <a href="#" className="hover:opacity-40 hover:drop-shadow-[0_0_10px_rgba(255,16,83,0.8)] transition-all"><Instagram size={20} /></a>
             <a href="#" className="hover:opacity-40 hover:drop-shadow-[0_0_10px_rgba(255,16,83,0.8)] transition-all"><Twitter size={20} /></a>
             <a href="#" className="hover:opacity-40 hover:drop-shadow-[0_0_10px_rgba(255,16,83,0.8)] transition-all"><Facebook size={20} /></a>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <h3 className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#FF1053]">Collection</h3>
          <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-[#FF1053]/50">
            <li><Link to="/" className="hover:text-white transition-colors">Games</Link></li>
            <li><Link to="/" className="hover:text-white transition-colors">Scenarios</Link></li>
            <li><Link to="/" className="hover:text-white transition-colors">Studios</Link></li>
            <li><Link to="/" className="hover:text-white transition-colors">Models</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <h3 className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#FF1053]">Support</h3>
          <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-[#FF1053]/50">
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
          </ul>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <h3 className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#FF1053]">Access</h3>
          <p className="text-xs font-bold uppercase tracking-widest text-[#FF1053]/50 leading-loose">
            Virtual VIP<br />
            Global Access<br />
            18+ Only
          </p>
          <div className="pt-4 flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF1053]">Always Online</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF1053]/50">Support 24/7</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto mt-32 pt-10 border-t border-[#FF1053]/20 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FF1053]/50">
          &copy; 2026 Erotichub • All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};