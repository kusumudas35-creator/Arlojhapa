import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Using placeholder fashion images as a stand-in for the requested animated GIF sequence
const IMAGES = [
  "https://images.unsplash.com/photo-1520975954732-57dd22299614?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550614000-4b95d4edfa2e?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop"
];

export const AnimatedLookbook = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    }, 800); // cycle like a GIF (800ms)

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-brand-gray py-4 overflow-hidden border-b border-brand-black">
      <div className="container px-10 mx-auto">
        <div className="flex flex-col items-center">
          <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-black/40 mb-4">
            Lookbook Animation
          </div>
          <div className="relative w-full max-w-sm aspect-[4/5] bg-brand-light">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={IMAGES[currentIndex]}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.8 }}
                transition={{ duration: 0.1 }}
                className="absolute inset-0 w-full h-full object-cover grayscale mix-blend-multiply"
                alt="Lookbook animation frame"
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
