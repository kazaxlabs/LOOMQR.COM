'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Mail } from 'lucide-react';

const FAQS = [
  {
    q: "What is a Dynamic QR code?",
    a: "Dynamic QR codes allow you to update the destination URL even after they are printed. They also provide detailed scan performance data."
  },
  {
    q: "Are there scan limits?",
    a: "Free accounts have a monthly scan limit. Pro accounts include unlimited scans and advanced tracking capabilities."
  },
  {
    q: "Can I customize my codes?",
    a: "Yes. You can customize colors, eye shapes, and patterns, or add your own brand logo in the 'Create' tab."
  },
  {
    q: "How do I update a code?",
    a: "Navigate to your 'Library', select the code you wish to update, and enter a new destination. The change is instant."
  }
];

export function SupportTab() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="pipeline-container max-w-2xl m-x-auto">
      <header className="m-b-6 flex-col gap-2">
        <h1 className="h-lg">Support</h1>
        <div className="flex-row items-center gap-2 success-text">
          <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
          <span className="text-xs font-bold">Support channels active.</span>
        </div>
      </header>

      <div className="flex-col gap-2">
        {FAQS.map((faq, i) => (
          <div 
            key={i} 
            className={`glass-card overflow-hidden transition-all duration-500 ${openIndex === i ? 'border-opacity-100 ring-1 ring-white ring-opacity-10' : 'opacity-70 hover:opacity-100'}`}
          >
            <button 
              className="w-full p-6 flex-row justify-between items-center bg-transparent border-none text-left cursor-pointer"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <h3 className="font-bold text-sm">{faq.q}</h3>
              <div className="color-muted">
                {openIndex === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </button>
            
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === i ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="p-6 p-t-0 border-t border-black border-opacity-5">
                <p className="text-sm color-muted leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="m-t-8 p-8 glass-card flex-col items-center center-text gap-4">
        <div className="flex-col gap-1">
          <h2 className="font-bold text-xl">Require further assistance?</h2>
          <p className="text-sm color-muted">Our specialized support team is prepared to address your technical inquiries.</p>
        </div>
        
        <a 
          href="mailto:support@loomqr.com" 
          className="primary flex items-center justify-center gap-3 w-full max-w-[280px] p-4 text-sm font-bold group"
        >
          <Mail size={18} className="group-hover:scale-110 transition-transform" />
          Contact Support
        </a>
      </div>

      <footer className="m-t-12 color-muted text-[10px] center-text">
        LOOM Support
      </footer>
    </div>
  );
}
