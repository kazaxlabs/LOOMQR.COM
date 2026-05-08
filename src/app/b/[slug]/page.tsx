'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, updateDoc, doc, increment, addDoc } from 'firebase/firestore';

export default function Bridge() {
  const { slug } = useParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    const handleRedirect = async () => {
      if (!slug) return;
      
      try {
        const q = query(collection(db, 'assets'), where('slug', '==', slug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const assetDoc = querySnapshot.docs[0];
          const assetRef = doc(db, 'assets', assetDoc.id);
          const data = assetDoc.data();
          
          // Get Real Location & Device info
          let location = 'Unknown';
          try {
            const locRes = await fetch('https://ipapi.co/json/');
            const locData = await locRes.json();
            location = `${locData.city}, ${locData.country_name}`;
          } catch (locErr) {
            console.error('Location fetch failed:', locErr);
          }

          const ua = navigator.userAgent;
          const device = /Mobile|Android|iPhone/i.test(ua) ? 'Mobile' : 'Desktop';
          const browser = /Chrome/i.test(ua) ? 'Chrome' : /Safari/i.test(ua) ? 'Safari' : /Firefox/i.test(ua) ? 'Firefox' : 'Other';

          // Increment Scans
          await updateDoc(assetRef, {
            scans: increment(1)
          });

          // Log Scan
          await addDoc(collection(db, 'scans'), {
            assetId: assetDoc.id,
            ownerId: data.userId || 'anonymous', // Store the owner's ID
            timestamp: new Date().toISOString(),
            location,
            device,
            browser,
            userAgent: ua
          });

          // Perform Redirect
          window.location.href = data.destination;
        } else {
          setError(true);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      }
    };

    handleRedirect();
  }, [slug]);

  if (error) {
    return (
      <div className="flex-col items-center justify-center bg-black text-white h-screen sans">
        <div className="center-text">
          <h1 className="text-2xl m-b-1 font-black">QR INACTIVE</h1>
          <p className="opacity-50">This dynamic link has expired or been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col items-center justify-center bg-black text-white h-screen sans">
      <div className="center-text">
        <div className="loading-spinner m-b-2 self-center" />
        <h1 className="text-xs font-black tracking-10 opacity-30">ENCRYPTING CONNECTION...</h1>
      </div>
    </div>
  );
}
