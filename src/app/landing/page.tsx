'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { 
  QrCode, 
  Zap,
  Shield,
  BarChart3,
  Globe,
  Layers,
  Monitor,
  ArrowRight,
  Check,
} from 'lucide-react';

/* ─── Structured Data ──────────────────────────────────────────────── */

const schemaWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.loomqr.com/#website",
  "url": "https://www.loomqr.com",
  "name": "LOOM",
  "description": "Free dynamic QR code generator with real-time analytics, custom branding, and unlimited scan tracking.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://www.loomqr.com/login"
    },
    "query-input": "required name=search_term_string"
  }
};

const schemaSoftwareApp = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": "https://www.loomqr.com/#app",
  "name": "LOOM QR Code Generator",
  "url": "https://www.loomqr.com",
  "applicationCategory": "BusinessApplication",
  "applicationSubCategory": "QR Code Generator",
  "operatingSystem": "Web, iOS, Android",
  "description": "Create, customize, and track dynamic QR codes. Update redirect destinations in real-time, analyze scan analytics by device and location, and export print-ready files.",
  "offers": [
    {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "name": "Starter Plan",
      "description": "Free forever for individuals. Includes 3 dynamic QR codes."
    },
    {
      "@type": "Offer",
      "price": "12.00",
      "priceCurrency": "USD",
      "name": "Pro Plan",
      "description": "Advanced tracking and unlimited scans for growing brands."
    },
    {
      "@type": "Offer",
      "price": "39.00",
      "priceCurrency": "USD",
      "name": "Business Plan",
      "description": "Institutional grade features for teams and agencies."
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "312",
    "bestRating": "5",
    "worstRating": "1"
  },
  "featureList": [
    "Dynamic QR code generation with real-time redirect updates",
    "Scan analytics by device, location, and time",
    "Custom brand colors, logo embedding, and dot styles",
    "Multi-format export: PNG (300 DPI) and SVG vector",
    "QR code library and organizational management",
    "Enterprise-grade URL safety scanning",
    "Supports URL, WiFi, vCard, payment, event, and file QR types"
  ]
};

const schemaOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://www.loomqr.com/#organization",
  "name": "LOOM",
  "url": "https://www.loomqr.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://www.loomqr.com/images/dashboard.png",
    "width": 1200,
    "height": 630
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "support@loomqr.com",
    "contactType": "customer support",
    "availableLanguage": "English"
  },
  "sameAs": []
};

const schemaBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.loomqr.com"
    }
  ]
};

const schemaFAQ = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.loomqr.com/#webpage",
  "url": "https://www.loomqr.com",
  "name": "LOOM — Free Dynamic QR Code Generator & Manager",
  "isPartOf": { "@id": "https://www.loomqr.com/#website" },
  "about": { "@id": "https://www.loomqr.com/#app" },
  "description": "Create, customize, and track dynamic QR codes with LOOM.",
  "speakable": {
    "@type": "SpeakableSpecification",
    "cssSelector": ["#hero-heading", "#how-it-works-heading", "#features-heading"]
  }
};

/* ─── FAQ Data ─────────────────────────────────────────────────────── */

const faqs = [
  {
    q: "What is a dynamic QR code?",
    a: "A dynamic QR code contains a short redirect URL that you can update at any time without changing the printed code. Unlike static QR codes, dynamic codes let you point to a new destination, track how many times the code was scanned, and see where scans came from — all without reprinting."
  },
  {
    q: "Is LOOM free to use?",
    a: "Yes. LOOM offers a free plan that lets you create and download custom QR codes immediately with no account required. Pro users get advanced features including dynamic redirect updates, detailed scan analytics, and unlimited QR code storage."
  },
  {
    q: "How do I create a QR code with LOOM?",
    a: "Enter your destination URL, choose your QR code type (URL, WiFi, vCard, payment, or event), customize colors and add your logo, then download your code as a high-resolution PNG or SVG. The entire process takes under 60 seconds."
  },
  {
    q: "Can I edit a QR code after printing it?",
    a: "Yes — with dynamic QR codes on LOOM Pro, you can change the destination URL any time from your dashboard. The printed code never changes; only where it redirects. This is ideal for packaging, signage, and campaigns that evolve over time."
  },
  {
    q: "What QR code file formats does LOOM export?",
    a: "LOOM exports print-ready PNG files at 300 DPI resolution and scalable SVG vector files. Both formats are suitable for any size, from business cards to billboard-scale print production."
  },
  {
    q: "Does LOOM track QR code scans?",
    a: "Yes. LOOM Pro tracks every scan with data including total scan count, scan date and time, device type (mobile vs desktop), and browser. Use this data to measure campaign performance and optimize future placements."
  },
];

