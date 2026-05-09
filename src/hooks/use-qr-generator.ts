import { useState, useEffect, useRef, useCallback } from 'react';
import { QREngine, QRType, QRConfig } from '@/lib/qr-engine';
import QRCode from 'qrcode';

export { type QRType };

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
      const config: QRConfig = {
        content: getQRContent(),
        color,
        color2,
        gradientType,
        dotStyle,
        eyeStyle,
        frame,
        logo,
        logoSize,
        logoPadding,
        logoShape
      };

      await QREngine.draw(canvasRef.current, config);
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
      } catch (err) { console.error(err); }
    },
    exportEPS: async () => {
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
        eps += `1 1 1 setrgbcolor\n0 0 ${totalSize} ${totalSize} rectfill\n`;
        eps += `${QREngine.hexToRgb(color)} setrgbcolor\n`;
        
        for (let row = 0; row < size; row++) {
          for (let col = 0; col < size; col++) {
            const isDark = modules.get ? modules.get(row, col) : modules.data[row * size + col];
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
      } catch (err) { console.error(err); }
    }
  };
}
