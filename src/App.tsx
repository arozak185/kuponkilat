/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { TicketConfig } from './types/ticket';
import { DEFAULT_TICKET_CONFIG } from './utils/presets';
import { generateTicketNumbers } from './utils/numberGenerator';
import { EditorSidebar } from './components/EditorSidebar';
import { TicketPreviewSheet } from './components/TicketPreviewSheet';
import { LiveDrawModal } from './components/LiveDrawModal';
import { PresetsModal } from './components/PresetsModal';
import { VerificationModal } from './components/VerificationModal';
import { ExportDataModal } from './components/ExportDataModal';
import {
  Ticket,
  Printer,
  Download,
  Sparkles,
  Trophy,
  Search,
  FileSpreadsheet,
  RotateCcw,
  Check,
  Menu,
  X,
  Layers,
} from 'lucide-react';

const STORAGE_KEY = 'kuponkilat_saved_config';

export default function App() {
  // Load saved state or default
  const [config, setConfig] = useState<TicketConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.event) {
          if (parsed.event.customNote === 'Kupon tidak dapat diuangkan') {
            parsed.event.customNote = '';
          }
          parsed.event.showBarcode = false;
        }
        return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_TICKET_CONFIG;
  });

  // Modal controls
  const [isLiveDrawOpen, setIsLiveDrawOpen] = useState(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  // Generate the active ticket numbers list
  const ticketNumbers = useMemo(() => {
    return generateTicketNumbers(config.numbering);
  }, [config.numbering]);

  // Auto-save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // ignore
    }
  }, [config]);

  // Handler for Direct Native Browser Print
  const handlePrint = () => {
    window.print();
  };

  // Reset to default
  const handleReset = () => {
    if (confirm('Kembalikan ke pengaturan awal default?')) {
      setConfig(DEFAULT_TICKET_CONFIG);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-800">
      {/* ================= TOP NAVIGATION BAR ================= */}
      <header className="no-print bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between gap-3 shadow-2xs z-30 shrink-0">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsMobileSidebarOpen((o) => !o)}
            className="md:hidden p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
            <Ticket className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-base text-slate-900 tracking-tight leading-none">
                KuponKilat
              </h1>
              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-extrabold px-1.5 py-0.2 rounded border border-indigo-200">
                PRO PDF
              </span>
            </div>
            <p className="text-[10px] text-slate-500 leading-none mt-0.5 hidden sm:block">
              Generator Kupon Undian & Doorprize Masal Siap Cetak
            </p>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Contoh Template Modal Button */}
          <button
            onClick={() => setIsPresetsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
            title="Pilih template contoh kegiatan populer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Contoh Template</span>
          </button>

          {/* Verifikasi Nomor Kupon */}
          <button
            onClick={() => setIsVerificationOpen(true)}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
            title="Cek keabsahan nomor kupon"
          >
            <Search className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cek Nomor</span>
          </button>

          {/* Rekap CSV */}
          <button
            onClick={() => setIsExportOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
            title="Unduh rekap penjualan untuk pembukuan"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Rekap CSV</span>
          </button>

          {/* Undian Live Stage Button */}
          <button
            onClick={() => setIsLiveDrawOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-extrabold rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-xs transition-all cursor-pointer active:scale-95"
            title="Buka mesin pemutar undian di proyektor panggung"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Undian Live</span>
          </button>

          <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Reset */}
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer hidden sm:block"
            title="Kembalikan Pengaturan Awal"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ================= MAIN WORKSPACE AREA ================= */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop Sidebar */}
        <div className="hidden md:block h-full">
          <EditorSidebar
            config={config}
            onChange={setConfig}
            ticketCount={ticketNumbers.length}
          />
        </div>

        {/* Mobile Slide-out Sidebar Drawer */}
        {isMobileSidebarOpen && (
          <div className="md:hidden fixed inset-0 z-40 flex">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
              <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <span className="font-bold text-xs text-slate-800">Pengaturan Kupon</span>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1 rounded-md text-slate-500 hover:bg-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <EditorSidebar
                  config={config}
                  onChange={setConfig}
                  ticketCount={ticketNumbers.length}
                />
              </div>
            </div>
          </div>
        )}

        {/* Center / Right: Interactive Preview & Print Sheet Viewport */}
        <main className="flex-1 h-full overflow-hidden flex flex-col">
          <TicketPreviewSheet
            config={config}
            ticketNumbers={ticketNumbers}
            onPrint={handlePrint}
          />
        </main>
      </div>

      {/* ================= MODALS ================= */}
      {/* 1. Live Doorprize Lottery Machine */}
      <LiveDrawModal
        isOpen={isLiveDrawOpen}
        onClose={() => setIsLiveDrawOpen(false)}
        ticketNumbers={ticketNumbers}
        eventTitle={config.event.title}
      />

      {/* 2. Ready-to-use Presets Templates Modal */}
      <PresetsModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        onSelectPreset={(newConfig) => {
          setConfig(newConfig);
          setSavedNotice(true);
          setTimeout(() => setSavedNotice(false), 2500);
        }}
      />

      {/* 3. Ticket Verification Modal */}
      <VerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        ticketNumbers={ticketNumbers}
        config={config}
      />

      {/* 4. Export CSV / Excel Modal */}
      <ExportDataModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        ticketNumbers={ticketNumbers}
        config={config}
      />

      {/* Toast Notification for Template Applied */}
      {savedNotice && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-bottom duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Template berhasil diterapkan! Siap dicetak.</span>
        </div>
      )}
    </div>
  );
}
