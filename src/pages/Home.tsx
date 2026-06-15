import React, { useEffect } from 'react';
import { ImageDisplayBox } from '../components/home/ImageDisplayBox';
import { InstagramFeed } from '../components/home/InstagramFeed';
import { Newsletter } from '../components/home/Newsletter';
import { JournalSection } from '../components/home/JournalSection';

export const Home = () => {
  useEffect(() => {
    // Load script for the display box ad
    const initAd = () => {
      // @ts-ignore
      (window.AdProvider = window.AdProvider || []).push({"serve": {}});
      // @ts-ignore
      (window.AdProvider = window.AdProvider || []).push({"serve": {}});
      // @ts-ignore
      (window.AdProvider = window.AdProvider || []).push({"serve": {}});
    };
    const timer = setTimeout(initAd, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="pb-20">
      <ImageDisplayBox />

      {/* Ad Stack below Display Box */}
      <div className="w-full flex flex-col items-center justify-center py-6 bg-black z-10 relative gap-4">
        {/* Original Ad */}
        <ins className="eas6a97888e10" data-zoneid="5950838"></ins> 
      </div>
      
      {/* Promotional Banner - Typography Driven */}
      <section className="py-24 bg-black overflow-hidden relative border-y border-[#FF1053]/20">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF1053]/5 via-black to-[#FF1053]/5 z-0"></div>
        <div className="container relative z-10 px-10 text-center space-y-10">
          <h2 className="text-white text-4xl md:text-6xl font-serif italic tracking-tight drop-shadow-[0_0_10px_rgba(255,16,83,0.8)]">Experience Intimate Desires</h2>
          <div className="flex justify-center gap-10">
            <span className="text-[#FF1053] text-[10px] uppercase tracking-[0.3em] font-bold">Uncensored Passion</span>
            <span className="text-[#FF1053] text-[10px] uppercase tracking-[0.3em] font-bold">Absolute Fantasy</span>
          </div>
        </div>
      </section>

      <InstagramFeed />
      <JournalSection />
      
      {/* Ads below Journal Section */}
      <div className="w-full flex flex-col items-center justify-center py-6 bg-[#050000] z-10 relative gap-4">
        <ins className="eas6a97888e37" data-zoneid="5950864"></ins>
        <ins className="eas6a97888e10" data-zoneid="5950866"></ins>
      </div>

      <Newsletter />
    </div>
  );
};

