import { CouponTheme } from '../types/ticket';

export interface ThemeDefinition {
  id: CouponTheme;
  name: string;
  badgeBg: string;
  badgeText: string;
  headerBg: string;
  headerText: string;
  ticketBg: string;
  borderColor: string;
  accentColor: string;
  accentBg: string;
  stubBg: string;
  stubBorder: string;
  grandPrizeBg: string;
  grandPrizeText: string;
  pdfHeaderRgb: [number, number, number];
  pdfAccentRgb: [number, number, number];
  pdfBgRgb: [number, number, number];
  pdfStubBgRgb: [number, number, number];
  pdfTextDarkRgb: [number, number, number];
}

export const THEMES: Record<CouponTheme, ThemeDefinition> = {
  'red-white': {
    id: 'red-white',
    name: 'Merah Putih Kemerdekaan',
    badgeBg: 'bg-red-600',
    badgeText: 'text-white',
    headerBg: 'bg-red-700',
    headerText: 'text-white',
    ticketBg: 'bg-white',
    borderColor: 'border-red-400',
    accentColor: 'text-red-700',
    accentBg: 'bg-red-50',
    stubBg: 'bg-red-50/70',
    stubBorder: 'border-red-300',
    grandPrizeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    grandPrizeText: 'text-amber-900',
    pdfHeaderRgb: [185, 28, 28], // red-700
    pdfAccentRgb: [220, 38, 38], // red-600
    pdfBgRgb: [255, 255, 255],
    pdfStubBgRgb: [254, 242, 242], // red-50
    pdfTextDarkRgb: [17, 24, 39],
  },
  'blue-modern': {
    id: 'blue-modern',
    name: 'Biru Korporat Modern',
    badgeBg: 'bg-blue-600',
    badgeText: 'text-white',
    headerBg: 'bg-blue-800',
    headerText: 'text-white',
    ticketBg: 'bg-white',
    borderColor: 'border-blue-400',
    accentColor: 'text-blue-700',
    accentBg: 'bg-blue-50',
    stubBg: 'bg-slate-50',
    stubBorder: 'border-blue-200',
    grandPrizeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    grandPrizeText: 'text-amber-900',
    pdfHeaderRgb: [30, 64, 175], // blue-800
    pdfAccentRgb: [37, 99, 235], // blue-600
    pdfBgRgb: [255, 255, 255],
    pdfStubBgRgb: [248, 250, 252],
    pdfTextDarkRgb: [15, 23, 42],
  },
  'gold-navy': {
    id: 'gold-navy',
    name: 'Emas Mewah & Navy',
    badgeBg: 'bg-amber-500',
    badgeText: 'text-slate-900',
    headerBg: 'bg-slate-900',
    headerText: 'text-amber-300',
    ticketBg: 'bg-amber-50/30',
    borderColor: 'border-amber-400',
    accentColor: 'text-amber-600',
    accentBg: 'bg-amber-50',
    stubBg: 'bg-slate-900 text-white',
    stubBorder: 'border-amber-400/60',
    grandPrizeBg: 'bg-amber-400 text-slate-950 border-amber-500 font-bold',
    grandPrizeText: 'text-slate-950',
    pdfHeaderRgb: [15, 23, 42], // slate-900
    pdfAccentRgb: [217, 119, 6], // amber-600
    pdfBgRgb: [255, 251, 235],
    pdfStubBgRgb: [15, 23, 42],
    pdfTextDarkRgb: [15, 23, 42],
  },
  'green-vibrant': {
    id: 'green-vibrant',
    name: 'Hijau Segar / Sport Sehat',
    badgeBg: 'bg-emerald-600',
    badgeText: 'text-white',
    headerBg: 'bg-emerald-700',
    headerText: 'text-white',
    ticketBg: 'bg-white',
    borderColor: 'border-emerald-400',
    accentColor: 'text-emerald-700',
    accentBg: 'bg-emerald-50',
    stubBg: 'bg-emerald-50/70',
    stubBorder: 'border-emerald-200',
    grandPrizeBg: 'bg-yellow-100 text-yellow-900 border-yellow-300',
    grandPrizeText: 'text-yellow-900',
    pdfHeaderRgb: [4, 120, 87], // emerald-700
    pdfAccentRgb: [5, 150, 105], // emerald-600
    pdfBgRgb: [255, 255, 255],
    pdfStubBgRgb: [236, 253, 245],
    pdfTextDarkRgb: [6, 78, 59],
  },
  'orange-carnival': {
    id: 'orange-carnival',
    name: 'Oranye Karnaval & Bazar',
    badgeBg: 'bg-orange-600',
    badgeText: 'text-white',
    headerBg: 'bg-orange-600',
    headerText: 'text-white',
    ticketBg: 'bg-white',
    borderColor: 'border-orange-400',
    accentColor: 'text-orange-600',
    accentBg: 'bg-orange-50',
    stubBg: 'bg-orange-50',
    stubBorder: 'border-orange-200',
    grandPrizeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    grandPrizeText: 'text-amber-900',
    pdfHeaderRgb: [234, 88, 12],
    pdfAccentRgb: [249, 115, 22],
    pdfBgRgb: [255, 255, 255],
    pdfStubBgRgb: [255, 247, 237],
    pdfTextDarkRgb: [67, 20, 7],
  },
  'purple-elegant': {
    id: 'purple-elegant',
    name: 'Ungu Elegan & Festival',
    badgeBg: 'bg-purple-600',
    badgeText: 'text-white',
    headerBg: 'bg-purple-800',
    headerText: 'text-white',
    ticketBg: 'bg-white',
    borderColor: 'border-purple-400',
    accentColor: 'text-purple-700',
    accentBg: 'bg-purple-50',
    stubBg: 'bg-purple-50/60',
    stubBorder: 'border-purple-200',
    grandPrizeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    grandPrizeText: 'text-amber-900',
    pdfHeaderRgb: [107, 33, 168],
    pdfAccentRgb: [147, 51, 234],
    pdfBgRgb: [255, 255, 255],
    pdfStubBgRgb: [250, 245, 255],
    pdfTextDarkRgb: [59, 7, 100],
  },
  'ink-saver': {
    id: 'ink-saver',
    name: 'Hemat Tinta Standar (B&W)',
    badgeBg: 'bg-neutral-900',
    badgeText: 'text-white',
    headerBg: 'bg-neutral-100 border-b-2 border-neutral-800',
    headerText: 'text-neutral-950 font-black',
    ticketBg: 'bg-white',
    borderColor: 'border-neutral-900',
    accentColor: 'text-neutral-900',
    accentBg: 'bg-neutral-100',
    stubBg: 'bg-white',
    stubBorder: 'border-neutral-700',
    grandPrizeBg: 'bg-neutral-100 text-neutral-900 border-2 border-neutral-800',
    grandPrizeText: 'text-neutral-950',
    pdfHeaderRgb: [240, 240, 240],
    pdfAccentRgb: [0, 0, 0],
    pdfBgRgb: [255, 255, 255],
    pdfStubBgRgb: [255, 255, 255],
    pdfTextDarkRgb: [0, 0, 0],
  },
  'eco-outline': {
    id: 'eco-outline',
    name: 'Super Irit Tinta / Eco Outline (Hitam Putih Murni)',
    badgeBg: 'bg-white border-2 border-black',
    badgeText: 'text-black',
    headerBg: 'bg-white border-b-2 border-black',
    headerText: 'text-black font-black',
    ticketBg: 'bg-white',
    borderColor: 'border-black',
    accentColor: 'text-black',
    accentBg: 'bg-white',
    stubBg: 'bg-white',
    stubBorder: 'border-black',
    grandPrizeBg: 'bg-white text-black border border-black',
    grandPrizeText: 'text-black',
    pdfHeaderRgb: [255, 255, 255],
    pdfAccentRgb: [0, 0, 0],
    pdfBgRgb: [255, 255, 255],
    pdfStubBgRgb: [255, 255, 255],
    pdfTextDarkRgb: [0, 0, 0],
  },
};
