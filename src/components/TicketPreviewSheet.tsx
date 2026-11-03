import React, { useState } from 'react';
import { TicketConfig } from '../types/ticket';
import { TicketItem } from './TicketItem';
import { getPaperSizeMm, PAPER_DIMENSIONS } from '../utils/paperConstants';
import { generatePdfFromElements, PdfGenerationProgress } from '../utils/pdfGenerator';
import { PrintExportModal, PrintExportMode } from './PrintExportModal';
import { formatPageRange } from '../utils/pageRangeParser';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileText,
  Printer,
  Download,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';

interface TicketPreviewSheetProps {
  config: TicketConfig;
  ticketNumbers: string[];
  onPrint?: () => void;
}

export const TicketPreviewSheet: React.FC<TicketPreviewSheetProps> = ({
  config,
  ticketNumbers,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(85); // 85% default fits nicely

  // PDF Export states
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<PdfGenerationProgress | null>(null);
  const [exportingPageIndex, setExportingPageIndex] = useState<number | null>(null);

  // Print/Export Modal State
  const [modalMode, setModalMode] = useState<PrintExportMode | null>(null);
  // Specific pages to render in print container
  const [printPageIndices, setPrintPageIndices] = useState<number[]>([]);

  const { layout } = config;
  const cols = Math.max(1, layout.columns);
  const rows = Math.max(1, layout.rows);
  const ticketsPerPage = cols * rows;
  const totalPages = Math.max(1, Math.ceil(ticketNumbers.length / ticketsPerPage));

  // Ensure valid page
  const safePage = Math.min(currentPage, totalPages - 1);
  const pageTickets = ticketNumbers.slice(
    safePage * ticketsPerPage,
    (safePage + 1) * ticketsPerPage
  );

  const paperDim = getPaperSizeMm(layout.paperSize, layout.orientation);
  const paperInfo = PAPER_DIMENSIONS[layout.paperSize];

  // 1mm in CSS screen pixels (96 DPI standard)
  const MM_TO_PX = 3.779528;

  // Staging renderer for PDF generation: renders a specific page into the DOM and returns the element
  const renderPageForExport = async (pageIdx: number): Promise<HTMLElement | null> => {
    setExportingPageIndex(pageIdx);
    // Wait for React render cycle & images to settle
    await new Promise((resolve) => setTimeout(resolve, 80));
    return document.getElementById('pdf-export-stage');
  };

  // Execute PDF generation for chosen page indices
  const handleExecutePdfExport = async (selectedPages: number[]) => {
    if (isExporting) return;
    setIsExporting(true);
    setModalMode(null);
    setExportProgress({
      current: 0,
      total: selectedPages.length,
      status: `Menyiapkan generator PDF (${selectedPages.length} lembar)...`,
    });

    try {
      const blob = await generatePdfFromElements(
        config,
        ticketNumbers,
        renderPageForExport,
        selectedPages,
        (progress) => setExportProgress(progress)
      );

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const cleanTitle = (config.event.title || 'Kupon_Undian').replace(/[^a-zA-Z0-9_-]/g, '_');
      const pageSuffix =
        selectedPages.length === totalPages
          ? 'Semua'
          : `Halaman_${formatPageRange(selectedPages).replace(/[\s,]+/g, '_')}`;
      link.setAttribute('download', `Kupon_${cleanTitle}_${config.layout.paperSize}_${pageSuffix}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Terjadi kesalahan saat memproses PDF. Silakan coba lagi.');
    } finally {
      setIsExporting(false);
      setExportProgress(null);
      setExportingPageIndex(null);
    }
  };

  // Execute print for chosen page indices
  const handleExecutePrint = (selectedPages: number[]) => {
    setPrintPageIndices(selectedPages);
    setModalMode(null);
    // Give react time to render selected pages into #print-root before opening print dialog
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden relative">
      {/* Top Bar Controls */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs z-10 shrink-0">
        {/* Pagination & Sheet Info */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
              className="p-1.5 rounded text-slate-700 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              title="Lembar Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold px-2.5 text-slate-700">
              Lembar <span className="text-indigo-600 font-bold">{safePage + 1}</span> / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={safePage >= totalPages - 1}
              className="p-1.5 rounded text-slate-700 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              title="Lembar Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 pl-2 border-l border-slate-200">
            <span className="inline-flex items-center gap-1 font-medium text-slate-700">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              {paperInfo.name} ({paperDim.width} × {paperDim.height} mm)
            </span>
            <span>•</span>
            <span>
              {cols} × {rows} = <b>{ticketsPerPage} kupon/lembar</b>
            </span>
            <span>•</span>
            <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Total: {ticketNumbers.length} Kupon
            </span>
          </div>
        </div>

        {/* Zoom Controls & Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="hidden md:flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 mr-2">
            <button
              onClick={() => setZoomLevel((z) => Math.max(40, z - 15))}
              className="p-1.5 rounded text-slate-600 hover:bg-white cursor-pointer"
              title="Perkecil"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-2 text-slate-600 w-12 text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(140, z + 15))}
              className="p-1.5 rounded text-slate-600 hover:bg-white cursor-pointer"
              title="Perbesar"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(85)}
              className="p-1.5 rounded text-slate-600 hover:bg-white cursor-pointer"
              title="Sesuaikan Layar"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Cetak Browser Button */}
          <button
            onClick={() => setModalMode('print')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-white hover:bg-slate-900 transition-colors shadow-xs cursor-pointer active:scale-95"
            title="Pilih halaman & cetak langsung ke printer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak (Print)</span>
          </button>

          {/* Unduh PDF Button with Page Range Customizer */}
          <button
            onClick={() => setModalMode('pdf')}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-400 transition-all shadow-sm cursor-pointer active:scale-95"
            title="Pilih halaman (misal 1-5) dan unduh PDF siap cetak"
          >
            {isExporting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{isExporting ? 'Memproses PDF...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* PDF Export Progress Banner */}
      {isExporting && exportProgress && (
        <div className="bg-indigo-700 text-white px-4 py-2.5 text-xs flex items-center justify-between shadow-md z-20 animate-in slide-in-from-top duration-150">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="font-medium">{exportProgress.status}</span>
          </div>
          <span className="font-mono bg-indigo-800 px-2 py-0.5 rounded text-[11px]">
            Halaman {exportProgress.current} / {exportProgress.total}
          </span>
        </div>
      )}

      {/* Main Interactive Sheet Viewport */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-start justify-center">
        {/* Physical Paper Simulation Container */}
        <div
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
            width: `${paperDim.width * MM_TO_PX}px`,
            minHeight: `${paperDim.height * MM_TO_PX}px`,
            padding: `${layout.marginMm * MM_TO_PX}px`,
            boxSizing: 'border-box',
          }}
          className="bg-white shadow-2xl rounded-xs border border-slate-300 relative print:shadow-none print:border-none print:m-0"
        >
          {/* Paper Watermark / Ruler Guide Header */}
          <div className="absolute top-1 right-2 text-[9px] font-mono text-slate-300 pointer-events-none select-none uppercase">
            {paperInfo.name} • {paperDim.width}×{paperDim.height}mm
          </div>

          {/* Ticket Grid Layout */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
              gap: `${layout.gapMm * MM_TO_PX}px`,
              width: '100%',
              height: `${(paperDim.height - layout.marginMm * 2) * MM_TO_PX}px`,
              boxSizing: 'border-box',
            }}
          >
            {pageTickets.map((ticketNum, index) => (
              <TicketItem
                key={`${safePage}-${ticketNum}-${index}`}
                ticketNumber={ticketNum}
                config={config}
                className="w-full h-full"
              />
            ))}

            {/* Empty slots placeholders if last page isn't full */}
            {Array.from({ length: ticketsPerPage - pageTickets.length }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                className="rounded-md border border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-slate-300 text-xs p-2 select-none"
              >
                <span className="font-mono text-[10px]">Slot Kosong</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Sheet Summary Bar */}
      <div className="bg-white/90 backdrop-blur-xs border-t border-slate-200 px-4 py-2 text-[11px] text-slate-500 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5 text-slate-600">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            Bisa ekspor atau cetak halaman tertentu saja (misal halaman 1-5, halaman ganjil, dll).
          </span>
        </div>
        <div className="font-mono text-slate-500">
          Halaman {safePage + 1} dari {totalPages}
        </div>
      </div>

      {/* ============================================================== */}
      {/* EXPORT STAGING CONTAINER (EXACT 1:1 SCREEN PIXELS, BEHIND UI) */}
      {/* ============================================================== */}
      {exportingPageIndex !== null && (
        <div
          id="pdf-export-stage"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: -9999,
            pointerEvents: 'none',
            width: `${paperDim.width * MM_TO_PX}px`,
            height: `${paperDim.height * MM_TO_PX}px`,
            backgroundColor: '#ffffff',
            padding: `${layout.marginMm * MM_TO_PX}px`,
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
              gap: `${layout.gapMm * MM_TO_PX}px`,
              width: '100%',
              height: `${(paperDim.height - layout.marginMm * 2) * MM_TO_PX}px`,
              boxSizing: 'border-box',
            }}
          >
            {ticketNumbers
              .slice(
                exportingPageIndex * ticketsPerPage,
                (exportingPageIndex + 1) * ticketsPerPage
              )
              .map((ticketNum, index) => (
                <TicketItem
                  key={`export-${exportingPageIndex}-${ticketNum}-${index}`}
                  ticketNumber={ticketNum}
                  config={config}
                  className="w-full h-full"
                />
              ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* HIDDEN PRINT CONTAINER FOR BROWSER PRINT (window.print())       */}
      {/* Renders ONLY the pages selected by user (e.g. pages 1-5)      */}
      {/* ============================================================== */}
      <div id="print-root" className="hidden print:block">
        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            #print-root, #print-root * {
              visibility: visible;
            }
            #print-root {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0;
              padding: 0;
              background: transparent;
            }
            .print-page {
              page-break-after: always;
              break-after: page;
              box-sizing: border-box;
              margin: 0;
              padding: ${layout.marginMm}mm;
              width: ${paperDim.width}mm;
              height: ${paperDim.height}mm;
              overflow: hidden;
            }
            @page {
              size: ${paperDim.width}mm ${paperDim.height}mm;
              margin: 0;
            }
          }
        `}</style>
        {(printPageIndices.length > 0
          ? printPageIndices
          : Array.from({ length: totalPages }, (_, i) => i)
        ).map((pIdx) => {
          const sheetNumbers = ticketNumbers.slice(
            pIdx * ticketsPerPage,
            (pIdx + 1) * ticketsPerPage
          );
          return (
            <div
              key={`print-page-${pIdx}`}
              className="print-page bg-white"
              style={{
                boxSizing: 'border-box',
                width: `${paperDim.width}mm`,
                height: `${paperDim.height}mm`,
                padding: `${layout.marginMm}mm`,
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
                  gap: `${layout.gapMm}mm`,
                  width: '100%',
                  height: `${paperDim.height - layout.marginMm * 2}mm`,
                  boxSizing: 'border-box',
                }}
              >
                {sheetNumbers.map((ticketNum, tIdx) => (
                  <TicketItem
                    key={`p-${pIdx}-${ticketNum}-${tIdx}`}
                    ticketNumber={ticketNum}
                    config={config}
                    className="w-full h-full"
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ============================================================== */}
      {/* PRINT & EXPORT PAGE RANGE SELECTION MODAL                      */}
      {/* ============================================================== */}
      {modalMode && (
        <PrintExportModal
          isOpen={true}
          onClose={() => setModalMode(null)}
          mode={modalMode}
          totalPages={totalPages}
          currentPage={safePage}
          ticketsPerPage={ticketsPerPage}
          ticketNumbers={ticketNumbers}
          config={config}
          onConfirm={(selectedPages) => {
            if (modalMode === 'pdf') {
              handleExecutePdfExport(selectedPages);
            } else {
              handleExecutePrint(selectedPages);
            }
          }}
          isProcessing={isExporting}
        />
      )}
    </div>
  );
};
