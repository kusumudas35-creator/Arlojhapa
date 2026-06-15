import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { AuthModal } from './AuthModal';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const navLinks = [
    { label: 'Journal', path: '/about' },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-[100] transition-all duration-300">
      {/* Top Promo Bar */}
      <div className="bg-[#FF1053] text-white text-[11px] font-bold uppercase tracking-[0.2em] py-2 text-center drop-shadow-[0_0_8px_rgba(255,16,83,0.8)]">
        Enter The Erotic Fantasy
      </div>
      
      <nav 
        className={cn(
          "w-full transition-all duration-300 px-10 py-6 border-b",
          isScrolled ? "premium-blur border-[#FF1053]/20" : "bg-[#050000] border-transparent"
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
            className="text-3xl font-display font-black tracking-tighter uppercase text-center absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 group text-white"
          >
            Erotic<span className="font-serif italic font-light lowercase tracking-normal group-hover:tracking-wider transition-all text-[#FF1053] drop-shadow-[0_0_8px_rgba(255,16,83,0.8)]">hub</span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-8 text-[13px] font-medium uppercase tracking-wider">
            <button className="hidden sm:block hover:opacity-50 uppercase tracking-wider">Search</button>
            <div className="relative hidden sm:block">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="hover:opacity-50 uppercase tracking-wider"
              >
                {user ? 'Account' : 'Login'}
              </button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-4 w-48 bg-white border border-brand-border shadow-2xl p-4 flex flex-col gap-4"
                  >
                    {user ? (
                      <>
                        <div className="text-[10px] text-gray-500 truncate lowercase">{user.email}</div>
                        {user.email === 'new.arrival05678@gmail.com' && (
                          <Link to="/admin" className="uppercase tracking-wider hover:opacity-50 text-left text-xs font-bold text-brand-black" onClick={() => setIsDropdownOpen(false)}>Admin Panel</Link>
                        )}
                        <Link to="/account" className="uppercase tracking-wider hover:opacity-50 text-left text-xs font-bold" onClick={() => setIsDropdownOpen(false)}>Profile</Link>
                        <button onClick={handleLogout} className="uppercase tracking-wider hover:opacity-50 text-left text-xs font-bold text-red-600">Logout</button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => { setIsAuthModalOpen(true); setIsDropdownOpen(false); }}
                          className="uppercase tracking-wider hover:opacity-50 text-left text-xs font-bold"
                        >
                          Sign In / Register
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
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
                className="fixed left-0 top-0 h-full w-full max-w-xs bg-[#050000] border-r border-[#FF1053]/20 z-[101] p-8 flex flex-col shadow-2xl overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-12">
                  <span className="text-2xl font-black tracking-tighter uppercase text-white">EROTIC<span className="text-[#FF1053]">HUB</span></span>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-[#FF1053]">
                    <X size={24} />
                  </button>
                </div>
                <div className="flex flex-col gap-8">
                  {navLinks.map((link) => (
                    <Link 
                      key={link.label} 
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-2xl font-black uppercase tracking-wider hover:opacity-50 transition-opacity"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="h-px bg-gray-100 my-4" />
                  {user ? (
                    <>
                      <div className="text-[10px] text-gray-500 truncate lowercase">{user.email}</div>
                      {user.email === 'new.arrival05678@gmail.com' && (
                        <Link 
                          to="/admin" 
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-2xl font-black uppercase tracking-wider hover:opacity-50 transition-opacity text-brand-black"
                        >
                          Admin Panel
                        </Link>
                      )}
                      <Link 
                        to="/account" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-2xl font-black uppercase tracking-wider hover:opacity-50 transition-opacity"
                      >
                        Profile
                      </Link>
                      <button 
                        onClick={handleLogout} 
                        className="text-2xl font-black uppercase tracking-wider text-red-600 hover:opacity-50 transition-opacity text-left"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }}
                      className="text-2xl font-black uppercase tracking-wider hover:opacity-50 transition-opacity text-left"
                    >
                      Login / Register
                    </button>
                  )}
                </div>
                <div className="mt-auto space-y-4 pt-12">
                  <div className="h-px bg-gray-100" />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
};
