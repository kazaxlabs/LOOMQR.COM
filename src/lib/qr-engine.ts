import QRCode from 'qrcode';

export type QRType = 'URL' | 'WIFI' | 'PAYMENT' | 'EVENT' | 'FILE' | 'LINK_PAGE' | 'APP' | 'BOOKING' | 'VCARD' | 'MEDIA' | 'CUSTOM_PAGE' | 'MEMORIAL' | 'MENU' | 'CONTACT' | 'POLL' | 'TEXT';

export interface QRConfig {
  content: string;
  color: string;
  color2: string;
  gradientType: 'NONE' | 'LINEAR' | 'RADIAL';
  dotStyle: 'SQUARE' | 'ROUNDED' | 'DOTS' | 'CLASSY' | 'DIAMOND';
  eyeStyle: 'SQUARE' | 'ROUNDED' | 'CIRCLE' | 'LEAF';
  frame: 'NONE' | 'SCAN_ME' | 'BUBBLE' | 'CORNER';
  logo?: string | null;
  logoSize: number;
  logoPadding: number;
  logoShape: 'SQUARE' | 'ROUNDED' | 'CIRCLE';
}

/**
 * DEEP MODULE: QREngine
 * High-leverage interface for generating and rendering complex QR codes.
 * Implementation is isolated from UI state.
 */
