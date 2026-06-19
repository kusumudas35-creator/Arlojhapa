import { db } from './firebase';
import { doc, setDoc, updateDoc, increment, getDoc, collection, addDoc } from 'firebase/firestore';

export async function trackVisit() {
  // Use a memory guard to prevent multiple tracking runs on the same session/load
  if (typeof window !== 'undefined') {
    if ((window as any).__web_tracked_in_session) {
      return;
    }
    (window as any).__web_tracked_in_session = true;
  }

  // Use localStorage with safety handling (iframe sandboxing could deny access)
  let isUnique = true;
  try {
    if (typeof localStorage !== 'undefined') {
      if (localStorage.getItem('web_unique_visitor_v1')) {
        isUnique = false;
      } else {
        localStorage.setItem('web_unique_visitor_v1', 'true');
      }
    }
  } catch (e) {
    console.warn("Storage access not available in this frame/context. Falling back to session/memory tracking.");
    // Fallback if local storage is disabled or throws error
  }

  try {
    const ua = navigator.userAgent;
    let browser = "Unknown Browser";
    if (ua.indexOf("Firefox") > -1) browser = "Firefox";
    else if (ua.indexOf("SamsungBrowser") > -1) browser = "Samsung Browser";
    else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) browser = "Opera";
    else if (ua.indexOf("Trident") > -1) browser = "Internet Explorer";
    else if (ua.indexOf("Edge") > -1) browser = "Edge";
    else if (ua.indexOf("Chrome") > -1) browser = "Chrome";
    else if (ua.indexOf("Safari") > -1) browser = "Safari";

    let os = "Unknown OS";
    if (ua.indexOf("Windows") > -1) os = "Windows";
    else if (ua.indexOf("Macintosh") > -1) os = "macOS";
    else if (ua.indexOf("Android") > -1) os = "Android";
    else if (ua.indexOf("iPhone") > -1 || ua.indexOf("iPad") > -1) os = "iOS";
    else if (ua.indexOf("Linux") > -1) os = "Linux";

    const logData = {
      browser,
      os,
      language: navigator.language || "en",
      referrer: document.referrer || "Direct / Bookmark",
      screenSize: `${window.screen.width}x${window.screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      timestamp: new Date().toISOString()
    };

    // If the device is unique, update our persistent visitor database in Firestore
    if (isUnique) {
      // 1. Log the visit to visit_logs in Firestore
      await addDoc(collection(db, 'visit_logs'), logData);

      // 2. Increment the global unique visitor counter in stats/visitor_count (Firestore)
      const docRef = doc(db, 'stats', 'visitor_count');
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          await updateDoc(docRef, {
            totalCount: increment(1)
          });
        } else {
          await setDoc(docRef, {
            totalCount: 1
          }, { merge: true });
        }
      } catch (innerErr) {
        // Fallback setDoc
        await setDoc(docRef, {
          totalCount: 1
        }, { merge: true });
      }
    }

    // Still hit backend API as secondary redundancy/log collection
    await fetch("/api/track-visit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(logData)
    }).catch(err => {
      console.log("Secondary API tracking logged locally:", err.message);
    });

  } catch (err) {
    console.error("Error logging unique visit to Firestore:", err);
  }
}
