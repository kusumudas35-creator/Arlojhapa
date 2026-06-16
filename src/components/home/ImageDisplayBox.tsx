import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';
import { ArrowRight, Play, X } from 'lucide-react';

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

  const handleNextImage = () => {
    if (images.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const startPlayback = async () => {
    setIsPlaying(true);
    if (!containerRef.current) return;

    try {
      const container = containerRef.current;
      if (container.requestFullscreen) {
        await container.requestFullscreen();
      } else if ((container as any).webkitRequestFullscreen) {
        await (container as any).webkitRequestFullscreen();
      }

      // Lock orientation to landscape for mobile
      if (screen.orientation && (screen.orientation as any).lock) {
        await (screen.orientation as any).lock('landscape').catch(() => {
          // Ignore errors gracefully (e.g. not supported or on desktop)
        });
      }
    } catch (err) {
      console.error('Error enabling fullscreen:', err);
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
      if (screen.orientation && (screen.orientation as any).unlock) {
        (screen.orientation as any).unlock();
      }
    } catch (err) {
      console.error('Error exiting fullscreen:', err);
    }
    setIsPlaying(false);
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
                className={`absolute inset-0 w-full h-full ${isPlaying ? 'object-contain' : 'object-cover'}`}
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

