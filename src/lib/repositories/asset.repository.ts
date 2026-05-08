import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  deleteDoc, 
  doc, 
  updateDoc,
  getDocs,
  getDoc,
  serverTimestamp,
  Firestore
} from 'firebase/firestore';
import { db } from '../firebase';
import { SavedAsset, AssetCreateDTO, AssetUpdateDTO } from '../models/asset';
import { NotFoundError } from '../utils/errors';

export class AssetRepository {
  private collectionName = 'assets';

  async create(data: AssetCreateDTO): Promise<string> {
    const docRef = await addDoc(collection(db, this.collectionName), {
      ...data,
      date: new Date().toISOString(),
      scans: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Update user activity
    if (data.userId) {
      const userRef = doc(db, 'users', data.userId);
      await updateDoc(userRef, { lastActivityAt: serverTimestamp() }).catch(() => {});
    }

    return docRef.id;
  }

  async getById(id: string): Promise<SavedAsset> {
    const docRef = doc(db, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new NotFoundError('Asset');
    }

    return { id: docSnap.id, ...docSnap.data() } as SavedAsset;
  }

  async update(id: string, updates: AssetUpdateDTO): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    // Update user activity (fetch userId first if not in updates)
    try {
      const assetSnap = await getDoc(docRef);
      if (assetSnap.exists()) {
        const userId = assetSnap.data().userId;
        if (userId) {
          const userRef = doc(db, 'users', userId);
          await updateDoc(userRef, { lastActivityAt: serverTimestamp() }).catch(() => {});
        }
      }
    } catch (e) {}
  }

  async delete(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
  }

  async listByUser(userId: string): Promise<SavedAsset[]> {
    const q = query(
      collection(db, this.collectionName),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SavedAsset));
  }

  subscribeToUserAssets(userId: string, callback: (assets: SavedAsset[]) => void) {
    const q = query(
      collection(db, this.collectionName),
      where('userId', '==', userId),
      orderBy('date', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const assets = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SavedAsset));
      callback(assets);
    });
  }
}

export const assetRepository = new AssetRepository();
