'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, increment, collection, addDoc } from 'firebase/firestore';

export default function Bridge() {
  const { id } = useParams();
  const router = useRouter();
  const [error, setError] = useState(false);

  useEffect(() => {
    const handleRedirect = async () => {
      if (!id) return;
      
      try {
        const assetRef = doc(db, 'assets', id as string);
        const assetSnap = await getDoc(assetRef);

        if (assetSnap.exists()) {
          const data = assetSnap.data();
          
          // Increment Scans
          await updateDoc(assetRef, {
            scans: increment(1)
          });

          // Log Scan (Mock Geo for now, but real time)
          await addDoc(collection(db, 'scans'), {
            assetId: id,
            timestamp: new Date().toISOString(),
            location: ['Montreal, CA', 'New York, US', 'London, UK', 'Tokyo, JP'][Math.floor(Math.random() * 4)]
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
  }, [id]);

  if (error) {
    return (
      <div className="flex-col items-center justify-center bg-black text-white h-screen sans">
        <div className="center-text">
          <h1 className="text-2xl m-b-1">404 Not Found</h1>
          <p className="opacity-50">The requested QR code is inactive.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col items-center justify-center bg-black text-white h-screen sans">
      <div className="center-text">
        <h1 className="text-sm font-black tracking-10">REDIRECTING...</h1>
      </div>
    </div>
  );
}
