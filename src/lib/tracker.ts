export async function trackVisit() {
  // Use localStorage to track unique visitors (devices) to accurately represent
  // "how many people have visited the website in total" rather than raw page views.
  if (localStorage.getItem('web_unique_visitor_v1')) {
    return;
  }

  try {
    localStorage.setItem('web_unique_visitor_v1', 'true');

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
      viewportSize: `${window.innerWidth}x${window.innerHeight}`
    };

    // Send tracking data to backend API instead of Firestore client SDK
    const response = await fetch("/api/track-visit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(logData)
    });

    if (!response.ok) {
      throw new Error(`Tracker API responded with status ${response.status}`);
    }

  } catch (err) {
    console.error("Error tracking unique visit:", err);
  }
}
