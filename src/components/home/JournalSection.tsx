import React, { useEffect, useState, useRef } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const JournalSection = () => {
  const [images, setImages] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoplayTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const q = query(collection(db, 'journal_images'), orderBy('orderIndex', 'asc'), limit(5));
        const snapshot = await getDocs(q);
        const fetchedImages = snapshot.docs.map(doc => doc.data().url as string);
        setImages(fetchedImages);
      } catch (err) {
        console.error("Error fetching journal images:", err);
      }
    };
    fetchImages();
  }, []);

  const defaultImages = [
    "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?q=80&w=1000",
    "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?q=80&w=1000",
    "https://images.unsplash.com/photo-1502083896352-259ba9c6e5f8?q=80&w=1000",
    "https://images.unsplash.com/photo-1498522271744-cdd435c13f24?q=80&w=1000",
    "https://images.unsplash.com/photo-1473130456108-72b14644da33?q=80&w=1000"
  ];

  const displayImages = [...images];
  while (displayImages.length < 5) {
    displayImages.push(defaultImages[displayImages.length]);
  }

  // Autoplay function
  useEffect(() => {
    if (!isHovered) {
      autoplayTimer.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % 5);
      }, 5000);
    }
    return () => {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
    };
  }, [isHovered]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + 5) % 5);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % 5);
  };

  return (
    <section className="py-24 bg-[#050000] border-t border-[#FF1053]/20 relative overflow-hidden text-white">
      <div className="container max-w-5xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-8 relative z-10 text-left">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#FF1053] block">
              Erotic Journal
            </span>
            <h2 className="text-4xl md:text-5xl font-serif italic text-white drop-shadow-[0_0_10px_rgba(255,16,83,0.5)]">
              The Evolution of Adult Gameplay
            </h2>
            <div className="space-y-6 text-gray-400 font-light leading-relaxed">
              <p>
                In the emerging era of virtual intimacy, erotic roleplaying has transcended simple text-based fantasies. We are witnessing a revolution in immersive, uncensored adult gameplay where your darkest desires and wildest fantasies take center stage.
              </p>
              <p>
                With next-generation interactive scenarios, players blur the line between digital reality and sensory pleasure. From intimate one-on-one encounters to elaborate, multi-character taboo experiences, interactive erotic hubs are designing platforms where personal boundaries can be safely pushed and explored.
              </p>
              <p>
                As adult entertainment technology advances, integrating VR environments and haptic feedback, these games deliver a hyper-realistic experience. Delve into customized avatars, deeply passionate storylines, and raw, visceral connections that redefine digital sexuality.
              </p>
            </div>
            <button className="text-[11px] font-bold uppercase tracking-[0.25em] text-white border-b-2 border-[#FF1053] pb-1 hover:text-[#FF1053] hover:shadow-[0_2px_10px_rgba(255,16,83,0.8)] transition-all">
              Read Full Article
            </button>
          </div>

          <div 
            id="journal-image-slider-container"
            className="relative w-full aspect-[4/5] flex flex-col justify-between group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Main Picture Frame */}
            <div className="relative w-full flex-grow overflow-hidden border border-[#FF1053]/30 shadow-[0_0_50px_rgba(255,16,83,0.15)] bg-[#050000] rounded-sm">
              {/* Subtle Ambient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-10 pointer-events-none" />

              {/* Displayed Image */}
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeIndex}
                  src={displayImages[activeIndex]} 
                  id={`journal-image-${activeIndex}`}
                  alt={`Sensual adult scene ${activeIndex + 1}`} 
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="w-full h-full object-cover opacity-90 saturate-[0.8] hover:saturate-120 transition-all duration-700"
                />
              </AnimatePresence>

              {/* Navigation overlays */}
              <button 
                onClick={handlePrev}
                id="journal-slider-prev"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-[#FF1053] border border-[#FF1053]/20 hover:border-transparent flex items-center justify-center text-white/80 hover:text-white transition-all hover:scale-110 active:scale-95 duration-300 backdrop-blur-sm"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
              
              <button 
                onClick={handleNext}
                id="journal-slider-next"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-[#FF1053] border border-[#FF1053]/20 hover:border-transparent flex items-center justify-center text-white/80 hover:text-white transition-all hover:scale-110 active:scale-95 duration-300 backdrop-blur-sm"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>

              {/* Float index indicator */}
              <div className="absolute top-4 right-4 z-20 bg-black/80 border border-[#FF1053]/30 px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-[#FF1053] rounded-sm backdrop-blur-sm select-none">
                0{activeIndex + 1} / 05
              </div>
            </div>

            {/* Bottom Progress Bars Indicator */}
            <div className="w-full mt-6 flex items-center justify-between px-1 select-none">
              <div className="flex gap-2 w-[70%]">
                {displayImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIndex(idx);
                    }}
                    className="flex-1 h-[3px] transition-all duration-500 relative overflow-hidden rounded-full"
                    style={{
                      backgroundColor: idx === activeIndex ? '#FF1053' : 'rgba(255, 16, 83, 0.2)',
                    }}
                    title={`View slide ${idx + 1}`}
                  >
                    {idx === activeIndex && !isHovered && (
                      <motion.div 
                        className="absolute left-0 top-0 h-full bg-white w-full"
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        transition={{ duration: 5, ease: "linear" }}
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF1053]/70 font-mono">
                GALLERY VIEW
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