export const QREngine = {
  /**
   * Draws a QR code to a canvas with full styling.
   */
  async draw(canvas: HTMLCanvasElement, config: QRConfig): Promise<void> {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No 2D context found');

    // High-res setup
    canvas.width = 1000;
    canvas.height = 1000;

    const qrData = QRCode.create(config.content || 'Scan Me!', { errorCorrectionLevel: 'H' });
    const { modules } = qrData;
    const matrixSize = modules.size;

    // Geometry calculations
    const minQuietZoneModules = 4;
    const targetCellSize = Math.floor(canvas.width / (matrixSize + minQuietZoneModules * 2));
    const qrPadding = (canvas.width - (matrixSize * targetCellSize)) / 2;
    
    let qrYOffset = 0;
    let qrScale = 1;

    if (config.frame === 'SCAN_ME') {
      qrScale = 0.8;
      qrYOffset = -60;
    } else if (config.frame === 'BUBBLE') {
      qrScale = 0.75;
      qrYOffset = -40;
    }

    const drawSize = (canvas.width - qrPadding * 2) * qrScale;
    const xStart = (canvas.width - drawSize) / 2;
    const yStart = (canvas.height - drawSize) / 2 + qrYOffset;
    const cellW = drawSize / matrixSize;

    // Polfill roundRect
    this._polyfill(ctx);

    // 1. Clear & Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Frame
    this._drawFrame(ctx, config, xStart, yStart, drawSize, canvas.width, canvas.height);

    // 3. QR Content
    this._applyGradient(ctx, config, xStart, yStart, drawSize, canvas.width, canvas.height, qrYOffset);
    this._drawModules(ctx, config, modules, matrixSize, xStart, yStart, cellW, drawSize);

    // 4. Finder Patterns (Eyes)
    this._drawEye(ctx, xStart, yStart, config.eyeStyle, cellW);
    this._drawEye(ctx, xStart + (matrixSize - 7) * cellW, yStart, config.eyeStyle, cellW);
    this._drawEye(ctx, xStart, yStart + (matrixSize - 7) * cellW, config.eyeStyle, cellW);

    // 5. Logo
    if (config.logo) {
      await this._drawLogo(ctx, config, xStart, yStart, drawSize);
    }
  },

  /**
   * Internal drawing helpers (Implementation details hidden from interface)
   */
  _drawEye(ctx: CanvasRenderingContext2D, x: number, y: number, style: QRConfig['eyeStyle'], size: number) {
    ctx.save();
    ctx.translate(x, y);
    const outerSize = size * 7;
    const innerSize = size * 3;
    const middleSize = size * 5;
    
    const drawShape = (s: number, r: number, fill: boolean = true) => {
      ctx.beginPath();
      if (style === 'ROUNDED') ctx.roundRect(0, 0, s, s, r);
      else if (style === 'CIRCLE') ctx.arc(s/2, s/2, s/2, 0, Math.PI * 2);
      else if (style === 'LEAF') {
        ctx.moveTo(r, 0); ctx.lineTo(s - r, 0); ctx.quadraticCurveTo(s, 0, s, r);
        ctx.lineTo(s, s - r); ctx.quadraticCurveTo(s, s, s - r, s);
        ctx.lineTo(r, s); ctx.quadraticCurveTo(0, s, 0, s - r);
        ctx.lineTo(0, r); ctx.quadraticCurveTo(0, 0, r, 0);
      } else ctx.rect(0, 0, s, s);
      if (fill) ctx.fill();
      else ctx.stroke();
    };

    drawShape(outerSize, outerSize * 0.2);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.translate(size, size);
    drawShape(middleSize, middleSize * 0.2);
    ctx.globalCompositeOperation = 'source-over';
    ctx.translate(size, size);
    drawShape(innerSize, innerSize * 0.2);
    ctx.restore();
  },

  _drawFrame(ctx: CanvasRenderingContext2D, config: QRConfig, xStart: number, yStart: number, drawSize: number, width: number, height: number) {
    if (config.frame === 'SCAN_ME') {
      ctx.fillStyle = config.color;
      const bannerH = 160;
      ctx.beginPath();
      ctx.roundRect(xStart - 40, yStart - 40, drawSize + 80, drawSize + bannerH + 40, 40);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(xStart - 20, yStart - 20, drawSize + 40, drawSize + 40, 20);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 80px Outfit';
      ctx.textAlign = 'center';
      ctx.fillText('Scan Me!', width / 2, yStart + drawSize + 100);
    } else if (config.frame === 'BUBBLE') {
      ctx.fillStyle = config.color;
      const pad = 80;
      ctx.beginPath();
      ctx.roundRect(xStart - pad, yStart - pad, drawSize + pad * 2, drawSize + pad * 2, 60);
      ctx.moveTo(width / 2 - 40, yStart + drawSize + pad);
      ctx.lineTo(width / 2, yStart + drawSize + pad + 60);
      ctx.lineTo(width / 2 + 40, yStart + drawSize + pad);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(xStart - 20, yStart - 20, drawSize + 40, drawSize + 40, 30);
      ctx.fill();
    }
  },

  _applyGradient(ctx: CanvasRenderingContext2D, config: QRConfig, xStart: number, yStart: number, drawSize: number, width: number, height: number, qrYOffset: number) {
    let fillStyle: string | CanvasGradient = config.color;
    if (config.gradientType === 'LINEAR') {
      const grad = ctx.createLinearGradient(xStart, yStart, xStart + drawSize, yStart + drawSize);
      grad.addColorStop(0, config.color);
      grad.addColorStop(1, config.color2);
      fillStyle = grad;
    } else if (config.gradientType === 'RADIAL') {
      const grad = ctx.createRadialGradient(width/2, height/2 + qrYOffset, 0, width/2, height/2 + qrYOffset, drawSize/2);
      grad.addColorStop(0, config.color);
      grad.addColorStop(1, config.color2);
      fillStyle = grad;
    }
    ctx.fillStyle = fillStyle;
  },

  _drawModules(ctx: CanvasRenderingContext2D, config: QRConfig, modules: any, matrixSize: number, xStart: number, yStart: number, cellW: number, drawSize: number) {
    const center = matrixSize / 2;
    const logoModules = (matrixSize * config.logoSize) / 2;
    const paddingModules = (config.logoPadding / cellW);
    const protectionRadius = logoModules + paddingModules;

    for (let row = 0; row < matrixSize; row++) {
      for (let col = 0; col < matrixSize; col++) {
        const distRow = Math.abs(row + 0.5 - center);
        const distCol = Math.abs(col + 0.5 - center);
        const isInsideLogo = distRow < protectionRadius && distCol < protectionRadius;
        
        const isFinder = (row < 7 && col < 7) || (row < 7 && col > matrixSize - 8) || (row > matrixSize - 8 && col < 7);
        if (isFinder) continue;
        if (isInsideLogo && config.logo) continue;

        let isDark = modules.get ? modules.get(row, col) : modules.data[row * matrixSize + col];
        
        if (isDark) {
          const x = xStart + col * cellW;
          const y = yStart + row * cellW;
          const w = cellW;
          const h = cellW;

          if (config.dotStyle === 'ROUNDED') {
            const r = w * 0.35;
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, r);
            ctx.fill();
          } else if (config.dotStyle === 'DOTS') {
            ctx.beginPath(); ctx.arc(x + w/2, y + h/2, w/3, 0, Math.PI * 2); ctx.fill();
          } else if (config.dotStyle === 'CLASSY') {
            ctx.beginPath(); ctx.arc(x + w/2, y + h/2, w/2.2, 0, Math.PI * 2); ctx.fill();
            ctx.fillRect(x + w/2 - 1, y, 2, h); ctx.fillRect(x, y + h/2 - 1, w, 2);
          } else if (config.dotStyle === 'DIAMOND') {
            ctx.beginPath(); ctx.moveTo(x + w/2, y); ctx.lineTo(x + w, y + h/2); ctx.lineTo(x + w/2, y + h); ctx.lineTo(x, y + h/2); ctx.closePath(); ctx.fill();
          } else {
            ctx.fillRect(x, y, w, h);
          }
        }
      }
    }
  },

  async _drawLogo(ctx: CanvasRenderingContext2D, config: QRConfig, xStart: number, yStart: number, drawSize: number) {
    const img = new Image();
    img.src = config.logo!;
    await new Promise((resolve) => {
      img.onload = () => {
        const lSize = drawSize * config.logoSize;
        const x = xStart + (drawSize - lSize) / 2;
        const y = yStart + (drawSize - lSize) / 2;
        
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        const pad = config.logoPadding;
        const bgX = x - pad;
        const bgY = y - pad;
        const bgSize = lSize + pad * 2;
        
        if (config.logoShape === 'CIRCLE') ctx.arc(x + lSize/2, y + lSize/2, bgSize/2, 0, Math.PI * 2);
        else if (config.logoShape === 'ROUNDED') ctx.roundRect(bgX, bgY, bgSize, bgSize, 20);
        else ctx.rect(bgX, bgY, bgSize, bgSize);
        ctx.fill();
        
        if (config.logoShape === 'CIRCLE') {
          ctx.save(); ctx.beginPath(); ctx.arc(x + lSize/2, y + lSize/2, lSize/2, 0, Math.PI * 2);
          ctx.clip(); ctx.drawImage(img, x, y, lSize, lSize); ctx.restore();
        } else ctx.drawImage(img, x, y, lSize, lSize);
        resolve(null);
      };
    });
  },

  _polyfill(ctx: CanvasRenderingContext2D) {
    if (!ctx.roundRect) {
      ctx.roundRect = function(x: number, y: number, w: number, h: number, r: any) {
        let radius = typeof r === 'number' ? r : (Array.isArray(r) ? r[0] : 0);
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
  },

  hexToRgb(hex: string) {
    let r = 0, g = 0, b = 0;
    const h = hex.replace('#', '');
    if (h.length === 3) {
      r = parseInt(h[0] + h[0], 16) / 255;
      g = parseInt(h[1] + h[1], 16) / 255;
      b = parseInt(h[2] + h[2], 16) / 255;
    } else if (h.length === 6) {
      r = parseInt(h.slice(0, 2), 16) / 255;
      g = parseInt(h.slice(2, 4), 16) / 255;
      b = parseInt(h.slice(4, 6), 16) / 255;
    }
    return `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)}`;
  }
};
