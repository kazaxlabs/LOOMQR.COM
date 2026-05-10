import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { authService } from '@/lib/services/auth.service';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeDoc: (() => void) | undefined;

    const unsubscribeAuth = authService.onAuthStateChanged((u) => {
      setUser(u);
      
      if (u) {
        const userRef = doc(db, 'users', u.uid);
        unsubscribeDoc = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setIsPro(data.tier === 'pro');
          } else {
            setIsPro(false);
          }
          setLoading(false);
        }, (error) => {
          console.error("Firestore Auth Sync Error:", error);
          setLoading(false); // Stop loading even if rule fails
        });
      } else {
        setIsPro(false);
        setLoading(false);
        if (unsubscribeDoc) unsubscribeDoc();
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  return {
    user,
    loading,
    isLoggedIn: !!user,
    isPro,
    userId: user?.uid,
    authService
  };
}
