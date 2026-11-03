import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toJpeg } from 'html-to-image';
import { TicketConfig } from '../types/ticket';
import { getPaperSizeMm } from './paperConstants';
import { preloadQrCodes } from './qrHelper';

export interface PdfGenerationProgress {
  current: number;
  total: number;
  status: string;
}

export async function generatePdfFromElements(
  config: TicketConfig,
  ticketNumbers: string[],
  renderPage: (pageIndex: number) => Promise<HTMLElement | null>,
  onProgress?: (progress: PdfGenerationProgress) => void
): Promise<Blob> {
  const { layout, event } = config;
  const paperDim = getPaperSizeMm(layout.paperSize, layout.orientation);
  const pageWidth = paperDim.width;
  const pageHeight = paperDim.height;

  const cols = Math.max(1, layout.columns);
  const rows = Math.max(1, layout.rows);
  const ticketsPerPage = cols * rows;
  const totalPages = Math.max(1, Math.ceil(ticketNumbers.length / ticketsPerPage));

  // 1. Preload QR Codes for all tickets so they are instant and never blank
  if (event.showBarcode && event.barcodeType === 'qr') {
    if (onProgress) {
      onProgress({ current: 0, total: totalPages, status: 'Menyiapkan kode QR...' });
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

  // 3. Render and capture each sheet sequentially
  for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
    if (onProgress) {
      onProgress({
        current: pageIdx + 1,
        total: totalPages,
        status: `Memproses halaman ${pageIdx + 1} dari ${totalPages}...`,
      });
    }

    // Tell caller to render pageIdx into the staging container
    const element = await renderPage(pageIdx);
    if (!element) {
      throw new Error(`Element untuk halaman ${pageIdx + 1} tidak ditemukan.`);
    }

    // Wait for DOM paint and all fonts/images to settle
    await new Promise((resolve) => setTimeout(resolve, 80));

    // Capture element at high resolution (~210 DPI)
    let imgData: string = '';
    try {
      const canvas = await html2canvas(element, {
        scale: 2.2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });
      imgData = canvas.toDataURL('image/jpeg', 0.95);
    } catch (h2cError) {
      console.warn('html2canvas encountered issue, falling back to html-to-image:', h2cError);
      imgData = await toJpeg(element, {
        quality: 0.95,
        pixelRatio: 2.2,
        backgroundColor: '#ffffff',
      });
    }

    if (pageIdx > 0) {
      doc.addPage([pageWidth, pageHeight], layout.orientation);
    }

    // Add image with exact paper size in mm
    doc.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
  }

  if (onProgress) {
    onProgress({ current: totalPages, total: totalPages, status: 'Menyelesaikan dokumen PDF...' });
  }

  return doc.output('blob');
}
