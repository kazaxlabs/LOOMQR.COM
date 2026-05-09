'use client';

import Link from 'next/link';
import { ChevronLeft, ShieldCheck, Eye, Database, Lock } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="flex-col items-center bg-[#f8fafc] text-[#1e293b] min-h-screen p-4 sans overflow-x-hidden">
      <div className="pipeline-container max-w-3xl w-full m-y-12">
        <header className="m-b-12 flex-col gap-4">
          <Link href="/" className="text-sm font-bold text-accent flex items-center gap-2 group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <div className="m-t-4">
            <h1 className="h-xl" style={{ fontSize: '3.5rem', textAlign: 'left', margin: 0 }}>Privacy Policy</h1>
            <p className="color-muted text-sm m-t-2 font-bold uppercase tracking-wider">Version 1.0.0 // Last Updated: May 7, 2026</p>
          </div>
        </header>

        <div className="flex-col gap-6">
          <section className="glass-card p-8 flex-col gap-4">
            <div className="flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent-soft flex items-center justify-center text-accent">
                <Eye size={20} />
              </div>
              <h2 className="text-xl font-bold">1. Data Collection</h2>
            </div>
            <p className="text-sm leading-relaxed color-muted">
              We collect minimal data necessary to provide our service: email addresses for accounts, and technical metadata (IP, device type) for scan analytics to provide you with insights.
            </p>
          </section>

          <section className="glass-card p-8 flex-col gap-4">
            <div className="flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent-soft flex items-center justify-center text-accent">
                <Database size={20} />
              </div>
              <h2 className="text-xl font-bold">2. Data Usage</h2>
            </div>
            <p className="text-sm leading-relaxed color-muted">
              Your data is used strictly for account authentication, QR redirection logic, and generating the analytics insights provided in your dashboard. We use Stripe for secure billing.
            </p>
            <ul className="flex-col gap-2 text-sm color-muted list-none p-l-4">
              <li>• Account authentication</li>
              <li>• QR redirection logic</li>
              <li>• Analytics dashboard generation</li>
              <li>• Secure billing processing</li>
            </ul>
          </section>

          <section className="glass-card p-8 flex-col gap-4">
            <div className="flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent-soft flex items-center justify-center text-accent">
                <Lock size={20} />
              </div>
              <h2 className="text-xl font-bold">3. Security</h2>
            </div>
            <p className="text-sm leading-relaxed color-muted">
              We employ industry-standard encryption and security protocols to protect your data. We do not sell your personal information to third parties.
            </p>
          </section>
 
          <section className="glass-card p-8 flex-col gap-4">
            <div className="flex-row items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent-soft flex items-center justify-center text-accent">
                <ShieldCheck size={20} />
              </div>
              <h2 className="text-xl font-bold">4. Your Rights</h2>
            </div>
            <p className="text-sm leading-relaxed color-muted">
              You have the right to access, export, or delete your data at any time through the Account settings or by contacting our support team.
            </p>
          </section>
        </div>
 
        <footer className="m-t-16 p-t-8 border-t-thin border-opacity-10 flex-row items-center justify-between">
          <span className="color-muted text-xs font-bold">© 2026 Kazaxlabs</span>
        </footer>
      </div>
    </div>
  );
}
