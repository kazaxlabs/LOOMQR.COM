'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { useAssets } from '@/hooks/use-assets';
import { useQRGenerator } from '@/hooks/use-qr-generator';
import { AuthModal } from '@/components/auth/AuthModal';
import { Sidebar } from '@/components/layout/Sidebar';
import { CreateTab } from '@/components/tabs/CreateTab';
import { LibraryTab } from '@/components/tabs/LibraryTab';
import { AnalyticsTab } from '@/components/tabs/AnalyticsTab';
import { VaultTab } from '@/components/tabs/VaultTab';
import { SupportTab } from '@/components/tabs/SupportTab';
import { AccountTab } from '@/components/tabs/AccountTab';
import LandingPage from './landing/page';

export default function Home() {
  const { user, isLoggedIn, isPro, userId, loading } = useAuth();
  const { assets, saveAsset, deleteAsset, updateAsset } = useAssets();
  const qrState = useQRGenerator();

  const [activeTab, setActiveTab] = useState<'CREATE' | 'SAVED' | 'ANALYTICS' | 'VAULT' | 'HELP' | 'ACCOUNT'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab') as any;
      if (tabParam && ['CREATE', 'SAVED', 'ANALYTICS', 'VAULT', 'HELP', 'ACCOUNT'].includes(tabParam)) {
        return tabParam;
      }
    }
    return 'CREATE';
  });

  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [showLoginModal, setShowLoginModal] = useState(false);

  // Stripe Redirect Handling
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      toast.success("Welcome to Pro. Your advanced features are now active.");
      window.history.replaceState({}, '', window.location.pathname);
    } else if (params.get('canceled') === 'true') {
      toast.error('Upgrade request cancelled.');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Theme handled via manual toggle in Sidebar if needed, defaults to light

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  if (loading) {
    return (
      <div className="flex-col items-center justify-center bg-surface h-screen">
        <div className="loading-spinner" />
      </div>
    );
  }

  // Show landing page if not logged in
  if (!isLoggedIn) {
    return <LandingPage />;
  }

  return (
    <>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        theme={theme} 
        setTheme={setTheme} 
        onLoginClick={() => setShowLoginModal(true)} 
        isPro={isPro}
      />

      <main className="main-viewport">
        {activeTab === 'CREATE' && (
          <CreateTab 
            qrState={qrState}
            saveAsset={saveAsset}
            isLoggedIn={isLoggedIn}
            isPro={isPro}
            setShowLoginModal={setShowLoginModal}
          />
        )}
        
        {activeTab === 'SAVED' && (
          <LibraryTab 
            assets={assets}
            deleteAsset={deleteAsset}
            updateAsset={updateAsset}
            isLoggedIn={isLoggedIn}
            setShowLoginModal={setShowLoginModal}
          />
        )}

        {activeTab === 'ANALYTICS' && (
          <AnalyticsTab 
            assets={assets}
            isLoggedIn={isLoggedIn}
            userId={userId}
            setShowLoginModal={setShowLoginModal}
          />
        )}

        {activeTab === 'VAULT' && (
          <VaultTab 
            assets={assets}
            deleteAsset={deleteAsset}
            isLoggedIn={isLoggedIn}
            setShowLoginModal={setShowLoginModal}
          />
        )}

        {activeTab === 'HELP' && (
          <SupportTab />
        )}

        {activeTab === 'ACCOUNT' && (
          <AccountTab 
            user={user}
            isPro={isPro}
            userId={userId}
          />
        )}
      </main>

      <AuthModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  );
}
