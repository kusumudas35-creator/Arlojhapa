import React, { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc, deleteDoc, getDoc, limit } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

interface UploadedMedia {
  id: string;
  url: string;
  orderIndex: number;
  type?: 'image' | 'video';
}

interface VisitorLog {
  id: string;
  timestamp: any;
  browser: string;
  os: string;
  language: string;
  referrer: string;
  screenSize: string;
  viewportSize: string;
}

export const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [images, setImages] = useState<UploadedMedia[]>([]);
  const [journalImages, setJournalImages] = useState<UploadedMedia[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadingJournal, setUploadingJournal] = useState(false);
  const [nextIndex, setNextIndex] = useState(1);
  const [nextJournalIndex, setNextJournalIndex] = useState(1);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [storageStatus, setStorageStatus] = useState<{ cloudinaryConfigured: boolean; cloudName: string | null } | null>(null);

  // Visitor analytics states
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [recentLogs, setRecentLogs] = useState<VisitorLog[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);


  // Fetch storage configuration status
  useEffect(() => {
    const checkStorage = async () => {
      try {
        const res = await fetch('/api/storage-status');
        if (res.ok) {
          const status = await res.json();
          setStorageStatus(status);
        }
      } catch (err) {
        console.error("Error checking storage status:", err);
      }
    };
    checkStorage();
  }, []);

  // Check auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email === 'new.arrival05678@gmail.com') {
        setIsAdmin(true);
        setPermissionError(null);
        fetchImages();
        fetchJournalImages();
        fetchVisitorStats();
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchVisitorStats = async () => {
    setAnalyticsLoading(true);
    try {
      const response = await fetch('/api/visitor-stats');
      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.status}`);
      }
      const data = await response.json();
      setTotalCount(data.totalCount || 0);
      setRecentLogs(data.recentLogs || []);
    } catch (err: any) {
      console.error("Error fetching visitor stats:", err);
      setPermissionError('Could not load visitor analytics from server api.');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const fetchImages = async () => {
    try {
      const q = query(collection(db, 'lookbook_images'), orderBy('orderIndex', 'asc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UploadedMedia));
      setImages(data);
      setNextIndex(data.length + 1);
    } catch (err: any) {
      console.error("Error fetching lookbook images.", err);
      if (err.message?.includes('Missing or insufficient permissions')) {
        setPermissionError('Missing permissions. Please update your Firebase Firestore rules to allow read/write access for journal_images and lookbook_images.');
      }
    }
  };

  const fetchJournalImages = async () => {
    try {
      const q = query(collection(db, 'journal_images'), orderBy('orderIndex', 'asc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UploadedMedia));
      setJournalImages(data);
      setNextJournalIndex(data.length + 1);
    } catch (err: any) {
      console.error("Error fetching journal images.", err);
      if (err.message?.includes('Missing or insufficient permissions')) {
        setPermissionError('Missing permissions. Please update your Firebase Firestore rules to allow read/write access for journal_images and lookbook_images.');
      }
    }
  };

  const handleDelete = async (id: string, collectionName: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
      if (collectionName === 'lookbook_images') fetchImages();
      else fetchJournalImages();
    } catch (err) {
      console.error('Error deleting image:', err);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, collectionName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isJournal = collectionName === 'journal_images';
    if (isJournal) setUploadingJournal(true);
    else setUploading(true);

    try {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const res = await fetch('/api/upload-media-base64', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ fileData: base64Data, fileName: file.name, fileType: file.type }),
      });

      if (!res.ok) throw new Error(`Upload failed`);
      
      const data = JSON.parse(await res.text());
      const mediaUrl = data.url;
      const mediaType = data.type || (file.type.startsWith('video/') ? 'video' : 'image');

      await addDoc(collection(db, collectionName), {
        url: mediaUrl,
        type: mediaType,
        orderIndex: isJournal ? nextJournalIndex : nextIndex,
        timestamp: serverTimestamp(),
      });

      if (isJournal) await fetchJournalImages();
      else await fetchImages();
    } catch (err: any) {
      console.error('Error uploading media:', err);
      alert('Failed to upload media.');
    } finally {
      if (isJournal) setUploadingJournal(false);
      else setUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="pt-32 px-10 text-center min-h-[50vh]">
        <h1 className="text-2xl font-black uppercase mb-4">Admin Access Only</h1>
        <p>Please login to view this page.</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="pt-32 px-10 text-center min-h-[50vh]">
        <h1 className="text-2xl font-black uppercase mb-4">Unauthorized</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  // Helper calculations for Visitor Analytics
  const getDeviceStats = () => {
    const browsers: { [key: string]: number } = {};
    const osList: { [key: string]: number } = {};
    const referrers: { [key: string]: number } = {};

    recentLogs.forEach(log => {
      const bOption = log.browser || "Unknown Browser";
      browsers[bOption] = (browsers[bOption] || 0) + 1;
      
      const osOption = log.os || "Unknown OS";
      osList[osOption] = (osList[osOption] || 0) + 1;
      
      const refOption = log.referrer || "Direct / Bookmark";
      referrers[refOption] = (referrers[refOption] || 0) + 1;
    });

    const total = recentLogs.length || 1;

    const topBrowsers = Object.entries(browsers)
      .map(([name, count]) => ({ name, count, percentage: Math.round((count / total) * 100) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    const topOS = Object.entries(osList)
      .map(([name, count]) => ({ name, count, percentage: Math.round((count / total) * 100) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    const topReferrers = Object.entries(referrers)
      .map(([name, count]) => ({ name, count, percentage: Math.round((count / total) * 100) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    return { topBrowsers, topOS, topReferrers };
  };

  const get7DayChartData = () => {
    const daysData: { [key: string]: number } = {};
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      daysData[label] = 0;
    }

    recentLogs.forEach(log => {
      if (!log.timestamp) return;
      const dateObj = typeof log.timestamp.toDate === 'function' 
        ? log.timestamp.toDate() 
        : new Date(log.timestamp);
      
      const label = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      
      if (daysData[label] !== undefined) {
        daysData[label]++;
      }
    });

    return Object.entries(daysData).map(([day, count]) => ({ day, count }));
  };

  const formatTimestamp = (ts: any) => {
    if (!ts) return 'Just now';
    const dateObj = typeof ts.toDate === 'function' ? ts.toDate() : new Date(ts);
    
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }) + ' ' + dateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const { topBrowsers, topOS, topReferrers } = getDeviceStats();
  const trendData = get7DayChartData();
  const maxCountInTrend = Math.max(...trendData.map(d => d.count), 1);

  return (
    <div className="pt-32 pb-20 px-10 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-4xl font-black uppercase mb-12">Admin Dashboard</h1>

      {permissionError && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg mb-8">
          <p className="font-bold uppercase text-[10px] tracking-widest mb-1">Firebase Permission Error</p>
          <p className="text-sm">{permissionError}</p>
        </div>
      )}

      {/* Cloudinary Storage Status Notice */}
      {storageStatus && (
        <div className={`p-5 rounded-lg mb-10 border ${
          storageStatus.cloudinaryConfigured 
            ? "bg-green-500/10 border-green-500/30 text-green-400" 
            : "bg-amber-500/10 border-amber-500/30 text-amber-500"
        }`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${
              storageStatus.cloudinaryConfigured ? "bg-green-500" : "bg-amber-500"
            }`} />
            <h3 className="font-bold uppercase text-[11px] tracking-wider font-mono">
              Backend Storage: {storageStatus.cloudinaryConfigured ? "Cloudinary Active" : "Local Sandbox Temp Mode"}
            </h3>
          </div>
          
          {storageStatus.cloudinaryConfigured ? (
            <p className="text-sm opacity-90">
              Successfully connected to Cloudinary (<strong>{storageStatus.cloudName}</strong>). All uploaded lookbook and journal images/videos are automatically stored in the cloud. They are fully reliable, persistent, and accessible across different browsers or devices!
            </p>
          ) : (
            <div className="space-y-3">
              <p className="text-sm opacity-95 leading-relaxed">
                Cloudinary API keys are not detected on the backend. Files are currently stored inside the local server container, which gets wiped when the server restarts, stays idle, redeploys, or is opened in other browser sessions.
              </p>
              <div className="bg-black/40 p-4 rounded border border-amber-500/20 text-xs text-amber-400 font-mono space-y-2">
                <p className="font-bold text-amber-200">To persist uploads permanently across all browsers, add these key-value pairs in the Settings panel (under Secrets) in Google AI Studio:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><code>CLOUDINARY_CLOUD_NAME</code></li>
                  <li><code>CLOUDINARY_API_KEY</code></li>
                  <li><code>CLOUDINARY_API_SECRET</code></li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Visitor Analytics Section */}
      <section className="mb-16">
        <h2 className="text-xl font-bold uppercase mb-6 flex items-center gap-3">
          <span className="inline-block w-2.5 h-2.5 bg-[#FF1053] rounded-full shadow-[0_0_8px_#FF1053]" />
          Visitor Analytics Overview
        </h2>

        {analyticsLoading ? (
          <div className="bg-brand-gray p-12 rounded-xl border border-[#FF1053]/20 text-center flex flex-col items-center justify-center min-h-[250px]">
            <div className="w-8 h-8 border-4 border-[#FF1053] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm text-gray-400 font-mono uppercase tracking-widest animate-pulse">Loading Analytics Data...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* KPI grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-brand-gray p-6 rounded-xl border border-[#FF1053]/20 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Total Unique Visitors</span>
                <span className="text-4xl font-black mt-2 tracking-tight text-white">{totalCount !== null ? totalCount.toLocaleString() : '—'}</span>
                <span className="text-[10px] text-gray-400 mt-2 font-mono">Count of unique devices/browsers</span>
              </div>
              
              <div className="bg-brand-gray p-6 rounded-xl border border-[#FF1053]/20 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Recent Log Count</span>
                <span className="text-4xl font-black mt-2 tracking-tight text-white">{recentLogs.length}</span>
                <span className="text-[10px] text-gray-400 mt-2 font-mono">Active tracking log volume (Max 100)</span>
              </div>

              <div className="bg-brand-gray p-6 rounded-xl border border-[#FF1053]/20 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Top Platform / Referrer</span>
                <span className="text-lg font-black mt-3 truncate uppercase tracking-wide text-white">
                  {topOS[0] ? `${topOS[0].name}` : '—'} 
                  <span className="text-xs font-mono font-medium text-gray-400 block normal-case tracking-normal">
                    via {topReferrers[0] ? topReferrers[0].name : 'Direct'}
                  </span>
                </span>
                <span className="text-[10px] text-gray-400 mt-2 font-mono">Dominant visitor profile</span>
              </div>
            </div>

            {/* Visualizer Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 7-day trend chart */}
              <div className="bg-brand-gray p-6 rounded-xl border border-[#FF1053]/20 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono mb-4">7-Day Visitation Trend</h3>
                  
                  {/* Dynamic Custom Bar Chart */}
                  <div className="flex items-end justify-between gap-2 h-36 pt-4 pb-1">
                    {trendData.map((data, index) => {
                      const pct = maxCountInTrend > 0 ? (data.count / maxCountInTrend) * 100 : 0;
                      return (
                        <div key={index} className="flex flex-col items-center flex-1 group">
                          <span className="text-[10px] font-mono font-bold text-white mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {data.count}
                          </span>
                          <div className="w-full bg-[#FF1053]/10 hover:bg-[#FF1053]/25 rounded-t transition-all relative h-36" style={{ height: `${Math.max(pct, 4)}%` }}>
                            <div className="absolute inset-x-0 bottom-0 bg-[#FF1053]/60 hover:bg-[#FF1053] rounded-t transition-colors" style={{ height: '100%' }} />
                          </div>
                          <span className="text-[9px] font-mono text-gray-400 mt-2 truncate w-full text-center">
                            {data.day.split(' ')[0]} {/* Day name abbreviation */}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-4 font-mono">Unique hits graphed over active calendar timeline</p>
              </div>

              {/* Referrer & OS Breakdown */}
              <div className="bg-brand-gray p-6 rounded-xl border border-[#FF1053]/20 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono mb-4">Traffic Sources</h3>
                  <div className="space-y-3">
                    {topReferrers.map((ref, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-xs font-mono">
                          <span className="truncate max-w-[170px] text-gray-300">{ref.name}</span>
                          <span className="text-white font-bold">{ref.count} ({ref.percentage}%)</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden">
                          <div className="h-full bg-[#FF1053] rounded-full block" style={{ width: `${ref.percentage}%` }} />
                        </div>
                      </div>
                    ))}
                    {topReferrers.length === 0 && (
                      <p className="text-xs text-gray-400 font-mono">No referrer logs available yet.</p>
                    )}
                  </div>
                </div>
                
                <div className="border-t border-[#FF1053]/10 pt-3">
                  <div className="flex justify-between gap-4 text-[10px] text-gray-400 font-mono uppercase tracking-wider">
                    <span>Devices: {topBrowsers.map(b => `${b.name} (${b.percentage}%)`).join(' • ')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Log list */}
            <div className="bg-brand-gray p-6 rounded-xl border border-[#FF1053]/20">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono mb-4">Recent Visits Log File</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#FF1053]/10 text-[10px] uppercase tracking-wider font-mono text-gray-400">
                      <th className="py-2.5 font-bold">Time (Local)</th>
                      <th className="py-2.5 font-bold">Device Profile</th>
                      <th className="py-2.5 font-bold">Referrer Source</th>
                      <th className="py-2.5 font-bold">Screen Size (Viewport)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLogs.map((log) => (
                      <tr key={log.id} className="border-b border-[#FF1053]/10 last:border-0 hover:bg-white/[0.02] text-xs font-mono text-gray-300">
                        <td className="py-3 font-semibold text-gray-100">{formatTimestamp(log.timestamp)}</td>
                        <td className="py-3">
                          <span className="bg-[#FF1053]/20 px-2 py-0.5 rounded text-[10px] font-bold text-[#FF1053] mr-1.5">{log.os}</span>
                          <span className="text-gray-300">{log.browser}</span>
                        </td>
                        <td className="py-3 truncate max-w-[150px] text-gray-400" title={log.referrer}>{log.referrer}</td>
                        <td className="py-3 text-[10px] text-gray-400">{log.screenSize} <span className="opacity-60">({log.viewportSize})</span></td>
                      </tr>
                    ))}
                    {recentLogs.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-sm text-gray-400 font-mono">No visit logs recorded in database yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </section>
      
      <section className="mb-16">
        <h2 className="text-xl font-bold uppercase mb-6 flex items-center gap-4">
          Lookbook Media Upload
          {uploading && <span className="text-[10px] bg-black text-white px-2 py-1 rounded animate-pulse">Uploading...</span>}
        </h2>
        
        <div className="bg-brand-gray p-8 rounded-xl border border-gray-200">
          <label className="btn-primary inline-block cursor-pointer">
            Upload Media {nextIndex}
            <input 
              type="file" 
              accept="image/*,video/*" 
              className="hidden" 
              onChange={(e) => handleUpload(e, 'lookbook_images')} 
              disabled={uploading}
            />
          </label>
        </div>

        {images.length > 0 && (
          <div className="mt-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img, i) => (
                <div key={img.id} className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
                  <span className="absolute top-2 left-2 bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full z-10 font-bold">
                    {img.orderIndex}
                  </span>
                  <button 
                    onClick={() => handleDelete(img.id, 'lookbook_images')}
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded opacity-90 hover:opacity-100 transition-opacity z-10 hover:bg-red-600"
                  >
                    Delete
                  </button>
                  {img.type === 'video' ? (
                    <video src={img.url} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                  ) : (
                    <img src={img.url} alt={`Upload ${img.orderIndex}`} className="w-full h-full object-cover" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="mb-16">
        <h2 className="text-xl font-bold uppercase mb-6 flex items-center gap-4">
          Journal Media Upload (5 Images max)
          {uploadingJournal && <span className="text-[10px] bg-black text-white px-2 py-1 rounded animate-pulse">Uploading...</span>}
        </h2>
        
        <div className="bg-[#120A0A] p-8 rounded-xl border border-[#FF1053]/20">
          <label className="btn-primary inline-block cursor-pointer bg-[#FF1053] hover:bg-[#D0003B] text-white">
            Upload Journal Image {nextJournalIndex}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => handleUpload(e, 'journal_images')} 
              disabled={uploadingJournal}
            />
          </label>
          <p className="text-[#FF1053]/60 text-xs mt-4">Please upload 5 images to display in the journal section.</p>
        </div>

        {journalImages.length > 0 && (
          <div className="mt-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {journalImages.map((img, i) => (
                <div key={img.id} className="relative aspect-[3/4] bg-black rounded-lg overflow-hidden border border-[#FF1053]/20 group">
                  <span className="absolute top-2 left-2 bg-[#FF1053] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full z-10 font-bold">
                    {img.orderIndex}
                  </span>
                  <button 
                    onClick={() => handleDelete(img.id, 'journal_images')}
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded opacity-90 hover:opacity-100 transition-opacity z-10 hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <img src={img.url} alt={`Journal ${img.orderIndex}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
