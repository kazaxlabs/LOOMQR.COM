import { useState } from 'react';
import Image from 'next/image';
import { CalendarDays, BarChart2, Hash, ExternalLink, Trash2, Edit3, X, Check } from 'lucide-react';
import { LockedState } from '@/components/layout/LockedState';

interface LibraryTabProps {
  assets: any[];
  deleteAsset: (id: string) => Promise<void>;
  updateAsset: (id: string, data: any) => Promise<void>;
  isLoggedIn: boolean;
  setShowLoginModal: (show: boolean) => void;
}

export function LibraryTab({ assets, deleteAsset, updateAsset, isLoggedIn, setShowLoginModal }: LibraryTabProps) {
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
  const [editDestination, setEditDestination] = useState('');

  const handleUpdateAsset = async (id: string) => {
    try {
      await updateAsset(id, { 
        destination: editDestination,
        text: editDestination 
      });
      setEditingAssetId(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isLoggedIn) {
    return <LockedState title="Library Locked" message="Log in to see your saved QR codes." onLogin={() => setShowLoginModal(true)} />;
  }

  return (
    <div className="pipeline-container animate-fade-in p-4">
      <header className="flex-col m-b-6">
        <div className="flex-row items-center gap-2 color-muted m-b-1">
          <Hash size={14} />
          <span className="text-xs font-bold uppercase tracking-widest">Inventory</span>
        </div>
        <h2 className="h-lg">My QR Codes</h2>
        <p className="text-sm color-muted m-t-1">Monitor and manage your active digital bridges.</p>
      </header>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {assets.length > 0 ? assets.map((asset) => (
          <div key={asset.id} className="glass-card flex-col p-4 gap-4 relative overflow-hidden group">

            <div className="flex-row items-center justify-between">
              <span className={`px-2 py-0-5 text-xs font-bold rounded-full ${asset.isSafe ? 'success-text' : 'danger-text'}`} style={{ background: asset.isSafe ? 'var(--success-soft)' : 'var(--danger-soft)' }}>
                {asset.type === 'Dynamic' ? 'Dynamic' : 'Static'}
              </span>
              <div className="flex-row gap-2">
                {asset.type === 'Dynamic' && (
                  <button 
                    onClick={() => {
                      setEditingAssetId(asset.id);
                      setEditDestination(asset.destination);
                    }} 
                    className="p-1-5 glass-card-hover rounded-4 transition-all"
                    title="Change Target URL"
                  >
                    <Edit3 size={14} />
                  </button>
                )}
                <button 
                  onClick={() => deleteAsset(asset.id)} 
                  className="p-2 color-muted hover:color-danger transition-all"
                  title="Remove Code"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="flex-row gap-4 items-start">
              {asset.qrData && (
                <div className="p-2 bg-white rounded-4 shrink-0 shadow-sm border border-black border-opacity-5">
                  <img src={asset.qrData} alt="QR Code" width={100} height={100} className="qr-image-small block" />
                </div>
              )}
              
              <div className="flex-col gap-2 min-w-0 flex-1">
                <div className="flex-col gap-0-5">
                  <div className="font-bold text-sm truncate">{asset.text}</div>
                  <div className="flex-row items-center gap-1 opacity-50">
                    <ExternalLink size={10} />
                    <div className="text-xs color-muted truncate">
                      {asset.type === 'Dynamic' && asset.slug ? `${typeof window !== 'undefined' ? window.location.hostname : 'loomqr.com'}/b/${asset.slug} → ` : ''}
                      {asset.destination}
                    </div>
                  </div>
                </div>

                <div className="flex-row items-center gap-3 m-t-auto p-t-2 border-t-thin border-opacity-10">
                  <div className="flex-row items-center gap-1 opacity-40">
                    <CalendarDays size={12} />
                    <span className="text-mini font-bold">{new Date(asset.createdAt).toLocaleDateString()}</span>
                  </div>
                  {asset.scans !== undefined && (
                    <div className="flex-row items-center gap-1">
                      <BarChart2 size={12} className="success-text" />
                      <span className="text-mini font-black success-text uppercase">{asset.scans} scans</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {editingAssetId === asset.id && asset.type === 'Dynamic' && (
              <div className="m-t-2 p-3 bg-foreground bg-opacity-5 border border-accent border-opacity-20 flex-col gap-2">
                <div className="flex-row items-center justify-between">
                  <span className="text-xs font-bold color-muted">Updating destination</span>
                  <button onClick={() => setEditingAssetId(null)} className="opacity-50 hover:opacity-100" aria-label="Cancel editing" title="Cancel">
                    <X size={14} />
                  </button>
                </div>
                <div className="flex-row gap-2">
                  <input 
                    type="text" 
                    className="input-field text-xs" 
                    placeholder="New Target URL"
                    value={editDestination} 
                    onChange={e => setEditDestination(e.target.value)} 
                    autoFocus
                  />
                  <button className="primary p-2 flex shrink-0 items-center justify-center" onClick={() => handleUpdateAsset(asset.id)} aria-label="Confirm update" title="Update">
                    <Check size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )) : (
          <div className="col-span-2 flex-col items-center justify-center p-12 border border-dashed color-muted opacity-50 gap-4" style={{ borderRadius: '24px' }}>
            <Hash size={32} />
            <span className="text-sm font-bold">No active QR codes detected. Generate a new bridge to begin.</span>
          </div>

        )}
      </div>
    </div>
  );
}

