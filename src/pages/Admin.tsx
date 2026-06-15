import React, { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';

interface UploadedMedia {
  id: string;
  url: string;
  orderIndex: number;
  type?: 'image' | 'video';
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

  // Check auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser?.email === 'new.arrival05678@gmail.com') {
        setIsAdmin(true);
        setPermissionError(null);
        fetchImages();
        fetchJournalImages();
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

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

  return (
    <div className="pt-32 pb-20 px-10 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-4xl font-black uppercase mb-12">Admin Dashboard</h1>

      {permissionError && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg mb-8">
          <p className="font-bold uppercase text-[10px] tracking-widest mb-1">Firebase Permission Error</p>
          <p className="text-sm">{permissionError}</p>
        </div>
      )}
      
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
