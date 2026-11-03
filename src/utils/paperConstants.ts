import { PaperSize, PaperOrientation } from '../types/ticket';

export interface PaperDimension {
  name: string;
  widthMm: number;
  heightMm: number;
  description: string;
}

export const PAPER_DIMENSIONS: Record<PaperSize, PaperDimension> = {
  A4: {
    name: 'A4',
    widthMm: 210,
    heightMm: 297,
    description: 'Standar Internasional (210 x 297 mm)',
  },
  F4: {
    name: 'F4 / Folio',
    widthMm: 215,
    heightMm: 330,
    description: 'Kertas Folio / HVS Percetakan & Fotokopi (215 x 330 mm)',
  },
  Letter: {
    name: 'Letter (Quarto)',
    widthMm: 215.9,
    heightMm: 279.4,
    description: 'Standar US / Kuarto (215.9 x 279.4 mm)',
  },
  A3: {
    name: 'A3',
    widthMm: 297,
    heightMm: 420,
    description: 'Ukuran Besar / Cetak Digital Offset (297 x 420 mm)',
  },
};

export function getPaperSizeMm(size: PaperSize, orientation: PaperOrientation) {
  const paper = PAPER_DIMENSIONS[size];
  if (orientation === 'landscape') {
    return {
      width: Math.max(paper.widthMm, paper.heightMm),
      height: Math.min(paper.widthMm, paper.heightMm),
    };
  }
  return {
    width: Math.min(paper.widthMm, paper.heightMm),
    height: Math.max(paper.widthMm, paper.heightMm),
  };
}

export interface GridPreset {
  label: string;
  cols: number;
  rows: number;
  couponsPerSheet: number;
  recommendedFor: string;
}

export const RECOMMENDED_GRIDS: GridPreset[] = [
  { label: 'Standar 8 Kupon (2 x 4)', cols: 2, rows: 4, couponsPerSheet: 8, recommendedFor: 'Ukuran ideal & mudah dibaca' },
  { label: 'Efisien 10 Kupon (2 x 5)', cols: 2, rows: 5, couponsPerSheet: 10, recommendedFor: 'Sangat populer untuk Jalan Sehat' },
  { label: 'Hemat Kertas 12 Kupon (2 x 6)', cols: 2, rows: 6, couponsPerSheet: 12, recommendedFor: 'Kertas F4 / Cetak massal hemat' },
  { label: 'Besar & Eksklusif 4 Kupon (1 x 4)', cols: 1, rows: 4, couponsPerSheet: 4, recommendedFor: 'Tiket Seminar / Konser / VIP' },
  { label: 'Ekstra Padat 18 Kupon (3 x 6)', cols: 3, rows: 6, couponsPerSheet: 18, recommendedFor: 'Kupon mini doorprize belanja' },
];
