export type QRType = 'URL' | 'WIFI' | 'PAYMENT' | 'EVENT' | 'FILE' | 'LINK_PAGE' | 'APP' | 'BOOKING' | 'VCARD' | 'MEDIA' | 'CUSTOM_PAGE' | 'MEMORIAL' | 'MENU' | 'CONTACT' | 'POLL' | 'TEXT';

export interface SavedAsset {
  id: string;
  userId: string;
  text: string;
  destination: string;
  slug?: string;
  date: string;
  type: 'Standard' | 'Dynamic';
  contentType: QRType;
  scans: number;
  isSafe: boolean;
  qrData?: string;
  color?: string;
  color2?: string;
  gradientType?: 'NONE' | 'LINEAR' | 'RADIAL';
  dotStyle?: 'SQUARE' | 'ROUNDED' | 'DOTS';
  frame?: string;
  logo?: string | null;
  logoSize?: number;
  logoPadding?: number;
  logoShape?: 'SQUARE' | 'ROUNDED' | 'CIRCLE';
}

export interface AssetCreateDTO extends Omit<SavedAsset, 'id' | 'date' | 'scans'> {
  // Fields needed to create an asset
}

export interface AssetUpdateDTO extends Partial<Omit<SavedAsset, 'id' | 'userId' | 'date'>> {
  // Fields that can be updated
}
