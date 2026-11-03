import jsPDF from 'jspdf';
import { toJpeg } from 'html-to-image';
import html2canvas from 'html2canvas';
import { TicketConfig } from '../types/ticket';
import { getPaperSizeMm } from './paperConstants';
import { preloadQrCodes } from './qrHelper';

export interface PdfGenerationProgress {
  current: number;
  total: number;
  status: string;
}

export type PdfQualityMode = 'turbo' | 'hd';

export async function generatePdfFromElements(
  config: TicketConfig,
  ticketNumbers: string[],
  renderPage: (pageIndex: number) => Promise<HTMLElement | null>,
  pageIndicesToExport?: number[],
  onProgress?: (progress: PdfGenerationProgress) => void,
  qualityMode: PdfQualityMode = 'turbo'
): Promise<Blob> {
  const { layout, event } = config;
  const paperDim = getPaperSizeMm(layout.paperSize, layout.orientation);
  const pageWidth = paperDim.width;
  const pageHeight = paperDim.height;

  const cols = Math.max(1, layout.columns);
  const rows = Math.max(1, layout.rows);
  const ticketsPerPage = cols * rows;
  const totalPages = Math.max(1, Math.ceil(ticketNumbers.length / ticketsPerPage));

  // Determine which pages to generate
  const pagesToProcess =
    pageIndicesToExport && pageIndicesToExport.length > 0
      ? pageIndicesToExport.filter((p) => p >= 0 && p < totalPages)
      : Array.from({ length: totalPages }, (_, i) => i);

  if (pagesToProcess.length === 0) {
    throw new Error('Tidak ada halaman yang dipilih untuk diekspor.');
  }

  // 1. Preload QR Codes only if barcode feature is active
  if (event.showBarcode && event.barcodeType === 'qr') {
    if (onProgress) {
      onProgress({ current: 0, total: pagesToProcess.length, status: 'Menyiapkan kode QR...' });
    }
    await preloadQrCodes(ticketNumbers, event.title);
  }

  // 2. Initialize jsPDF with exact paper dimension in mm
  const doc = new jsPDF({
    orientation: layout.orientation,
    unit: 'mm',
    format: [pageWidth, pageHeight],
    compress: true,
  });

  // Settings based on speed vs quality
  // 'turbo' uses pixelRatio 1.5 (~150 DPI) with native browser SVG foreignObject rasterization (~40ms/page)
  // 'hd' uses pixelRatio 2.2 (~210 DPI)
  const pixelRatio = qualityMode === 'turbo' ? 1.5 : 2.2;
  const jpegQuality = qualityMode === 'turbo' ? 0.90 : 0.95;

  // 3. Render and capture each selected sheet sequentially
  for (let i = 0; i < pagesToProcess.length; i++) {
    const pageIdx = pagesToProcess[i];

    if (onProgress) {
      onProgress({
        current: i + 1,
        total: pagesToProcess.length,
        status: `Memproses lembar ${pageIdx + 1} (${i + 1} dari ${pagesToProcess.length})...`,
      });
    }

    // Tell caller to render pageIdx into the staging container
    const element = await renderPage(pageIdx);
    if (!element) {
      throw new Error(`Element untuk halaman ${pageIdx + 1} tidak ditemukan.`);
    }

    // Wait for single render frame so DOM updates cleanly
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));

    // Fast capture via native SVG foreignObject (10x faster than html2canvas)
    let imgData: string = '';
    try {
      imgData = await toJpeg(element, {
        quality: jpegQuality,
        pixelRatio: pixelRatio,
        backgroundColor: '#ffffff',
        cacheBust: false,
      });
    } catch {
      // Fallback to html2canvas if browser has security constraint on foreignObject
      try {
        const canvas = await html2canvas(element, {
          scale: pixelRatio,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: element.scrollWidth,
          windowHeight: element.scrollHeight,
        });
        imgData = canvas.toDataURL('image/jpeg', jpegQuality);
      } catch (fallbackError) {
        console.error('Capture failed for page:', pageIdx, fallbackError);
      }
    }

    if (!imgData) {
      throw new Error(`Gagal merender lembar ke-${pageIdx + 1}.`);
    }

    if (i > 0) {
      doc.addPage([pageWidth, pageHeight], layout.orientation);
    }

    // Add image with exact paper size in mm
    doc.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
  }

  if (onProgress) {
    onProgress({
      current: pagesToProcess.length,
      total: pagesToProcess.length,
      status: 'Menyelesaikan dokumen PDF...',
    });
  }

  return doc.output('blob');
}
