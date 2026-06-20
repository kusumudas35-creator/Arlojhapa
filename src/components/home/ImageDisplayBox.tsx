import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';
import { ArrowRight, Play, X, Smartphone, RotateCw } from 'lucide-react';

interface UploadedMedia {
  id: string;
  url: string;
  orderIndex: number;
  type?: 'image' | 'video';
}

export const ImageDisplayBox = () => {
  const [images, setImages] = useState<UploadedMedia[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Listen to changes in the images collection
    const q = query(collection(db, 'lookbook_images'), orderBy('orderIndex', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as UploadedMedia));
      setImages(data);
    }, (error) => {
      console.error("Error fetching lookbook images. Please ensure your Firestore Security Rules allow read access to the 'lookbook_images' collection.", error);
    });

    return () => unsubscribe();
  }, []);

  // Sync isPlaying false when escaping fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
        setIsPlaying(false);
        if (screen.orientation && (screen.orientation as any).unlock) {
          (screen.orientation as any).unlock();
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const [showRotateHint, setShowRotateHint] = useState(false);

  // Prevent scroll behind the player when fullscreen/playing is active
  useEffect(() => {
    if (isPlaying) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isPlaying]);

  const handleNextImage = () => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const startPlayback = async () => {
    setIsPlaying(true);
    
    // Determine initially whether we should show the rotating device hint
    const isPortrait = window.innerHeight > window.innerWidth;
    const isMobileDevice = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth < 768;
    
    if (isMobileDevice && isPortrait) {
      setShowRotateHint(true);
      setTimeout(() => {
        setShowRotateHint(false);
      }, 3000);
    }

    if (!containerRef.current) return;

    // Only attempt browser native fullscreen on PC/desktop devices
    if (!isMobileDevice) {
      try {
        const container = containerRef.current;
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if ((container as any).webkitRequestFullscreen) {
          await (container as any).webkitRequestFullscreen();
        }
      } catch (err) {
        console.error('Error enabling native fullscreen:', err);
      }
    }
  };

  const endPlayback = async () => {
    try {
      if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
      }
    } catch (err) {
      console.error('Error exiting fullscreen:', err);
    }
    setIsPlaying(false);
    setShowRotateHint(false);
  };

  if (images.length === 0) {
    return null; // Don't show the section if no images are uploaded yet
  }

  return (
    <section className="py-20 px-4 md:px-10 bg-black">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-10 text-center text-[#FF1053] drop-shadow-[0_0_15px_rgba(255,16,83,0.5)]">
          NEW ROLEPLAY GAME ! WANNA PLAY??
        </h2>
        
        <div 
          ref={containerRef}
          className={`relative bg-black transition-all duration-700 ease-in-out flex items-center justify-center 
            ${isPlaying 
              ? 'fixed inset-0 w-[100dvw] h-[100dvh] z-[100] rounded-none' 
              : 'w-full rounded-lg overflow-hidden shadow-[0_0_50px_rgba(255,16,83,0.15)] aspect-[4/5] md:aspect-[4/3] border border-[#FF1053]/20'
            }`}
        >
          <AnimatePresence mode="wait">
            {images[currentIndex].type === 'video' ? (
              <motion.video
                key={currentIndex}
                src={images[currentIndex].url}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-contain bg-black"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <motion.img
                key={currentIndex}
                src={images[currentIndex].url}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className={`absolute inset-0 w-full h-full ${isPlaying ? 'object-contain' : 'object-cover'}`}
                alt={`Media item ${images[currentIndex]?.orderIndex}`}
              />
            )}
          </AnimatePresence>

          {/* Rotate Phone Hint Overlay */}
          <AnimatePresence>
            {showRotateHint && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-30 pointer-events-none"
              >
                <motion.div
                  initial={{ scale: 0.85, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.85, y: 10 }}
                  transition={{ type: "spring", damping: 25, stiffness: 350 }}
                  className="flex flex-col items-center gap-4 bg-[#050000]/95 border border-[#FF1053]/40 p-6 rounded-2xl backdrop-blur-md max-w-[280px] text-center shadow-[0_0_50px_rgba(255,16,83,0.25)]"
                >
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: [0, 90, 90, 0] }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        times: [0, 0.45, 0.85, 1],
                        repeatDelay: 0.3
                      }}
                      className="text-[#FF1053]"
                    >
                      <Smartphone size={46} className="stroke-[1.5]" />
                    </motion.div>
                    <motion.div
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute right-0 top-0 text-[#FF1053]"
                    >
                      <RotateCw size={18} />
                    </motion.div>
                  </div>
                  <div>
                    <h3 className="text-white font-extrabold uppercase tracking-wider text-sm mb-1 text-[#FF1053] drop-shadow-[0_0_8px_rgba(255,16,83,0.4)]">
                      Rotate Screen
                    </h3>
                    <p className="text-gray-300 text-xs leading-relaxed font-medium">
                      Turn your phone to landscape mode for the full widescreen view!
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Close Button when playing */}
          {isPlaying && (
            <button
               onClick={endPlayback}
               className="absolute top-6 left-6 w-12 h-12 bg-black/40 backdrop-blur-md border border-white/20 text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-all z-20"
               aria-label="Close fullscreen"
            >
              <X size={24} />
            </button>
          )}

          {/* Play Button */}
          {!isPlaying && (
            <button
              onClick={startPlayback}
              className="absolute z-20 px-8 py-3 md:px-10 md:py-4 bg-[#FF1053]/20 backdrop-blur-lg border border-[#FF1053]/60 text-white rounded-full flex items-center justify-center hover:bg-[#FF1053]/40 transition-all group shadow-[0_0_40px_rgba(255,16,83,0.4)] hover:scale-105"
              aria-label="Play View"
            >
              <span className="text-xl md:text-2xl font-black uppercase tracking-widest text-[#FF1053] drop-shadow-[0_0_8px_rgba(255,16,83,0.8)]">Play</span>
            </button>
          )}

          {/* Navigation Button */}
          {isPlaying && images.length > 1 && (
            <button
              onClick={handleNextImage}
              className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10 w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all group z-10 shadow-lg"
              aria-label="Next image"
            >
              <ArrowRight size={24} className="transform group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

