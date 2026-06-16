import React, { useEffect } from 'react';

export const AdBanner = () => {
  useEffect(() => {
    // 1. Remove any existing ad scripts from the DOM to force a clean re-run/reload
    const oldScript1 = document.querySelector('script[src="https://a.magsrv.com/ad-provider.js"]');
    if (oldScript1) oldScript1.remove();

    const oldScript2 = document.querySelector('script[src="https://a.pemsrv.com/ad-provider.js"]');
    if (oldScript2) oldScript2.remove();

    // 2. Reset and pre-populate window.AdProvider array with server push objects
    // Since there are 7 <ins> tags inside this component, we push 7 serve events
    // @ts-ignore
    window.AdProvider = [];
    for (let i = 0; i < 7; i++) {
      // @ts-ignore
      window.AdProvider.push({ "serve": {} });
    }

    // 3. Create and append fresh script tags that will execute and process the AdProvider queue
    const script1 = document.createElement('script');
    script1.src = 'https://a.magsrv.com/ad-provider.js';
    script1.async = true;
    script1.type = 'application/javascript';
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://a.pemsrv.com/ad-provider.js';
    script2.async = true;
    script2.type = 'application/javascript';
    document.head.appendChild(script2);

    return () => {
      // Cleanup script tags on unmount to prevent stale state 
      const s1 = document.querySelector('script[src="https://a.magsrv.com/ad-provider.js"]');
      if (s1) s1.remove();

      const s2 = document.querySelector('script[src="https://a.pemsrv.com/ad-provider.js"]');
      if (s2) s2.remove();
    };
  }, []);

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center pt-4 pb-2 z-20 relative overflow-hidden px-2 gap-4">
        {/* 1st Ad */}
        <div className="min-h-[50px] sm:min-h-[90px] w-full flex justify-center">
          <ins className="eas6a97888e10" data-zoneid="5950656"></ins> 
        </div>
        
        {/* 2nd Ad */}
        <div className="min-h-[50px] sm:min-h-[90px] w-full flex justify-center">
          <ins className="eas6a97888e10" data-zoneid="5950782"></ins> 
        </div>

        {/* 3rd Ad */}
        <div className="min-h-[50px] sm:min-h-[90px] w-full flex justify-center">
          <ins className="eas6a97888e2" data-zoneid="5950844"></ins> 
        </div>

        {/* Multiple Format Ad */}
        <div className="min-h-[50px] sm:min-h-[90px] w-full flex justify-center">
          <ins className="eas6a97888e38" data-zoneid="5950954"></ins>
        </div>

        {/* Interstitial Ad */}
        <ins className="eas6a97888e33" data-zoneid="5950826"></ins>
        
        {/* On-load Interstitial Ad */}
        <ins className="eas6a97888e33" data-zoneid="5950882"></ins>
      </div>

      {/* Sticky Banner Ad */}
      <div className="fixed bottom-0 left-0 right-0 w-full flex justify-center z-50 bg-black/80 backdrop-blur-md border-t border-[#FF1053]/30 pt-2 pb-1 shadow-[0_-5px_20px_rgba(255,16,83,0.2)]">
        <ins className="eas6a97888e17" data-zoneid="5950832"></ins> 
      </div>
    </>
  );
};

