import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { auth } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (err: any) {
      console.error("Auth Error details:", err);
      let friendlyMessage = err.message;
      
      const errorCode = err.code || "";
      if (errorCode === "auth/invalid-credential" || err.message?.includes("invalid-credential")) {
        if (isLogin) {
          friendlyMessage = "Incorrect email or password. If you don't have an account yet, click 'Register' below to create a new one.";
        } else {
          friendlyMessage = "The registration credentials are invalid or expired. Please check your inputs and try again.";
        }
      } else if (errorCode === "auth/email-already-in-use" || err.message?.includes("email-already-in-use")) {
        friendlyMessage = "This email address is already in use. If you already have an account, click 'Login' below.";
      } else if (errorCode === "auth/invalid-email" || err.message?.includes("invalid-email")) {
        friendlyMessage = "Please enter a valid email address (e.g., name@example.com).";
      } else if (errorCode === "auth/weak-password" || err.message?.includes("weak-password")) {
        friendlyMessage = "Your password is too weak. Please use at least 6 characters.";
      } else if (errorCode === "auth/user-not-found" || err.message?.includes("user-not-found")) {
        friendlyMessage = "No account found with this email. Click 'Register' below to save your email!";
      } else if (errorCode === "auth/wrong-password" || err.message?.includes("wrong-password")) {
        friendlyMessage = "Incorrect password. Please try again.";
      } else if (errorCode === "auth/too-many-requests" || err.message?.includes("too-many-requests")) {
        friendlyMessage = "Too many failed login attempts. This account is temporarily locked. Please try again in a few minutes.";
      } else if (errorCode === "auth/network-request-failed" || err.message?.includes("network-request-failed")) {
        friendlyMessage = "Network error. Please check your internet connection and try again.";
      }
      
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[70] backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white z-[71] p-10 shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 hover:rotate-90 transition-transform"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 text-center">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-xs uppercase tracking-widest text-brand-black/60 text-center mb-8">
              {isLogin ? 'Sign in to review orders.' : 'Sign up for exclusive drops.'}
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 mb-6 text-[11px] uppercase tracking-wider text-center border border-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-b border-black py-2 bg-transparent focus:outline-none text-sm transition-colors focus:border-opacity-50"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b border-black py-2 bg-transparent focus:outline-none text-sm transition-colors focus:border-opacity-50"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full mt-4"
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
              </button>
            </form>

            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="mt-8 text-[11px] uppercase tracking-wider text-center w-full hover:opacity-50 transition-opacity underline underline-offset-4"
            >
              {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
