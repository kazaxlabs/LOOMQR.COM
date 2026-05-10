import { useState } from 'react';
import { toast } from 'sonner';
import { 
  Link as LinkIcon, Wifi, CreditCard, CalendarDays, FileText, 
  Smartphone, CalendarRange, Image as ImageIcon, 
  LayoutTemplate, Box, Menu as MenuIcon, Phone, BarChart2, Type, ChevronDown 
} from 'lucide-react';
import { useQRGenerator } from '@/hooks/use-qr-generator';
import { CheckoutButton } from '@/components/CheckoutButton';

export const QR_TYPES_DATA = [
  { id: 'URL', label: 'Link', icon: LinkIcon },
  { id: 'WIFI', label: 'WiFi', icon: Wifi },
  { id: 'TEXT', label: 'Text', icon: Type },
  { id: 'MEDIA', label: 'Media', icon: ImageIcon },
  { id: 'APP', label: 'App', icon: Smartphone },
  { id: 'PAYMENT', label: 'Payment', icon: CreditCard },
  { id: 'EVENT', label: 'Event RSVP', icon: CalendarDays },
  { id: 'FILE', label: 'File', icon: FileText },
  { id: 'LINK_PAGE', label: 'Link page', icon: LayoutTemplate },
  { id: 'BOOKING', label: 'Booking', icon: CalendarRange },
  { id: 'VCARD', label: 'vCard', icon: Phone },
  { id: 'CUSTOM_PAGE', label: 'Custom page', icon: Box },
  { id: 'MEMORIAL', label: 'Memorial', icon: Box },
  { id: 'MENU', label: 'Menu', icon: MenuIcon },
  { id: 'CONTACT', label: 'Contact', icon: Phone },
  { id: 'POLL', label: 'Poll', icon: BarChart2 },
] as const;

interface CreateTabProps {
  qrState: ReturnType<typeof useQRGenerator>;
  saveAsset: (data: any) => Promise<any>;
  isLoggedIn: boolean;
  isPro?: boolean;
  setShowLoginModal: (show: boolean) => void;
}

