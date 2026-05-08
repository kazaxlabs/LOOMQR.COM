import { LockedState } from '@/components/layout/LockedState';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

interface VaultTabProps {
  assets: any[];
  deleteAsset: (id: string) => Promise<void>;
  isLoggedIn: boolean;
  setShowLoginModal: (show: boolean) => void;
}

export function VaultTab({ assets, deleteAsset, isLoggedIn, setShowLoginModal }: VaultTabProps) {
  if (!isLoggedIn) {
    return <LockedState title="Security Shield" message="Log in to verify the security status of your destination links." onLogin={() => setShowLoginModal(true)} />;
  }

  const unsafeAssets = assets.filter(a => !a.isSafe);

  return (
    <div className="pipeline-container">
      <header className="m-b-6 flex-col gap-1">
        <div className="flex-row items-center gap-2 color-muted">
          <ShieldCheck size={18} />
          <span className="text-sm font-semibold">Security Shield</span>
        </div>
        <h2 className="h-lg">Security Overview</h2>
        <p className="text-sm color-muted">Every link is automatically scanned to ensure a safe experience for your users.</p>
      </header>

      <div className="flex-col gap-4">
        {unsafeAssets.length > 0 ? (
          <div className="flex-col gap-3">
            <div className="flex-row items-center gap-2 danger-text font-bold text-sm">
              <ShieldAlert size={18} />
              Potential security risks detected
            </div>
            {unsafeAssets.map((asset) => (
              <div key={asset.id} className="glass-card flex-row justify-between items-center" style={{ borderLeft: '4px solid #ef4444' }}>
                <div>
                  <div className="font-bold text-sm">{asset.text}</div>
                  <div className="text-xs danger-text">This destination link has been flagged as unsafe.</div>
                </div>
                <button onClick={() => deleteAsset(asset.id)} className="primary" style={{ background: '#ef4444', padding: '8px 16px', fontSize: '12px' }}>Remove risk</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card center-text p-8 flex-col items-center gap-4">
            <div style={{ width: '64px', height: '64px', background: 'var(--accent-soft)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
              <ShieldCheck size={32} />
            </div>
            <div>
              <h3 className="font-bold text-lg">No security issues detected</h3>
              <p className="text-sm color-muted m-t-1">All your destination links are currently verified as safe.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
