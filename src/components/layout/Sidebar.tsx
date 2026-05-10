'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { CheckoutButton } from '@/components/CheckoutButton';
import { 
  Plus, 
  Library, 
  BarChart2, 
  Shield, 
  HelpCircle, 
  LogOut, 
  Sun, 
  Moon,
  ChevronRight,
  QrCode,
  User
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'CREATE' | 'SAVED' | 'ANALYTICS' | 'VAULT' | 'HELP' | 'ACCOUNT';
  setActiveTab: (tab: 'CREATE' | 'SAVED' | 'ANALYTICS' | 'VAULT' | 'HELP' | 'ACCOUNT') => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  onLoginClick: () => void;
  isPro?: boolean;
}

export function Sidebar({ activeTab, setActiveTab, theme, setTheme, onLoginClick, isPro }: SidebarProps) {
  const { user, authService, isLoggedIn } = useAuth();

  const navItems = [
    { id: 'CREATE', label: 'Create', icon: Plus },
    { id: 'SAVED', label: 'My QR Codes', icon: Library },
    { id: 'ANALYTICS', label: 'Analytics', icon: BarChart2 },
    { id: 'VAULT', label: 'Security', icon: Shield },
    { id: 'ACCOUNT', label: 'Account', icon: User },
    { id: 'HELP', label: 'Support', icon: HelpCircle },
  ] as const;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <QrCode size={24} strokeWidth={2.5} />
        <span>LOOM</span>
      </div>

      
      <nav className="nav-item-container">
        {navItems.map((item) => (
          <button 
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`} 
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon size={18} strokeWidth={2.5} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        {isLoggedIn ? (
          <div className="user-profile-card">
            <div className="flex items-center gap-3">
              <div className={`avatar ${isPro ? 'avatar-pro' : ''}`}>
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-col min-w-0">
                <div className="flex items-center gap-1">
                  <span className="user-email truncate">{user?.email}</span>
                  {isPro && <span className="premium-badge">PRO</span>}
                </div>
                <button className="sign-out-btn" onClick={() => authService.logout()}>
                  <LogOut size={12} />
                  Log Out
                </button>
              </div>
            </div>
            {!isPro && (
              <div className="m-t-1">
                <CheckoutButton 
                  priceId={process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || ''} 
                  tier="pro"
                  buttonText="Upgrade to Pro" 
                  mode="subscription"
                  className="primary w-full text-xs p-2" 
                />
              </div>
            )}
          </div>
        ) : (
          <button className="primary w-full m-b-2" onClick={onLoginClick}>
            Log In
          </button>
        )}
        
        <button 
          className="theme-toggle-btn" 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          <div className="m-l-auto">
            <ChevronRight size={12} opacity={0.3} />
          </div>
        </button>

        <div className="legal-links">
          <Link href="/terms">Terms</Link>
          <div className="dot-separator" />
          <Link href="/privacy">Privacy</Link>
        </div>
      </div>
    </aside>
  );
}