export function CreateTab({ qrState, saveAsset, isLoggedIn, isPro, setShowLoginModal }: CreateTabProps) {
  const [showAllTypes, setShowAllTypes] = useState(false);

  const {
    text, setText, qrType, setQrType, isDynamic, setIsDynamic,
    color, setColor, color2, setColor2, gradientType, setGradientType,
    dotStyle, setDotStyle, eyeStyle, setEyeStyle, frame, setFrame, logo, setLogo,
    logoSize, setLogoSize, logoPadding, setLogoPadding, logoShape, setLogoShape,
    contact, setContact, wifi, setWifi, appLinks, setAppLinks, isScanning, 
    dynamicSlug, canvasRef, exportPNG, exportSVG
  } = qrState;

  const handleSave = async () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    try {
      const qrData = canvasRef.current?.toDataURL('image/png');
      await saveAsset({
        text: text,
        destination: text,
        slug: isDynamic ? dynamicSlug : undefined,
        type: isDynamic ? 'Dynamic' : 'Standard',
        contentType: qrType,
        qrData,
        color: color,
        color2: color2,
        gradientType: gradientType,
        dotStyle: dotStyle,
        frame: frame,
        logo: logo,
        logoSize: logoSize,
        logoPadding: logoPadding,
        logoShape: logoShape
      });
      toast.success('QR Code saved to library!');
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to save QR Code.');
    }
  };

  return (
    <div className="pipeline-container">
      <header className="flex-col m-b-6">
        <h1 className="h-lg">Generate QR Code</h1>
        <p className="text-sm color-muted m-t-1">Establish high-performance digital bridges with precision configuration.</p>
      </header>


      {/* STEP 01: SOURCE */}
      <section className="glass-card">
        <div className="step-header">
          <span className="feature-tag">Step 01</span>
          <h2 className="h-lg" style={{ fontSize: '1.5rem' }}>Source Configuration</h2>
        </div>

        
        <div className="flex-col gap-4 relative">
          <div className="flex-row gap-2 overflow-x-auto p-b-2 no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
            {QR_TYPES_DATA.slice(0, 8).map(t => (
              <button 
                key={t.id} 
                className={`top-type-btn shrink-0 ${qrType === t.id ? 'active' : ''}`} 
                style={{ minWidth: '100px' }}
                onClick={() => { setQrType(t.id as any); setShowAllTypes(false); }}
              >
                <t.icon size={14} />
                <span className="text-mini tracking-widest uppercase font-black">{t.label}</span>
              </button>
            ))}
            <button 
              className={`top-type-btn shrink-0 ${showAllTypes ? 'active' : ''}`} 
              style={{ minWidth: '100px' }}
              onClick={() => setShowAllTypes(!showAllTypes)}
            >
              <span className="text-mini tracking-widest uppercase font-black">More</span>
              <ChevronDown size={14} style={{ transform: showAllTypes ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
            </button>
          </div>

          {showAllTypes && (
            <div className="type-popup grid-4">
              {QR_TYPES_DATA.map(t => (
                <button 
                  key={t.id}
                  className={`type-btn ${qrType === t.id ? 'active' : ''}`}
                  onClick={() => {
                    setQrType(t.id as any);
                    setShowAllTypes(false);
                  }}
                >
                  <t.icon size={14} className="icon" />
                  <span className="text-mini tracking-widest uppercase font-black">{t.label}</span>
                </button>
              ))}
            </div>
          )}

          <div className="m-t-2">
            {['URL', 'PAYMENT', 'EVENT', 'FILE', 'LINK_PAGE', 'BOOKING', 'MEDIA', 'CUSTOM_PAGE', 'MEMORIAL', 'MENU', 'POLL'].includes(qrType) && (
               <div className="flex-col gap-4">
                  <div className="toggle-group" style={{ background: 'var(--accent-soft)', padding: '4px', borderRadius: '12px', display: 'flex', gap: '4px' }}>
                    <button 
                      className="nav-item" 
                      style={{ flex: 1, background: !isDynamic ? '#fff' : 'transparent', color: !isDynamic ? 'var(--accent)' : 'var(--text-muted)', boxShadow: !isDynamic ? 'var(--shadow-sm)' : 'none', borderRadius: '8px' }} 
                      onClick={() => setIsDynamic(false)}
                    >
                      Static Code
                    </button>
                    <button 
                      className="nav-item" 
                      style={{ flex: 1, background: isDynamic ? '#fff' : 'transparent', color: isDynamic ? 'var(--accent)' : 'var(--text-muted)', boxShadow: isDynamic ? 'var(--shadow-sm)' : 'none', borderRadius: '8px' }} 
                      onClick={() => { if (isPro) setIsDynamic(true); }}
                    >
                      Dynamic Code {!isPro && <span className="premium-badge m-l-1">PRO</span>}
                    </button>
                  </div>
                  <input type="text" className="input-field" placeholder="https://example.com" value={text} onChange={(e) => setText(e.target.value)} />
               </div>
            )}
            {qrType === 'TEXT' && <input type="text" className="input-field" placeholder="Enter message" value={text} onChange={(e) => setText(e.target.value)} />}
            {qrType === 'CONTACT' && (
              <div className="grid-2 gap-4">
                <input className="input-field" placeholder="First Name" value={contact.first} onChange={e => setContact({...contact, first: e.target.value})} />
                <input className="input-field" placeholder="Last Name" value={contact.last} onChange={e => setContact({...contact, last: e.target.value})} />
                <input className="input-field col-span-2" placeholder="Phone" value={contact.phone} onChange={e => setContact({...contact, phone: e.target.value})} />
                <input className="input-field col-span-2" placeholder="Email" value={contact.email} onChange={e => setContact({...contact, email: e.target.value})} />
              </div>
            )}
            {qrType === 'WIFI' && (
              <div className="flex-col gap-4">
                <input className="input-field" placeholder="Network Name (SSID)" value={wifi.ssid} onChange={e => setWifi({...wifi, ssid: e.target.value})} />
                <input className="input-field" type="password" placeholder="Password" value={wifi.pass} onChange={e => setWifi({...wifi, pass: e.target.value})} />
                <div className="grid-2 gap-4">
                  <select className="input-field" title="Encryption Type" value={wifi.encryption} onChange={e => setWifi({...wifi, encryption: e.target.value})}>
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="None">None</option>
                  </select>
                  <label className="flex-row items-center gap-2 text-mini font-black tracking-widest uppercase cursor-pointer p-4 bg-surface-raised rounded-md border border-white border-opacity-5">
                    <input type="checkbox" checked={wifi.hidden} onChange={e => setWifi({...wifi, hidden: e.target.checked})} />
                    Hidden
                  </label>
                </div>
              </div>
            )}
            {qrType === 'APP' && (
              <div className="flex-col gap-4">
                <input className="input-field" placeholder="Apple App Store URL" value={appLinks.ios} onChange={e => setAppLinks({...appLinks, ios: e.target.value})} />
                <input className="input-field" placeholder="Google Play Store URL" value={appLinks.android} onChange={e => setAppLinks({...appLinks, android: e.target.value})} />
                <input className="input-field" placeholder="Fallback Web URL" value={appLinks.fallback} onChange={e => setAppLinks({...appLinks, fallback: e.target.value})} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* STEP 02: VISUALS */}
      <section className="md-grid-side">
        <div className="glass-card flex-col gap-8">
          <div className="step-header">
            <span className="feature-tag">Step 02</span>
            <h2 className="h-lg" style={{ fontSize: '1.5rem' }}>Visual Identity</h2>
          </div>

          
          <div className="flex-col gap-6">
            {/* Dot Style */}
            <div className="flex-col gap-2">
              <div className="text-xs font-bold color-muted">QR Pattern</div>
              <div className="flex-row gap-2">
                {(['SQUARE', 'ROUNDED', 'DOTS', 'CLASSY', 'DIAMOND'] as const).map(s => (
                  <button key={s} className={`secondary-pill ${dotStyle === s ? 'active-pill' : ''}`} onClick={() => setDotStyle(s)}>{s}</button>
                ))}
              </div>
            </div>

            {/* Eye Style */}
            <div className="flex-col gap-2">
              <div className="text-xs font-bold color-muted">Eye Shape</div>
              <div className="flex-row gap-2">
                {(['SQUARE', 'ROUNDED', 'CIRCLE', 'LEAF'] as const).map(s => (
                  <button key={s} className={`secondary-pill ${eyeStyle === s ? 'active-pill' : ''}`} onClick={() => setEyeStyle(s)}>{s}</button>
                ))}
              </div>
            </div>

            {/* Frame */}
            <div className="flex-col gap-2">
              <div className="text-xs font-bold color-muted">Add a frame</div>
              <div className="flex-row gap-2">
                {['NONE', 'SCAN_ME', 'BUBBLE'].map(f => (
                  <button key={f} className={`secondary-pill ${frame === f ? 'active-pill' : ''}`} onClick={() => setFrame(f as any)}>{f}</button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="flex-col gap-2">
              <div className="flex-row items-center justify-between">
                <div className="text-xs font-bold color-muted">Colors</div>
                <div className="flex-row gap-2">
                  {(['NONE', 'LINEAR', 'RADIAL'] as const).map(g => (
                    <button key={g} className={`secondary-pill ${gradientType === g ? 'active-pill' : ''}`} onClick={() => setGradientType(g)}>{g}</button>
                  ))}
                </div>
              </div>
              <div className="flex-row items-center gap-4 p-4 bg-surface-raised rounded-md border border-white border-opacity-5">
                <input type="color" title="Primary Color" value={color} onChange={e => setColor(e.target.value)} className="color-input" />
                {gradientType !== 'NONE' && (
                  <>
                    <div className="opacity-20">→</div>
                    <input type="color" title="Secondary Color" value={color2} onChange={e => setColor2(e.target.value)} className="color-input" />
                  </>
                )}
                <div className="flex-row gap-2 m-l-auto">
                  {['#000000', '#0071e3', '#bf5af2', '#ff9f0a', '#30d158', '#ff375f'].map(c => (
                    <button 
                      key={c} 
                      onClick={() => setColor(c)} 
                      title={`Color ${c}`}
                      className={`color-preset ${color === c ? 'active' : ''}`} 
                      style={{ '--preset-bg': c } as React.CSSProperties} 
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Branding */}
            <div className="p-t-4 border-t-thin">
              <div className="flex-row items-center justify-between m-b-4">
                <div className="text-xs font-bold color-muted">Logo</div>
                {!isPro && <span className="premium-badge">PRO</span>}
              </div>
              
              {isPro ? (
                <div className="flex-col gap-4">
                  <input type="file" id="logo-upload" hidden accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (rev) => setLogo(rev.target?.result as string);
                      reader.readAsDataURL(file);
                    }
                  }} />
                  <label htmlFor="logo-upload" className="primary" style={{ background: 'var(--accent-soft)', color: 'var(--accent)', cursor: 'pointer', width: '100%' }}>
                    {logo ? 'Update brand image' : 'Upload brand image'}
                  </label>
                  
                  {logo && (
                    <div className="flex-col gap-6 m-t-4">
                      <div className="flex-row justify-between items-center">
                        <span className="text-xs font-bold color-muted">Logo Shape</span>
                        <div className="flex-row gap-2">
                          {(['SQUARE', 'ROUNDED', 'CIRCLE'] as const).map(s => (
                            <button key={s} className={`secondary-pill ${logoShape === s ? 'active-pill' : ''}`} onClick={() => setLogoShape(s)}>{s}</button>
                          ))}
                        </div>
                      </div>
                      <div className="flex-row justify-between items-center">
                        <span className="text-xs font-bold color-muted">Logo Size</span>
                        <input type="range" title="Logo Size" min="0.1" max="0.4" step="0.01" value={logoSize} onChange={e => setLogoSize(parseFloat(e.target.value))} className="range-input" />
                      </div>
                      <div className="flex-row justify-between items-center">
                        <span className="text-xs font-bold color-muted">Logo Margin</span>
                        <input type="range" title="Logo Padding" min="0" max="40" step="1" value={logoPadding} onChange={e => setLogoPadding(parseInt(e.target.value))} className="range-input" />
                      </div>
                      <button className="nav-link text-xs danger-text m-t-2" onClick={() => setLogo(null)}>Remove brand image</button>
                    </div>
                  )}
                </div>
              ) : isLoggedIn ? (
                <CheckoutButton 
                  priceId={process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || ''} 
                  tier="pro"
                  buttonText="Upgrade to Pro" 
                  mode="subscription"
                  className="primary w-full text-xs" 
                />
              ) : (
                <button className="primary w-full text-xs" onClick={() => setShowLoginModal(true)}>Log in to use Logos</button>
              )}
            </div>
          </div>
        </div>

        <div className="sticky-preview flex-col items-center gap-6">
          <div className="glass-card flex-col items-center justify-center w-full" style={{ padding: '3rem' }}>
            <div className="qr-preview-box" style={{ width: '280px', height: '280px' }}>

            <canvas 
              ref={canvasRef} 
              width={1000}
              height={1000}
              className="qr-canvas"
              style={{ imageRendering: 'pixelated' } as React.CSSProperties}
            />
            {isScanning && <div className="scan-line" />}
          </div>
          <div className="flex-col items-center gap-1 m-t-4">
            <p className="text-xs color-muted font-bold uppercase tracking-widest">Live Preview</p>
            <p className="text-mini color-muted opacity-60">Synchronized with current configuration</p>
          </div>

        </div>
      </div>
    </section>




      {/* STEP 03: DEPLOY */}
      <section className="glass-card">
        <div className="step-header">
          <span className="feature-tag">Step 03</span>
          <h2 className="h-lg" style={{ fontSize: '1.5rem' }}>Deployment</h2>
        </div>

        <div className="flex-col gap-4">
          <button className="primary" style={{ padding: '1.25rem' }} onClick={handleSave} disabled={isScanning}>
            {isScanning ? 'Processing...' : 'Commit to Library'}
          </button>

          <div className="grid-2 gap-4">
            <button className="nav-item justify-center" style={{ border: '1px solid var(--border)' }} onClick={() => exportPNG()} disabled={isScanning}>Download PNG</button>
            <button className="nav-item justify-center" style={{ border: '1px solid var(--border)' }} onClick={() => exportSVG()} disabled={isScanning}>Download SVG</button>
          </div>
        </div>
      </section>
    </div>
  );
}