import { CheckoutButton } from '@/components/CheckoutButton';
import { useAuth } from '@/hooks/use-auth';

/* ─── Component ────────────────────────────────────────────────────── */

export default function LandingPage() {
  const { isLoggedIn } = useAuth();
  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'annual'>('monthly');
  const [country, setCountry] = React.useState('US');

  React.useEffect(() => {
    // Basic Canada detection
    const isCanada = navigator.language.includes('CA') || 
                     Intl.DateTimeFormat().resolvedOptions().timeZone.includes('Toronto') ||
                     Intl.DateTimeFormat().resolvedOptions().timeZone.includes('Vancouver') ||
                     Intl.DateTimeFormat().resolvedOptions().timeZone.includes('Montreal');
    
    if (isCanada) {
      setCountry('CA');
    }
  }, []);

  const formatPrice = (price: number) => {
    if (price === 0) return "$0";
    const currency = country === 'CA' ? 'CAD' : 'USD';
    const locale = country === 'CA' ? 'en-CA' : 'en-US';
    return new Intl.NumberFormat(locale, { 
      style: 'currency', 
      currency: currency,
      maximumFractionDigits: 0
    }).format(price);
  };

  const tiers = [
    {
      plan: "Starter",
      price: 0,
      desc: "For individuals and side projects.",
      features: [
        "3 Dynamic QR Codes",
        "500 Scans / month",
        "Custom Design Studio",
        "PNG & SVG Export",
        "Basic Analytics",
      ],
      cta: "Get Started Free",
      accent: false,
    },
    {
      plan: "Pro",
      price: billingCycle === 'monthly' ? 12 : 10,
      sub: billingCycle === 'annual' ? "Billed annually" : "per month",
      desc: "Perfect for growing brands and creators.",
      features: [
        "100 Dynamic QR Codes",
        "Unlimited Scans",
        "Advanced Analytics (Geo, Device)",
        "Remove LOOM Branding",
        "Bulk Generation",
        "Priority Email Support",
      ],
      cta: "Go Pro",
      accent: true,
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID
    },
    {
      plan: "Business",
      price: billingCycle === 'monthly' ? 39 : 32,
      sub: billingCycle === 'annual' ? "Billed annually" : "per month",
      desc: "Institutional grade for teams and agencies.",
      features: [
        "Unlimited Dynamic QR Codes",
        "Full Analytics Export (CSV)",
        "Custom Domain Support",
        "Team Management (3 seats)",
        "White-label Bridge Pages",
        "API Access (Coming Soon)",
        "24/7 Dedicated Support",
      ],
      cta: "Contact Sales",
      accent: false,
      priceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID
    }
  ];

  return (
    <>
      {/* Structured Data — one script block per schema type */}
      <Script id="schema-website" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaWebSite) }} />
      <Script id="schema-app" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaSoftwareApp) }} />
      <Script id="schema-org" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrganization) }} />
      <Script id="schema-breadcrumb" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />
      <Script id="schema-webpage" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFAQ) }} />

      <div className="landing-wrapper">

        {/* ── Navigation ─────────────────────────────────────────────── */}
        <nav className="nav-container" aria-label="Main navigation">
          <div className="nav-content">
            <Link href="/" className="nav-logo" aria-label="LOOM home">
              <div style={{ width: '32px', height: '32px', background: 'var(--accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <QrCode size={20} aria-hidden="true" />
              </div>
              LOOM
            </Link>
            <div className="nav-links">
              <Link href="/#how-it-works" className="nav-link">How it works</Link>
              <Link href="/#features" className="nav-link">Features</Link>
              <Link href="/#faq" className="nav-link">FAQ</Link>
              <Link href="/login" className="nav-link">Log in</Link>
              <Link href="/login" className="primary">Get Started Free</Link>
            </div>
          </div>
        </nav>

        {/* ── Hero ───────────────────────────────────────────────────── */}
        <section className="landing-section" style={{ paddingTop: '160px' }} aria-labelledby="hero-heading">
          <div className="hero-glow" aria-hidden="true" />
          <div style={{ zIndex: 10, maxWidth: '900px' }}>
            <h1 id="hero-heading" className="h-xl">
              The Next Generation <br />
              of Digital Connectivity
            </h1>
            <p className="p-lg" style={{ margin: '0 auto 2rem auto' }}>
              LOOM is a free QR code generator built for teams that need more than a static image. 
              Create trackable, editable dynamic QR codes in under 60 seconds — customize the design, 
              monitor every scan, and update destinations without reprinting.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/login" className="primary" style={{ padding: '1.25rem 2.5rem' }}>
                Create Your First QR Code Free <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} aria-hidden="true" />
              </Link>
              <Link href="/#how-it-works" className="nav-item" style={{ border: '1px solid var(--border)', padding: '12px 24px' }}>
                See how it works
              </Link>
            </div>
          </div>
        </section>

        {/* ── Dashboard Mockup ────────────────────────────────────────── */}
        <section className="section" style={{ padding: '0 2rem 100px 2rem' }} aria-label="LOOM dashboard preview">
          <div className="glass-card" style={{ padding: '0.75rem', maxWidth: '1000px', width: '100%', borderRadius: '24px' }}>
            <div style={{ position: 'relative', width: '100%', height: '0', paddingBottom: '56.25%', borderRadius: '16px', overflow: 'hidden', background: '#0a0a1a' }}>
              <Image
                src="/images/dashboard.png"
                alt="LOOM QR code generator dashboard — dark interface showing QR editor with live preview, color customization, and scan analytics"
                fill
                style={{ objectFit: 'cover' }}
                priority
                sizes="(max-width: 768px) 100vw, 1000px"
              />
            </div>
          </div>
        </section>

        {/* ── How It Works ────────────────────────────────────────────── */}
        <section id="how-it-works" className="landing-section" style={{ background: 'var(--accent-soft)', borderRadius: '64px', margin: '0 1.5rem' }} aria-labelledby="how-it-works-heading">
          <div style={{ maxWidth: '1200px', width: '100%' }}>
            <div style={{ marginBottom: '60px' }}>
              <span className="feature-tag">3-step process</span>
              <h2 id="how-it-works-heading" className="h-lg">How to create a QR code with LOOM</h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '1rem', maxWidth: '600px' }}>
                No design skills or technical knowledge required. Go from URL to print-ready QR code in under 60 seconds.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {[
                {
                  step: "01",
                  title: "Enter your destination URL",
                  desc: "Paste any link — a website, app store page, file download, payment form, or social profile. LOOM supports 16 QR code content types.",
                  detail: "Supports: URL, WiFi, vCard, payment, event, file, menu, and more"
                },
                {
                  step: "02",
                  title: "Customize your QR code design",
                  desc: "Apply your brand colors, embed your logo, choose dot and eye styles, and preview changes live. No design tools needed.",
                  detail: "Custom colors, logo upload, gradient fills, dot & eye styles"
                },
                {
                  step: "03",
                  title: "Download and deploy anywhere",
                  desc: "Export a 300 DPI PNG for print or an SVG vector for digital. Both formats scale without quality loss — from business cards to billboards.",
                  detail: "Formats: PNG (300 DPI), SVG vector — both free to download"
                }
              ].map((item, i) => (
                <div key={i} className="glass-card" style={{ textAlign: 'left', background: '#fff' }}>
                  <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--accent)', opacity: 0.1, marginBottom: '-1.5rem' }} aria-hidden="true">{item.step}</div>
                  <h3 className="h-lg" style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1rem' }}>{item.desc}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 700, opacity: 0.8 }}>{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features Grid ───────────────────────────────────────────── */}
        <section id="features" className="section" aria-labelledby="features-heading">
          <div style={{ maxWidth: '1200px', width: '100%' }}>
            <div style={{ marginBottom: '60px' }}>
              <span className="feature-tag">Platform capabilities</span>
              <h2 id="features-heading" className="h-lg">Everything you need to manage QR codes</h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '1rem', maxWidth: '600px' }}>
                Built for individuals, marketing teams, and enterprises that need reliable, trackable QR infrastructure.
              </p>
            </div>

            <div className="bento-grid">
              {[
                {
                  icon: Zap,
                  title: "Instant QR Code Generation",
                  desc: "Generate a fully custom QR code in seconds with live preview. Paste your URL and your code is ready — no signup required to try it."
                },
                {
                  icon: BarChart3,
                  title: "Real-Time Scan Analytics",
                  desc: "Track every scan with device type, geographic location, browser, and timestamp. Understand which campaigns and placements drive the most engagement."
                },
                {
                  icon: Shield,
                  title: "Safe URL Scanning",
                  desc: "Every QR code destination is scanned for malware and phishing before activation. Protect your audience and your brand reputation."
                },
                {
                  icon: Globe,
                  title: "Dynamic Redirect Updates",
                  desc: "Update your QR code destination any time from your dashboard — without reprinting. Point the same printed code to a new offer, page, or campaign."
                },
                {
                  icon: Layers,
                  title: "Centralized QR Library",
                  desc: "Store, search, and manage all your QR codes in one dashboard. Filter by type, date, or scan count. Edit destinations directly from the library."
                },
                {
                  icon: Monitor,
                  title: "Print-Ready & Digital Export",
                  desc: "Download 300 DPI PNG files for offset or digital print, and SVG vectors for web and large-format. Every export is production quality."
                }
              ].map((feature, i) => (
                <div key={i} className="glass-card" style={{ textAlign: 'left' }}>
                  <div className="bento-icon" aria-hidden="true">
                    <feature.icon size={24} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>{feature.title}</h3>
                  <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Feature image showcase */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
              <div className="glass-card" style={{ padding: 0, overflow: 'hidden', borderRadius: '20px' }}>
                <div style={{ padding: '1.5rem 1.5rem 0 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <BarChart3 size={16} style={{ color: 'var(--accent)' }} aria-hidden="true" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent)' }}>Scan Analytics</span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>See exactly who scanned your code, when, and where</h3>
                </div>
                <div style={{ position: 'relative', width: '100%', height: '220px', overflow: 'hidden' }}>
                  <Image
                    src="/images/feature-analytics.png"
                    alt="LOOM scan analytics dashboard showing line chart with scan activity, total scans, mobile percentage, and active code metrics"
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'top' }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>

              <div className="glass-card" style={{ padding: 0, overflow: 'hidden', borderRadius: '20px' }}>
                <div style={{ padding: '1.5rem 1.5rem 0 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Monitor size={16} style={{ color: 'var(--accent)' }} aria-hidden="true" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent)' }}>Design Studio</span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Custom colors, dot styles, and logo embedding — all live</h3>
                </div>
                <div style={{ position: 'relative', width: '100%', height: '220px', overflow: 'hidden' }}>
                  <Image
                    src="/images/feature-customization.png"
                    alt="LOOM QR code design studio showing color palette picker, dot style options, and live QR code preview with logo embedding"
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'top' }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Plan Comparison ─────────────────────────────────────────── */}
        <section id="pricing" className="section" style={{ padding: '80px 2rem' }} aria-labelledby="pricing-heading">
          <div style={{ maxWidth: '1100px', width: '100%' }}>
            <div style={{ marginBottom: '64px', textAlign: 'center' }}>
              <span className="feature-tag">Institutional Pricing</span>
              <h2 id="pricing-heading" className="h-lg">Built for scale. Priced for value.</h2>
              
              {/* Billing Toggle */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '1rem', 
                marginTop: '2rem' 
              }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: billingCycle === 'monthly' ? 'var(--text)' : 'var(--text-muted)' }}>Monthly</span>
                <button 
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                  style={{
                    width: '52px',
                    height: '28px',
                    borderRadius: '100px',
                    background: 'var(--accent)',
                    padding: '4px',
                    position: 'relative',
                    border: 'none',
                    cursor: 'pointer',
                    transition: '0.3s ease'
                  }}
                  aria-label={`Switch to ${billingCycle === 'monthly' ? 'annual' : 'monthly'} billing`}
                >
                  <div style={{
                    width: '20px',
                    height: '20px',
                    background: '#fff',
                    borderRadius: '50%',
                    position: 'absolute',
                    left: billingCycle === 'monthly' ? '4px' : '28px',
                    top: '4px',
                    transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: billingCycle === 'annual' ? 'var(--text)' : 'var(--text-muted)' }}>Annual</span>
                  <span style={{ 
                    fontSize: '11px', 
                    fontWeight: 800, 
                    color: '#fff', 
                    background: '#10b981', 
                    padding: '2px 8px', 
                    borderRadius: '100px',
                    textTransform: 'uppercase'
                  }}>Save 20%</span>
                </div>
              </div>
            </div>

            <div className="pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              {tiers.map((tier, i) => (
                <div key={i} className={`glass-card ${tier.accent ? 'pricing-card-accent' : ''}`} style={{ 
                  background: tier.accent ? 'var(--accent)' : '#fff', 
                  border: tier.accent ? 'none' : '1px solid var(--border)',
                  padding: '3rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  transform: (tier.accent && typeof window !== 'undefined' && window.innerWidth > 768) ? 'scale(1.05)' : undefined,
                  zIndex: tier.accent ? 1 : 0,
                  boxShadow: tier.accent ? '0 20px 40px rgba(79, 70, 229, 0.15)' : undefined
                }}>
                  <div style={{ marginBottom: '2rem' }}>
                    <div style={{ 
                      fontWeight: 900, 
                      fontSize: '0.85rem', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.1em', 
                      color: tier.accent ? 'rgba(255,255,255,0.7)' : 'var(--accent)',
                      marginBottom: '0.5rem'
                    }}>{tier.plan}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
                      <div style={{ fontSize: '3rem', fontWeight: 900, color: tier.accent ? '#fff' : 'var(--text)' }}>{formatPrice(tier.price)}</div>
                      {tier.price !== 0 && (
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: tier.accent ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)' }}>/mo</div>
                      )}
                    </div>
                    {tier.sub && (
                      <div style={{ fontSize: '0.8rem', fontWeight: 500, color: tier.accent ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)', marginTop: '0.25rem' }}>{tier.sub}</div>
                    )}
                  </div>
                  <p style={{ 
                    color: tier.accent ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)', 
                    marginBottom: '2rem', 
                    fontSize: '0.95rem',
                    lineHeight: '1.6'
                  }}>{tier.desc}</p>
                  <ul style={{ listStyle: 'none', padding: 0, marginBottom: '3rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                    {tier.features.map((f, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.9rem', color: tier.accent ? '#fff' : 'var(--text)' }}>
                        <Check size={16} style={{ color: tier.accent ? '#fff' : 'var(--accent)', flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  {isLoggedIn && tier.priceId ? (
                    <CheckoutButton 
                      priceId={tier.priceId} 
                      tier={tier.plan.toLowerCase()}
                      buttonText={tier.cta}
                      mode="subscription"
                      className="primary w-full"
                      style={{ 
                        background: tier.accent ? '#fff' : 'var(--text)', 
                        color: tier.accent ? 'var(--accent)' : '#fff', 
                        textAlign: 'center', 
                        display: 'block',
                        padding: '1.1rem',
                        fontSize: '1rem',
                        fontWeight: 700
                      }}
                    />
                  ) : (
                    <Link href="/login" className="primary w-full" style={{ 
                      background: tier.accent ? '#fff' : 'var(--text)', 
                      color: tier.accent ? 'var(--accent)' : '#fff', 
                      textAlign: 'center', 
                      display: 'block',
                      padding: '1.1rem',
                      fontSize: '1rem',
                      fontWeight: 700
                    }}>
                      {tier.cta}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ Section ─────────────────────────────────────────────── */}
        <section id="faq" className="section" style={{ padding: '80px 2rem', background: 'var(--accent-soft)', borderRadius: '64px', margin: '0 2rem' }} aria-labelledby="faq-heading">
          <div style={{ maxWidth: '800px', width: '100%' }}>
            <div style={{ marginBottom: '48px' }}>
              <span className="feature-tag">Common questions</span>
              <h2 id="faq-heading" className="h-lg">Frequently asked questions about QR codes</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {faqs.map((faq, i) => (
                <div key={i} className="glass-card" style={{ background: '#fff', textAlign: 'left' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text)' }}>{faq.q}</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ───────────────────────────────────────────────── */}
        <section className="section" style={{ padding: '100px 2rem 160px 2rem' }} aria-labelledby="cta-heading">
          <div className="glass-card" style={{ maxWidth: '800px', width: '100%', padding: '5rem', textAlign: 'center', background: 'var(--accent)', color: '#fff', border: 'none' }}>
            <h2 id="cta-heading" className="h-lg" style={{ color: '#fff', marginBottom: '1.5rem' }}>
              Start generating QR codes for free
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '3rem', fontSize: '1.125rem', lineHeight: '1.7' }}>
              Join thousands of creators, marketers, and businesses using LOOM to bridge physical and digital — no credit card required.
            </p>
            <Link href="/login" className="primary" style={{ background: '#fff', color: 'var(--accent)', padding: '1.25rem 3rem', fontSize: '1.1rem' }}>
              Create Your Free QR Code <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* ── Footer ──────────────────────────────────────────────────── */}
        <footer style={{ padding: '80px 2rem', borderTop: '1px solid var(--border)', background: '#fff' }} aria-label="Site footer">
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '3rem' }}>
            <div>
              <Link href="/" className="nav-logo" style={{ marginBottom: '1.5rem' }} aria-label="LOOM home">
                <div style={{ width: '24px', height: '24px', background: 'var(--accent)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  <QrCode size={14} aria-hidden="true" />
                </div>
                LOOM
              </Link>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '250px', lineHeight: '1.6' }}>
                The free dynamic QR code generator for teams that need tracking, flexibility, and speed.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '12px', color: 'var(--text)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Product</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <Link href="/#how-it-works" className="nav-link" style={{ fontSize: '14px' }}>How it works</Link>
                  <Link href="/#features" className="nav-link" style={{ fontSize: '14px' }}>Features</Link>
                  <Link href="/#faq" className="nav-link" style={{ fontSize: '14px' }}>FAQ</Link>
                  <Link href="/login" className="nav-link" style={{ fontSize: '14px' }}>Log In</Link>
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '12px', color: 'var(--text)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Legal</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <Link href="/terms" className="nav-link" style={{ fontSize: '14px' }}>Terms of Service</Link>
                  <Link href="/privacy" className="nav-link" style={{ fontSize: '14px' }}>Privacy Policy</Link>
                  <Link href="mailto:support@loomqr.com" className="nav-link" style={{ fontSize: '14px' }}>Contact Support</Link>
                </div>
              </div>
            </div>
          </div>
          <div style={{ maxWidth: '1200px', margin: '60px auto 0 auto', paddingTop: '30px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-muted)', flexWrap: 'wrap', gap: '1rem' }}>
            <span>© 2026 Kazaxlabs. All rights reserved.</span>
            <span>Free QR Code Generator — Dynamic, Trackable, Customizable</span>
          </div>
        </footer>

      </div>
    </>
  );
}
