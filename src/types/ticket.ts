export type PaperSize = 'A4' | 'F4' | 'Letter' | 'A3';
export type PaperOrientation = 'portrait' | 'landscape';
export type CutLineStyle = 'dashed' | 'solid' | 'cropmarks' | 'none';
export type CouponTheme =
  | 'red-white'
  | 'blue-modern'
  | 'gold-navy'
  | 'green-vibrant'
  | 'orange-carnival'
  | 'purple-elegant'
  | 'ink-saver'
  | 'eco-outline';

export interface EventData {
  title: string;
  subtitle: string;
  organizer: string;
  date: string;
  time: string;
  location: string;
  grandPrize: string;
  price: string;
  terms: string;
  logoUrl: string | null;
  logoShape: 'square' | 'circle' | 'rounded';
  showStub: boolean; // Tear-off stub for raffle box / panitia
  stubPosition: 'left' | 'right';
  stubWidthPercent: number; // e.g., 28%
  stubFields: string[]; // e.g. ["Nama", "No. HP / WA", "Alamat / RT"]
  showBarcode: boolean;
  barcodeType: 'qr' | 'barcode';
  watermarkText: string;
  customNote: string;
}

export interface NumberingConfig {
  prefix: string;
  suffix: string;
  startNumber: number;
  totalCount: number;
  digits: number;
  step: number;
  mode: 'sequential' | 'random' | 'custom';
  customNumbers: string[];
}

export interface LayoutConfig {
  paperSize: PaperSize;
  orientation: PaperOrientation;
  columns: number;
  rows: number;
  marginMm: number;
  gapMm: number;
  cutLineStyle: CutLineStyle;
  cutLineColor: string;
  showTicketBorder: boolean;
}

export interface StyleConfig {
  theme: CouponTheme;
  fontFamily: 'sans' | 'serif' | 'mono';
  headerColor: string;
  accentColor: string;
  textColor: string;
  bgTexture: 'clean' | 'dots' | 'stripes' | 'vintage';
  numberBadgeStyle: 'solid' | 'outline' | 'ribbon';
}

export interface TicketConfig {
  event: EventData;
  numbering: NumberingConfig;
  layout: LayoutConfig;
  style: StyleConfig;
}

export interface WinnerRecord {
  id: string;
  ticketNumber: string;
  prizeName: string;
  timestamp: string;
  notes?: string;
}
