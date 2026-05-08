'use client';

import Link from 'next/link';
import { ChevronLeft, Mail, MessageSquare, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="flex-col items-center bg-black text-white min-h-screen p-4 sans overflow-x-hidden">
      <div className="pipeline-container max-w-2xl w-full m-y-12">
        <header className="m-b-12 flex-col gap-2">
          <Link href="/" className="text-[10px] font-black opacity-30 hover:opacity-100 transition-all flex items-center gap-2 uppercase tracking-[0.2em]">
            <ChevronLeft size={14} />
            Back to App
          </Link>
          <div className="m-t-6">
            <h1 className="font-black text-6xl tracking-tighter leading-none uppercase">Get in touch.</h1>
            <p className="opacity-40 text-sm m-t-4 max-w-md">Our support team is available 24/7 for institutional partners and Pro members.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-8 flex-col gap-6">
            <div className="w-12 h-12 bg-white flex items-center justify-center rounded-2xl rotate-3">
              <Mail className="text-black -rotate-3" size={24} />
            </div>
            <div>
              <h3 className="font-black text-xl m-b-1 uppercase tracking-tight">Email Support</h3>
              <p className="opacity-40 text-xs font-mono uppercase tracking-widest">support@loomqr.com</p>
            </div>
            <p className="opacity-60 text-sm leading-relaxed">
              For billing inquiries, technical issues, or API integration support. 
            </p>
          </div>

          <div className="glass-card p-8 flex-col gap-6">
            <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center rounded-2xl -rotate-3">
              <MessageSquare className="text-white rotate-3" size={24} />
            </div>
            <div>
              <h3 className="font-black text-xl m-b-1 uppercase tracking-tight">Enterprise</h3>
              <p className="opacity-40 text-xs font-mono uppercase tracking-widest">hello@loomqr.com</p>
            </div>
            <p className="opacity-60 text-sm leading-relaxed">
              Looking for custom volume pricing or dedicated infrastructure? Let&apos;s talk.
            </p>
          </div>
        </div>

        <div className="m-t-12 glass-card p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black tracking-widest uppercase opacity-60">Response Time: &lt; 2 Hours</span>
          </div>
          <Clock size={16} className="opacity-20" />
        </div>

        <footer className="m-t-24 p-t-6 border-t border-white border-opacity-5">
          <span className="opacity-20 text-[10px] font-black tracking-widest">© 2026 LOOM SYSTEMS</span>
        </footer>
      </div>
    </div>
  );
}
