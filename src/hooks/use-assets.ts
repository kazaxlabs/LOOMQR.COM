import { useState, useEffect } from 'react';
import { SavedAsset } from '@/lib/models/asset';
import { assetRepository } from '@/lib/repositories/asset.repository';
import { useAuth } from './use-auth';

export function useAssets() {
  const { userId } = useAuth();
  const [assets, setAssets] = useState<SavedAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [prevUserId, setPrevUserId] = useState(userId);

  // Handle reset and loading trigger when userId changes (render-phase update)
  if (userId !== prevUserId) {
    setPrevUserId(userId);
    setAssets([]);
    setLoading(!!userId); // Loading if we have a user to fetch for
  }

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = assetRepository.subscribeToUserAssets(userId, (newAssets) => {
      setAssets(newAssets);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const saveAsset = async (assetData: any) => {
    if (!userId) throw new Error('Authentication required');
    return await assetRepository.create({ ...assetData, userId });
  };

  const deleteAsset = async (assetId: string) => {
    return await assetRepository.delete(assetId);
  };

  const updateAsset = async (assetId: string, updates: any) => {
    return await assetRepository.update(assetId, updates);
  };

  return {
    assets,
    loading,
    error,
    saveAsset,
    deleteAsset,
    updateAsset
  };
}
