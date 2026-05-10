'use client';

import { 
  Plus, 
  Library, 
  BarChart2, 
  Shield, 
  User,
  QrCode,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface MobileNavProps {
  activeTab: 'CREATE' | 'SAVED' | 'ANALYTICS' | 'VAULT' | 'HELP' | 'ACCOUNT';
  setActiveTab: (tab: 'CREATE' | 'SAVED' | 'ANALYTICS' | 'VAULT' | 'HELP' | 'ACCOUNT') => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  isPro?: boolean;
}

export function MobileNav({ activeTab, setActiveTab, theme, setTheme, isPro }: MobileNavProps) {
  const { authService } = useAuth();

  const navItems = [
    { id: 'CREATE', label: 'Create', icon: Plus },
    { id: 'SAVED', label: 'Library', icon: Library },
    { id: 'ANALYTICS', label: 'Stats', icon: BarChart2 },
    { id: 'VAULT', label: 'Vault', icon: Shield },
    { id: 'ACCOUNT', label: 'Account', icon: User },
  ] as const;

  return (
    <>
      {/* Top Header */}
      <header className="mobile-header">
        <div className="flex items-center gap-2">
          <QrCode size={20} className="text-accent" />
          <span className="font-bold tracking-tight text-sm">LOOM</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full bg-surface-raised border border-border"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          {isPro && <span className="premium-badge">PRO</span>}
        </div>
      </header>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`bottom-nav-item ${activeTab === item.id ? 'active' : ''}`}
          >
            <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}
