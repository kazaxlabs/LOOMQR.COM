import { 
  collection, doc, setDoc, updateDoc, deleteDoc, 
  getDoc, query, where, onSnapshot, Unsubscribe,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { QRConfig } from '@/lib/qr-engine';

export interface QRAsset {
  id: string;
  userId: string;
  name: string;
  type: 'Static' | 'Dynamic';
  config: QRConfig;
  shortUrl?: string;
  createdAt: any;
  updatedAt: any;
}

/**
 * DEEP MODULE: Assets
 * Centralized logic for QR asset lifecycle (Create, Read, Update, Delete).
 * Handles Firestore synchronization and data normalization.
 */
export const Assets = {
  /**
   * Saves a new QR asset to Firestore.
   */
  async create(userId: string, name: string, type: 'Static' | 'Dynamic', config: QRConfig): Promise<string> {
    const assetRef = doc(collection(db, 'assets'));
    const assetId = assetRef.id;

    const data: Partial<QRAsset> = {
      userId,
      name,
      type,
      config,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    if (type === 'Dynamic') {
      data.shortUrl = Math.random().toString(36).substring(2, 10);
    }

    await setDoc(assetRef, data);
    return assetId;
  },

  /**
   * Updates an existing asset.
   */
  async update(assetId: string, changes: Partial<QRAsset>): Promise<void> {
    const assetRef = doc(db, 'assets', assetId);
    await updateDoc(assetRef, {
      ...changes,
      updatedAt: serverTimestamp()
    });
  },

  /**
   * Deletes an asset.
   */
  async delete(assetId: string): Promise<void> {
    await deleteDoc(doc(db, 'assets', assetId));
  },

  /**
   * Subscribes to all assets for a user.
   */
  subscribeToUserAssets(userId: string, onData: (assets: QRAsset[]) => void): Unsubscribe {
    const q = query(
      collection(db, 'assets'),
      where('userId', '==', userId)
    );

    return onSnapshot(q, (snapshot) => {
      const assets = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as QRAsset[];
      onData(assets);
    });
  }
};
