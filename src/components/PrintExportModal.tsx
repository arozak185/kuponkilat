import React, { useState, useMemo } from 'react';
import { parsePageRange, formatPageRange } from '../utils/pageRangeParser';
import { TicketConfig } from '../types/ticket';
import { PAPER_DIMENSIONS } from '../utils/paperConstants';
import { PdfQualityMode } from '../utils/pdfGenerator';
import {
  X,
  Download,
  Printer,
  FileText,
  CheckCircle2,
  Zap,
  Sparkles,
  Info,
} from 'lucide-react';

export type PrintExportMode = 'pdf' | 'print';

interface PrintExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: PrintExportMode;
  totalPages: number;
  currentPage: number;
  ticketsPerPage: number;
  ticketNumbers: string[];
  config: TicketConfig;
  onConfirm: (selectedPageIndices: number[], qualityMode: PdfQualityMode) => void;
  isProcessing?: boolean;
}

export const PrintExportModal: React.FC<PrintExportModalProps> = ({
  isOpen,
  onClose,
  mode: initialMode,
  totalPages,
  currentPage,
  ticketsPerPage,
  ticketNumbers,
  config,
  onConfirm,
  isProcessing,
}) => {
  const [activeMode, setActiveMode] = useState<PrintExportMode>(initialMode);
  const [qualityMode, setQualityMode] = useState<PdfQualityMode>('turbo');
  const [rangeType, setRangeType] = useState<'all' | 'current' | 'custom'>('all');
  const [customRangeText, setCustomRangeText] = useState<string>(
    totalPages > 5 ? '1-5' : `1-${totalPages}`
  );

  const paperInfo = PAPER_DIMENSIONS[config.layout.paperSize];

  // Calculate selected page indices (0-based)
  const selectedIndices = useMemo(() => {
    if (rangeType === 'all') {
      return Array.from({ length: totalPages }, (_, i) => i);
    }
    if (rangeType === 'current') {
      const p = Math.min(Math.max(0, currentPage), totalPages - 1);
      return [p];
    }
    // custom
    return parsePageRange(customRangeText, totalPages);
  }, [rangeType, currentPage, totalPages, customRangeText]);

  if (!isOpen) return null;

  // Calculate ticket slice statistics
  const totalSelectedTickets = selectedIndices.reduce((acc, pIdx) => {
    const start = pIdx * ticketsPerPage;
    const end = Math.min(ticketNumbers.length, (pIdx + 1) * ticketsPerPage);
    return acc + Math.max(0, end - start);
  }, 0);

  const firstTicket =
    selectedIndices.length > 0 && selectedIndices[0] * ticketsPerPage < ticketNumbers.length
      ? ticketNumbers[selectedIndices[0] * ticketsPerPage]
      : '';
  const lastSelectedPage = selectedIndices[selectedIndices.length - 1];
  const lastTicketIdx = Math.min(
    ticketNumbers.length - 1,
    (lastSelectedPage + 1) * ticketsPerPage - 1
  );
  const lastTicket = lastTicketIdx >= 0 ? ticketNumbers[lastTicketIdx] : '';

  const handleApplyPresetRange = (text: string) => {
    setRangeType('custom');
    setCustomRangeText(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with Mode Tabs */}
        <div className="px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl">
            <button
              onClick={() => setActiveMode('pdf')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                activeMode === 'pdf'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={() => setActiveMode('print')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                activeMode === 'print'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Printer (0 Detik)</span>
            </button>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Paper and total summary */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-slate-700">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <div>
                <span className="font-bold text-slate-900">{paperInfo.name}</span>
                <span className="text-slate-500 ml-1">
                  ({config.layout.columns}x{config.layout.rows} = {ticketsPerPage} kupon/lembar)
                </span>
              </div>
            </div>
            <span className="font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px] text-slate-700">
              Total {totalPages} Lembar ({ticketNumbers.length} Kupon)
            </span>
          </div>

          {/* Range Selection Radio Options */}
          <div className="space-y-2">
            <label className="block font-bold text-slate-800">
              Pilih Lembar Halaman yang Ingin Di-{activeMode === 'pdf' ? 'Download' : 'Cetak'}:
            </label>

            {/* Option 1: All Pages */}
            <label
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                rangeType === 'all'
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-semibold ring-1 ring-indigo-500'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="pageRangeOption"
                checked={rangeType === 'all'}
                onChange={() => setRangeType('all')}
                className="mt-0.5 accent-indigo-600 cursor-pointer"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold">Semua Halaman (1 s/d {totalPages})</span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {totalPages} lembar penuh
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 font-normal">
                  Seluruh {ticketNumbers.length} kupon tanpa terlewat.
                </p>
              </div>
            </label>

            {/* Option 2: Current Page Only */}
            <label
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                rangeType === 'current'
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-semibold ring-1 ring-indigo-500'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="pageRangeOption"
                checked={rangeType === 'current'}
                onChange={() => setRangeType('current')}
                className="mt-0.5 accent-indigo-600 cursor-pointer"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold">
                    Halaman Saat Ini Saja (Lembar ke-{currentPage + 1})
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">1 lembar</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 font-normal">
                  Hanya lembar kupon yang sedang aktif ditampilkan di layar.
                </p>
              </div>
            </label>

            {/* Option 3: Custom Range */}
            <label
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                rangeType === 'custom'
                  ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-semibold ring-1 ring-indigo-500'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="pageRangeOption"
                checked={rangeType === 'custom'}
                onChange={() => setRangeType('custom')}
                className="mt-0.5 accent-indigo-600 cursor-pointer"
              />
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold">Kustom Rentang Halaman</span>
                  <span className="text-[11px] font-mono text-indigo-600 font-bold">
                    {selectedIndices.length} lembar terpilih
                  </span>
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={customRangeText}
                    onFocus={() => setRangeType('custom')}
                    onChange={(e) => setCustomRangeText(e.target.value)}
                    placeholder="Contoh: 1-5 atau 1, 3, 5-8"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Gunakan tanda strip untuk rentang (misal <b>1-5</b>) atau koma untuk pisah halaman (misal <b>1, 3, 5</b>).
                  </p>

                  {/* Quick Preset Range Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    <span className="text-[10px] text-slate-400 self-center">Pilihan cepat:</span>
                    {totalPages >= 5 && (
                      <button
                        type="button"
                        onClick={() => handleApplyPresetRange('1-5')}
                        className="px-2 py-0.5 bg-white hover:bg-indigo-50 border border-slate-300 hover:border-indigo-400 rounded text-[10px] font-mono text-slate-700 cursor-pointer"
                      >
                        1-5
                      </button>
                    )}
                    {totalPages >= 10 && (
                      <button
                        type="button"
                        onClick={() => handleApplyPresetRange('6-10')}
                        className="px-2 py-0.5 bg-white hover:bg-indigo-50 border border-slate-300 hover:border-indigo-400 rounded text-[10px] font-mono text-slate-700 cursor-pointer"
                      >
                        6-10
                      </button>
                    )}
                    {totalPages >= 3 && (
                      <button
                        type="button"
                        onClick={() => handleApplyPresetRange('1-3')}
                        className="px-2 py-0.5 bg-white hover:bg-indigo-50 border border-slate-300 hover:border-indigo-400 rounded text-[10px] font-mono text-slate-700 cursor-pointer"
                      >
                        1-3 (Uji Coba)
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleApplyPresetRange('1')}
                      className="px-2 py-0.5 bg-white hover:bg-indigo-50 border border-slate-300 hover:border-indigo-400 rounded text-[10px] font-mono text-slate-700 cursor-pointer"
                    >
                      Lembar 1 Saja
                    </button>
                  </div>
                </div>
              </div>
            </label>
          </div>

          {/* Speed & Quality Mode (For PDF Mode) */}
          {activeMode === 'pdf' && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Kecepatan Pembuatan Dokumen PDF:</span>
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Optimized
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setQualityMode('turbo')}
                  className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                    qualityMode === 'turbo'
                      ? 'bg-white border-indigo-600 text-indigo-900 font-bold shadow-2xs'
                      : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <span className="text-amber-500">⚡</span>
                    <span>Turbo Cepat (~1-2 Detik)</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Native browser render, sangat cepat & tajam HD
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setQualityMode('hd')}
                  className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                    qualityMode === 'hd'
                      ? 'bg-white border-indigo-600 text-indigo-900 font-bold shadow-2xs'
                      : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    <span>Ultra HD (210 DPI)</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Resolusi tertinggi untuk cetak offset besar
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Instant Vector Print Tip Banner */}
          <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 text-sky-950 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <span className="font-bold block text-sky-900">
                Tips Cetak & Simpan PDF Super Cepat (0 Detik / Tanpa Loading):
              </span>
              Pilih tab <b>Cetak Printer</b> di atas lalu klik tombol Cetak. Di jendela print komputer Anda, pilih printer fisik atau pilih tujuan <b>"Simpan sebagai PDF (Save as PDF)"</b>. Prosesnya instan 0 detik dan hasilnya 100% vektor tajam!
            </div>
          </div>

          {/* Selected Pages & Ticket Preview Feedback Box */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 text-emerald-950 space-y-1">
            <div className="flex items-center justify-between font-bold text-xs text-emerald-900">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  Hasil Terpilih: <b>{selectedIndices.length} Lembar</b> ({totalSelectedTickets} Kupon)
                </span>
              </span>
              <span className="font-mono text-[11px] bg-emerald-100/90 text-emerald-800 px-2 py-0.5 rounded">
                Lembar: {formatPageRange(selectedIndices) || 'Semua'}
              </span>
            </div>

            {firstTicket && lastTicket && (
              <div className="text-[11px] text-emerald-800 pt-0.5">
                Nomor Kupon yang akan diproses:{' '}
                <b className="font-mono">{firstTicket}</b> s/d{' '}
                <b className="font-mono">{lastTicket}</b>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>

          <button
            type="button"
            disabled={selectedIndices.length === 0 || isProcessing}
            onClick={() => onConfirm(selectedIndices, qualityMode)}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-sm active:scale-95 disabled:opacity-50 ${
              activeMode === 'pdf'
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-slate-800 hover:bg-slate-900 text-white'
            }`}
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Memproses Cepat...</span>
              </>
            ) : activeMode === 'pdf' ? (
              <>
                <Download className="w-4 h-4" />
                <span>Download PDF ({selectedIndices.length} Lembar)</span>
              </>
            ) : (
              <>
                <Printer className="w-4 h-4" />
                <span>Cetak Sekarang ({selectedIndices.length} Lembar)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
