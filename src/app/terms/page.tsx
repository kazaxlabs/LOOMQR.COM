'use client';

import Link from 'next/link';
import { ChevronLeft, ShieldCheck, Scale, AlertCircle, CreditCard } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="flex-col items-center bg-[#f8fafc] text-[#1e293b] min-h-screen p-4 sans overflow-x-hidden">
      <div className="pipeline-container max-w-3xl w-full m-y-12">
        <header className="m-b-12 flex-col gap-4">
          <Link href="/" className="text-sm font-bold text-accent flex items-center gap-2 group">
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <div className="m-t-4">
            <h1 className="h-xl" style={{ fontSize: '3.5rem', textAlign: 'left', margin: 0 }}>Terms of Service</h1>
            <p className="color-muted text-sm m-t-2 font-bold uppercase tracking-wider">Version 1.0.4 // Last Updated: May 7, 2026</p>
          </div>
        </header>

        <div className="flex-col gap-6">
          <section className="glass-card p-8 flex-col gap-4">
            <h2 className="text-xl font-bold">1. Provision of Service</h2>
            <p className="text-sm leading-relaxed color-muted">
              Kazaxlabs (&quot;the Company&quot;) provides LOOM (&quot;the Service&quot;), a platform for creating and managing dynamic QR codes. By using our service, you agree to these terms. We reserve the right to modify or terminate access to the Service at any time to ensure platform integrity and security.
            </p>
          </section>
 
          <section className="glass-card p-8 flex-col gap-4">
            <h2 className="text-xl font-bold">2. User Conduct</h2>
            <p className="text-sm leading-relaxed color-muted">
              Users are prohibited from using the Service for:
            </p>
            <ul className="flex-col gap-2 text-sm color-muted list-none p-l-4">
              <li>• Distributing malware or phishing links</li>
              <li>• Hosting illegal or harmful content</li>
              <li>• Attempting to exploit or disrupt the service</li>
            </ul>
          </section>

          <section className="glass-card p-8 flex-col gap-4">
            <h2 className="text-xl font-bold">3. Payments & Subscriptions</h2>
            <p className="text-sm leading-relaxed color-muted">
              LOOM offers Starter (Free), Pro, and Business subscription tiers. By subscribing to a paid tier, you authorize Kazaxlabs to charge your payment method on a recurring basis (monthly or annually) according to your selection. 
            </p>
            <p className="text-sm leading-relaxed color-muted">
              <strong>Cancellations:</strong> You may cancel your subscription at any time via the billing portal. Access to paid features will continue until the end of your current billing period.
            </p>
            <p className="text-sm leading-relaxed color-muted">
              <strong>Refunds:</strong> All sales are final. We do not offer refunds except where required by law.
            </p>
          </section>
 
          <section className="glass-card p-8 flex-col gap-4 border-t-thin border-danger border-opacity-10">
            <h2 className="text-xl font-bold text-danger">4. Limitation of Liability</h2>
            <p className="text-sm leading-relaxed color-muted italic">
              The service is provided &quot;as is&quot;. We are not liable for any damages arising from the use of generated QR codes or service downtime.
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
