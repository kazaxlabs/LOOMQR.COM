import { useState, useEffect, useRef, useCallback } from 'react';
import QRCode from 'qrcode';

export type QRType = 'URL' | 'WIFI' | 'PAYMENT' | 'EVENT' | 'FILE' | 'LINK_PAGE' | 'APP' | 'BOOKING' | 'VCARD' | 'MEDIA' | 'CUSTOM_PAGE' | 'MEMORIAL' | 'MENU' | 'CONTACT' | 'POLL' | 'TEXT';

export function useQRGenerator() {
  const [text, setText] = useState('');
  const [debouncedText, setDebouncedText] = useState(text);
  const [qrType, setQrType] = useState<QRType>('URL');
  const [isDynamic, setIsDynamic] = useState(false);
  const [color, setColor] = useState('#000000');
  const [color2, setColor2] = useState('#000000');
  const [gradientType, setGradientType] = useState<'NONE' | 'LINEAR' | 'RADIAL'>('NONE');
  const [dotStyle, setDotStyle] = useState<'SQUARE' | 'ROUNDED' | 'DOTS' | 'CLASSY' | 'DIAMOND'>('SQUARE');
  const [eyeStyle, setEyeStyle] = useState<'SQUARE' | 'ROUNDED' | 'CIRCLE' | 'LEAF'>('SQUARE');
  const [frame, setFrame] = useState<'NONE' | 'SCAN_ME' | 'BUBBLE' | 'CORNER'>('NONE');
  const [logo, setLogo] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(0.2);
  const [logoPadding, setLogoPadding] = useState(20);
  const [logoShape, setLogoShape] = useState<'SQUARE' | 'ROUNDED' | 'CIRCLE'>('ROUNDED');
  const [contact, setContact] = useState({ first: '', last: '', phone: '', email: '' });
  const [wifi, setWifi] = useState({ ssid: '', pass: '', encryption: 'WPA', hidden: false });
  const [appLinks, setAppLinks] = useState({ ios: '', android: '', fallback: '' });
  const [isScanning, setIsScanning] = useState(false);
  const [dynamicSlug, setDynamicSlug] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate slug when switching to dynamic
  useEffect(() => {
    if (isDynamic && !dynamicSlug) {
      setDynamicSlug(Math.random().toString(36).substring(2, 10));
    }
  }, [isDynamic, dynamicSlug]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedText(text);
    }, 300);
    return () => clearTimeout(handler);
  }, [text]);

  const getQRContent = useCallback(() => {
    let content = '';
    const urlBasedTypes = ['URL', 'PAYMENT', 'EVENT', 'FILE', 'LINK_PAGE', 'BOOKING', 'MEDIA', 'CUSTOM_PAGE', 'MEMORIAL', 'MENU', 'POLL'];
    
    if (urlBasedTypes.includes(qrType)) {
      content = isDynamic ? `${window.location.origin}/b/${dynamicSlug}` : debouncedText;
    } else if (qrType === 'TEXT') {
      content = debouncedText;
    } else if (qrType === 'CONTACT' || qrType === 'VCARD') {
      content = `BEGIN:VCARD\nVERSION:3.0\nN:${contact.last};${contact.first}\nTEL:${contact.phone}\nEMAIL:${contact.email}\nEND:VCARD`;
    } else if (qrType === 'WIFI') {
      const hiddenFlag = wifi.hidden ? 'H:true;' : '';
      const encType = wifi.encryption === 'None' ? 'nopass' : wifi.encryption;
      content = `WIFI:S:${wifi.ssid};T:${encType};P:${wifi.pass};${hiddenFlag};`;
    } else if (qrType === 'APP') {
      content = isDynamic ? `${window.location.origin}/b/${dynamicSlug}` : appLinks.fallback || appLinks.ios || appLinks.android;
    }
    return content;
  }, [qrType, isDynamic, dynamicSlug, debouncedText, contact, wifi, appLinks]);

  const generateQR = useCallback(async () => {
    if (!canvasRef.current) return;
    setIsScanning(true);
    
    try {
      const content = getQRContent();

      const canvas = canvasRef.current;
      // Ensure canvas has high-resolution dimensions for drawing
      canvas.width = 1000;
      canvas.height = 1000;
      
      const qrData = QRCode.create(content || 'Scan Me!', { errorCorrectionLevel: 'H' });
      const { modules } = qrData;
      const matrixSize = modules.size;

      // Frame & Quiet Zone Settings
      // Standard QR requires 4 modules of quiet zone.
      // We'll calculate padding based on matrixSize to guarantee this.
      const minQuietZoneModules = 4;
      const targetCellSize = Math.floor(canvas.width / (matrixSize + minQuietZoneModules * 2));
      const qrPadding = (canvas.width - (matrixSize * targetCellSize)) / 2;
      
      let qrYOffset = 0;
      let qrScale = 1;

      if (frame === 'SCAN_ME') {
        qrScale = 0.8;
        qrYOffset = -60;
      } else if (frame === 'BUBBLE') {
        qrScale = 0.75;
        qrYOffset = -40;
      }

      const drawSize = (canvas.width - qrPadding * 2) * qrScale;
      const xStart = (canvas.width - drawSize) / 2;
      const yStart = (canvas.height - drawSize) / 2 + qrYOffset;
      const cellW = drawSize / matrixSize;

      const drawEye = (x: number, y: number, style: typeof eyeStyle, size: number) => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.save();
        ctx.translate(x, y);
        
        // Outer box (7x7 modules)
        const outerSize = size * 7;
        const innerSize = size * 3;
        const middleSize = size * 5;
        
        const drawShape = (s: number, r: number, fill: boolean = true) => {
          ctx.beginPath();
          if (style === 'ROUNDED') {
            ctx.roundRect(0, 0, s, s, r);
          } else if (style === 'CIRCLE') {
            ctx.arc(s/2, s/2, s/2, 0, Math.PI * 2);
          } else if (style === 'LEAF') {
            ctx.moveTo(r, 0);
            ctx.lineTo(s - r, 0);
            ctx.quadraticCurveTo(s, 0, s, r);
            ctx.lineTo(s, s - r);
            ctx.quadraticCurveTo(s, s, s - r, s);
            ctx.lineTo(r, s);
            ctx.quadraticCurveTo(0, s, 0, s - r);
            ctx.lineTo(0, r);
            ctx.quadraticCurveTo(0, 0, r, 0);
          } else {
            ctx.rect(0, 0, s, s);
          }
          if (fill) ctx.fill();
          else ctx.stroke();
        };

        // Outer
        drawShape(outerSize, outerSize * 0.2);
        
        // Clear middle
        ctx.globalCompositeOperation = 'destination-out';
        ctx.translate(size, size);
        drawShape(middleSize, middleSize * 0.2);
        
        // Draw inner
        ctx.globalCompositeOperation = 'source-over';
        ctx.translate(size, size);
        drawShape(innerSize, innerSize * 0.2);
        
        ctx.restore();
      };

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('No 2D context found for canvas');
        return;
      }
      console.log('Context acquired');

      // Clear
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Polyfill roundRect if missing
      if (!ctx.roundRect) {
        ctx.roundRect = function(x: number, y: number, w: number, h: number, r: any) {
          let radius = 0;
          if (typeof r === 'number') {
            radius = r;
          } else if (Array.isArray(r) && r.length > 0) {
            radius = typeof r[0] === 'number' ? r[0] : 0;
          }
          
          if (w < 2 * radius) radius = w / 2;
          if (h < 2 * radius) radius = h / 2;
          
          this.beginPath();
          this.moveTo(x + radius, y);
          this.arcTo(x + w, y, x + w, y + h, radius);
          this.arcTo(x + w, y + h, x, y + h, radius);
          this.arcTo(x, y + h, x, y, radius);
          this.arcTo(x, y, x + w, y, radius);
          this.closePath();
          return this;
        };
      }

      // Draw Frame Background/Shape
      if (frame === 'SCAN_ME') {
        ctx.fillStyle = color;
        // Bottom Banner
        const bannerH = 160;
        ctx.beginPath();
        ctx.roundRect(xStart - 40, yStart - 40, drawSize + 80, drawSize + bannerH + 40, 40);
        ctx.fill();

        // White inner area for QR
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(xStart - 20, yStart - 20, drawSize + 40, drawSize + 40, 20);
        ctx.fill();

        // Text
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 80px Outfit';
        ctx.textAlign = 'center';
        ctx.fillText('Scan Me!', canvas.width / 2, yStart + drawSize + 100);
      } else if (frame === 'BUBBLE') {
        ctx.fillStyle = color;
        const pad = 80;
        ctx.beginPath();
        // Main bubble
        ctx.roundRect(xStart - pad, yStart - pad, drawSize + pad * 2, drawSize + pad * 2, 60);
        // Bubble tail
        ctx.moveTo(canvas.width / 2 - 40, yStart + drawSize + pad);
        ctx.lineTo(canvas.width / 2, yStart + drawSize + pad + 60);
        ctx.lineTo(canvas.width / 2 + 40, yStart + drawSize + pad);
        ctx.fill();

        // White inner area
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(xStart - 20, yStart - 20, drawSize + 40, drawSize + 40, 30);
        ctx.fill();
      }

      // Setup Gradient for QR
      let fillStyle: string | CanvasGradient = color;
      if (gradientType === 'LINEAR') {
        const grad = ctx.createLinearGradient(xStart, yStart, xStart + drawSize, yStart + drawSize);
        grad.addColorStop(0, color);
        grad.addColorStop(1, color2);
        fillStyle = grad;
      } else if (gradientType === 'RADIAL') {
        const grad = ctx.createRadialGradient(canvas.width/2, canvas.height/2 + qrYOffset, 0, canvas.width/2, canvas.height/2 + qrYOffset, drawSize/2);
        grad.addColorStop(0, color);
        grad.addColorStop(1, color2);
        fillStyle = grad;
      }
      ctx.fillStyle = fillStyle;

      // Draw Modules
      
      // Calculate Logo Protection Zone (in modules)
      const center = matrixSize / 2;
      const logoModules = (matrixSize * logoSize) / 2;
      // Convert logoPadding (pixels) to roughly modules
      const paddingModules = (logoPadding / cellW);
      const protectionRadius = logoModules + paddingModules;

      for (let row = 0; row < matrixSize; row++) {
        for (let col = 0; col < matrixSize; col++) {
          // Check if this module is in the "Protection Zone"
          const distRow = Math.abs(row + 0.5 - center);
          const distCol = Math.abs(col + 0.5 - center);
          
          // Skip if inside logo area (unless it's a finder pattern - though logo shouldn't hit them)
          const isInsideLogo = distRow < protectionRadius && distCol < protectionRadius;
          
          // Finder patterns check (7x7 at corners)
          const isTopLeft = row < 7 && col < 7;
          const isTopRight = row < 7 && col > matrixSize - 8;
          const isBottomLeft = row > matrixSize - 8 && col < 7;
          const isFinder = isTopLeft || isTopRight || isBottomLeft;

          // Skip drawing modules inside finders, we draw them separately
          if (isFinder) continue;

          if (isInsideLogo && logo && !isFinder) continue;

          let isDark = false;
          if (modules.data) {
             isDark = !!modules.data[row * matrixSize + col];
          } else if (modules.get) {
             isDark = !!modules.get(row, col);
          }
          
          if (isDark) {
            const x = xStart + col * cellW;
            const y = yStart + row * cellW;
            const w = cellW;
            const h = cellW;

            if (dotStyle === 'ROUNDED') {
              const r = w * 0.35;
              ctx.beginPath();
              ctx.moveTo(x + r, y);
              ctx.arcTo(x + w, y, x + w, y + h, r);
              ctx.arcTo(x + w, y + h, x, y + h, r);
              ctx.arcTo(x, y + h, x, y, r);
              ctx.arcTo(x, y, x + w, y, r);
              ctx.fill();
            } else if (dotStyle === 'DOTS') {
              ctx.beginPath();
              ctx.arc(x + w/2, y + h/2, w/3, 0, Math.PI * 2);
              ctx.fill();
            } else if (dotStyle === 'CLASSY') {
              ctx.beginPath();
              ctx.arc(x + w/2, y + h/2, w/2.2, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillRect(x + w/2 - 1, y, 2, h);
              ctx.fillRect(x, y + h/2 - 1, w, 2);
            } else if (dotStyle === 'DIAMOND') {
              ctx.beginPath();
              ctx.moveTo(x + w/2, y);
              ctx.lineTo(x + w, y + h/2);
              ctx.lineTo(x + w/2, y + h);
              ctx.lineTo(x, y + h/2);
              ctx.closePath();
              ctx.fill();
            } else {
              ctx.fillRect(x, y, w, h);
            }
          }
        }
      }

      // Draw Finder Patterns (Eyes)
      drawEye(xStart, yStart, eyeStyle, cellW);
      drawEye(xStart + (matrixSize - 7) * cellW, yStart, eyeStyle, cellW);
      drawEye(xStart, yStart + (matrixSize - 7) * cellW, eyeStyle, cellW);

      // Draw Logo if exists
      if (logo) {
        const img = new Image();
        img.src = logo;
        await new Promise((resolve) => {
          img.onload = () => {
            const lSize = drawSize * logoSize;
            const x = xStart + (drawSize - lSize) / 2;
            const y = yStart + (drawSize - lSize) / 2;
            
            // Draw white background for logo
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            const pad = logoPadding;
            const bgX = x - pad;
            const bgY = y - pad;
            const bgSize = lSize + pad * 2;
            
            if (logoShape === 'CIRCLE') {
              ctx.arc(x + lSize/2, y + lSize/2, bgSize/2, 0, Math.PI * 2);
            } else if (logoShape === 'ROUNDED') {
              ctx.roundRect(bgX, bgY, bgSize, bgSize, 20);
            } else {
              ctx.rect(bgX, bgY, bgSize, bgSize);
            }
            ctx.fill();
            
            // Clip and draw logo for circle shape
            if (logoShape === 'CIRCLE') {
              ctx.save();
              ctx.beginPath();
              ctx.arc(x + lSize/2, y + lSize/2, lSize/2, 0, Math.PI * 2);
              ctx.clip();
              ctx.drawImage(img, x, y, lSize, lSize);
              ctx.restore();
            } else {
              ctx.drawImage(img, x, y, lSize, lSize);
            }
            resolve(null);
          };
        });
      }
    } catch (err) {
      console.error('QR_RENDER_ERROR:', err);
    } finally {
      setIsScanning(false);
    }
  }, [getQRContent, frame, color, color2, gradientType, logo, logoSize, logoPadding, logoShape, dotStyle, eyeStyle]);

  useEffect(() => {
    generateQR();
  }, [generateQR]);

  return {
    text, setText,
    qrType, setQrType,
    isDynamic, setIsDynamic,
    color, setColor,
    color2, setColor2,
    gradientType, setGradientType,
    dotStyle, setDotStyle,
    eyeStyle, setEyeStyle,
    frame, setFrame,
    logo, setLogo,
    logoSize, setLogoSize,
    logoPadding, setLogoPadding,
    logoShape, setLogoShape,
    contact, setContact,
    wifi, setWifi,
    appLinks, setAppLinks,
    isScanning,
    dynamicSlug, setDynamicSlug,
    canvasRef,
    generateQR,
    exportPNG: () => {
      if (!canvasRef.current) return;
      const url = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr_code_${Date.now()}.png`;
      link.click();
    },
    exportSVG: async () => {
      const content = getQRContent();

      if (!content) return;

      try {
        const svg = await QRCode.toString(content, { 
          type: 'svg', 
          margin: 4, 
          errorCorrectionLevel: 'H',
          color: { dark: color, light: '#ffffff' } 
        });
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `qr_code_${Date.now()}.svg`;
        link.click();
      } catch (err) {
        console.error(err);
      }
    },
    exportEPS: async () => {
      // Basic EPS Generation for QR
      const content = getQRContent();

      if (!content) return;

      try {
        const qrData = QRCode.create(content, { errorCorrectionLevel: 'H' });
        const modules = qrData.modules;
        const size = modules.size;
        const margin = 4;
        const cellSize = 10;
        const totalSize = (size + margin * 2) * cellSize;

        let eps = `%!PS-Adobe-3.0 EPSF-3.0\n%%BoundingBox: 0 0 ${totalSize} ${totalSize}\n`;
        // White Background
        eps += `1 1 1 setrgbcolor\n0 0 ${totalSize} ${totalSize} rectfill\n`;
        // QR Color
        eps += `${color.startsWith('#') ? hexToRgb(color) : '0 0 0'} setrgbcolor\n`;
        
        for (let row = 0; row < size; row++) {
          for (let col = 0; col < size; col++) {
            let isDark = false;
            if (modules.data) {
              isDark = !!modules.data[row * size + col];
            } else if (modules.get) {
              isDark = !!modules.get(row, col);
            }
            
            if (isDark) {
              const x = (col + margin) * cellSize;
              const y = totalSize - (row + margin + 1) * cellSize;
              eps += `${x} ${y} ${cellSize} ${cellSize} rectfill\n`;
            }
          }
        }

        const blob = new Blob([eps], { type: 'application/postscript' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `qr_code_${Date.now()}.eps`;
        link.click();
      } catch (err) {
        console.error(err);
      }
    }
  };
}

function hexToRgb(hex: string) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16) / 255;
    g = parseInt(hex[2] + hex[2], 16) / 255;
    b = parseInt(hex[3] + hex[3], 16) / 255;
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16) / 255;
    g = parseInt(hex.slice(3, 5), 16) / 255;
    b = parseInt(hex.slice(5, 7), 16) / 255;
  }
  return `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)}`;
}
