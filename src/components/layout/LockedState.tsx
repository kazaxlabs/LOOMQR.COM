import { QrCode } from 'lucide-react';

export function LockedState({ title, message, onLogin }: { title: string, message: string, onLogin: () => void }) {
  return (
    <div className="pipeline-container center-text" style={{ padding: '80px 2rem' }}>
      <div className="glass-card flex-col items-center gap-6" style={{ padding: '4rem' }}>
        <div style={{ width: '64px', height: '64px', background: 'var(--accent-soft)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
          <QrCode size={32} />
        </div>
        <div className="flex-col gap-2">
          <h2 className="h-lg">{title}</h2>
          <p className="p-lg" style={{ margin: '0 auto' }}>{message}</p>
        </div>
        <button className="primary" style={{ padding: '1rem 3rem' }} onClick={onLogin}>
          Get Started
        </button>
      </div>
    </div>
  );
}
