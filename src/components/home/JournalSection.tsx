import React, { useEffect, useState, useRef } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Volume2, VolumeX, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface VideoItem {
  id: string;
  url: string;
  orderIndex: number;
}

export const JournalSection = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const q = query(collection(db, 'journal_images'), orderBy('orderIndex', 'asc'));
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => ({
          id: doc.id,
          url: doc.data().url as string,
          orderIndex: doc.data().orderIndex || 1,
        }));
        setVideos(fetched);
      } catch (err) {
        console.error("Error fetching homepage videos:", err);
      }
    };
    fetchVideos();
  }, []);

  const defaultVideos: VideoItem[] = [
    {
      id: 'default-1',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-neon-light-signs-of-various-colors-in-a-street-34282-large.mp4',
      orderIndex: 1
    },
    {
      id: 'default-2',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-city-street-with-neon-lights-at-night-40134-large.mp4',
      orderIndex: 2
    },
    {
      id: 'default-3',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-woman-dancing-slowly-in-the-dark-with-neon-lights-41902-large.mp4',
      orderIndex: 3
    },
    {
      id: 'default-4',
      url: 'https://assets.mixkit.co/videos/preview/mixkit-mysterious-woman-in-underground-tunnel-at-night-44331-large.mp4',
      orderIndex: 4
    }
  ];

  const displayVideos = videos.length > 0 ? videos : defaultVideos;

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-[#050000] border-t border-[#FF1053]/20 relative overflow-hidden text-white">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF1053]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container max-w-6xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="text-left">
            <span className="text-[10px] uppercase font-mono font-bold tracking-[0.25em] text-[#FF1053] mb-2 block">
              ENTER THE ARENA
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,16,83,0.3)]">
              EXCLUSIVE GAME REELS
            </h2>
            <p className="text-gray-400 text-sm mt-3 font-light max-w-xl">
              Preview the highly immersive adult roleplay environments. Hover to instantly preview action reels, or play in fullscreen with spatial cinema-grade immersion.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={scrollLeft}
              className="p-3 bg-black/60 hover:bg-[#FF1053] border border-[#FF1053]/20 hover:border-transparent rounded-full text-white transition-all hover:scale-105 active:scale-95 duration-300 backdrop-blur-sm"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={scrollRight}
              className="p-3 bg-black/60 hover:bg-[#FF1053] border border-[#FF1053]/20 hover:border-transparent rounded-full text-white transition-all hover:scale-105 active:scale-95 duration-300 backdrop-blur-sm"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Video Horizontal Display Bar */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 pt-2 scroll-smooth scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none' }}
        >
          {displayVideos.map((video, idx) => (
            <VideoCard 
              key={video.id} 
              video={video} 
              index={idx}
              isMuted={isMuted}
              onExpand={() => setActiveVideo(video)}
            />
          ))}
        </div>

        {/* Global Sound/Mute Toggle */}
        <div className="flex items-center justify-center mt-6">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="flex items-center gap-2 px-4 py-2 bg-black/80 hover:bg-[#FF1053]/20 border border-[#FF1053]/30 rounded-full text-xs font-mono tracking-widest text-[#FF1053] transition-all"
          >
            {isMuted ? (
              <>
                <VolumeX size={14} />
                <span>UNMUTE PREVIEWS</span>
              </>
            ) : (
              <>
                <Volume2 size={14} />
                <span>MUTE PREVIEWS</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Lightbox / Immersive Fullscreen Video Player */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-md"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl aspect-video bg-[#050000] border border-[#FF1053]/40 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(255,16,83,0.3)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-[#FF1053] border border-white/10 p-2.5 rounded-full text-white/80 hover:text-white transition-all z-20"
                aria-label="Close player"
              >
                <X size={20} />
              </button>

              <video 
                src={activeVideo.url} 
                className="w-full h-full object-contain"
                controls
                autoPlay
                playsInline
              />

              {/* Glowing overlay decor */}
              <div className="absolute bottom-4 left-4 font-mono text-[10px] tracking-widest text-[#FF1053]/80 bg-black/60 px-3 py-1 border border-[#FF1053]/20 rounded-md">
                ACTIVE REEL: 0{activeVideo.orderIndex}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

/* Individual Video Hover Card Component */
interface VideoCardProps {
  key?: React.Key;
  video: VideoItem;
  index: number;
  isMuted: boolean;
  onExpand: () => void;
}

const VideoCard = ({ video, index, isMuted, onExpand }: VideoCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isHovered) {
        videoRef.current.play().catch(err => {
          // Safe handling for autoplay permission limits
          console.log("Hover auto-play blocked by browser guidelines.");
        });
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered]);

  return (
    <div 
      className="flex-none w-[280px] sm:w-[360px] snap-start"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[16/10] bg-[#120A0A] border border-[#FF1053]/15 hover:border-[#FF1053]/50 rounded-lg overflow-hidden group shadow-[0_5px_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(255,16,83,0.2)] transition-all duration-300">
        
        {/* Play overlay overlay */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-500 z-10 pointer-events-none" />

        <video 
          ref={videoRef}
          src={video.url} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          muted={isMuted}
          loop
          playsInline
        />

        {/* Card info / buttons overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black via-black/40 to-transparent z-20 flex items-center justify-between">
          <div className="text-left">
            <span className="font-mono text-[9px] text-[#FF1053] tracking-widest block uppercase font-bold">
              REEL #{video.orderIndex}
            </span>
            <span className="text-sm font-black tracking-tight text-white uppercase group-hover:text-[#FF1053] transition-colors">
              Intimate Gameplay No.0{index + 1}
            </span>
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              onExpand();
            }}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#FF1053] border border-white/10 hover:border-transparent flex items-center justify-center text-white transition-all scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 duration-300 hover:shadow-[0_0_10px_rgba(255,16,83,0.8)]"
            title="Watch Fullscreen"
          >
            <Maximize2 size={16} />
          </button>
        </div>

        {/* Pulse indicator for hover behavior */}
        {!isHovered && (
          <div className="absolute top-4 right-4 bg-black/70 border border-[#FF1053]/30 px-2 py-1 rounded text-[9px] font-mono tracking-widest text-[#FF1053] z-20 flex items-center gap-1.5 animate-pulse">
            <Play size={8} fill="#FF1053" className="inline" />
            <span>HOVER</span>
          </div>
        )}
      </div>
    </div>
  );
};
