import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setIsOpen: openCart, items } = useCartStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Shop', path: '/shop' },
    { label: 'Collections', path: '/shop?cat=hoodies' },
    { label: 'Journal', path: '/about' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
      {/* Top Promo Bar */}
      <div className="bg-[#000000] text-white text-[11px] font-medium uppercase tracking-[0.2em] py-2 text-center">
        Free Express Delivery inside Kathmandu Valley • Limited Drop 01 Out Now
      </div>
      
      <nav 
        className={cn(
          "w-full transition-all duration-300 px-10 py-6 border-b",
          isScrolled ? "premium-blur border-brand-border" : "bg-white border-transparent"
        )}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          {/* Links - Desktop */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.label} 
                to={link.path}
                className="text-[13px] font-medium uppercase tracking-wider hover:opacity-50 transition-opacity"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 hover:bg-black/5 rounded-full"
          >
            <Menu size={20} />
          </button>

          {/* Logo */}
          <Link 
            to="/" 
            className="text-3xl font-display font-black tracking-tighter uppercase text-center absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 group"
          >
            Arlo <span className="font-serif italic font-light lowercase tracking-normal group-hover:tracking-wider transition-all">Boudha</span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-8 text-[13px] font-medium uppercase tracking-wider">
            <button className="hidden sm:block hover:opacity-50 uppercase tracking-wider">Search</button>
            <button className="hidden sm:block hover:opacity-50 uppercase tracking-wider">Account</button>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => openCart(true)}
                className="hover:opacity-50 uppercase tracking-wider flex items-center gap-2"
              >
                Cart
                <AnimatePresence mode="popLayout">
                  <motion.span 
                    key={items.reduce((acc, item) => acc + item.quantity, 0)}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.2, opacity: 0 }}
                    className="bg-brand-black text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold"
                  >
                    {items.reduce((acc, item) => acc + item.quantity, 0)}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-md"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 20 }}
                className="fixed left-0 top-0 h-full w-full max-w-xs bg-white z-[61] p-8 flex flex-col shadow-2xl"
              >
                <div className="flex justify-between items-center mb-12">
                  <span className="text-2xl font-black tracking-tighter uppercase">ARLO BOUDHA</span>
                  <button onClick={() => setIsMobileMenuOpen(false)}>
                    <X size={24} />
                  </button>
                </div>
                <div className="flex flex-col gap-8">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.label} 
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-2xl font-black uppercase tracking-wider"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="mt-auto space-y-4">
                  <div className="h-px bg-gray-100" />
                  <p className="text-[10px] uppercase tracking-widest text-gray-500">Kathmandu, Nepal</p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};
