import React, { useState } from 'react';
import { TicketConfig } from '../types/ticket';
import { X, Search, CheckCircle, AlertTriangle, QrCode } from 'lucide-react';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketNumbers: string[];
  config: TicketConfig;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  ticketNumbers,
  config,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [result, setResult] = useState<{
    found: boolean;
    ticketNumber?: string;
    index?: number;
    sheetNumber?: number;
  } | null>(null);

  if (!isOpen) return null;

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim().toUpperCase();
    if (!query) {
      setResult(null);
      return;
    }

    const idx = ticketNumbers.findIndex(
      (n) => n.toUpperCase() === query || n.toUpperCase().includes(query)
    );

    if (idx !== -1) {
      const ticketsPerPage = config.layout.columns * config.layout.rows;
      const sheetNum = Math.floor(idx / ticketsPerPage) + 1;
      setResult({
        found: true,
        ticketNumber: ticketNumbers[idx],
        index: idx + 1,
        sheetNumber: sheetNum,
      });
    } else {
      setResult({
        found: false,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-800">
                Verifikasi Keaslian Nomor Kupon
              </h2>
              <p className="text-xs text-slate-500">
                Pengecekan keabsahan nomor kupon untuk panitia meja registrasi & panggung
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Form */}
        <div className="p-6 space-y-4">
          <form onSubmit={handleVerify} className="space-y-3">
            <label className="block text-xs font-bold text-slate-700">
              Ketikkan Nomor Kupon Undian:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (!e.target.value) setResult(null);
                  }}
                  placeholder="Contoh: JS-0025 atau angka 25"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl font-mono text-sm focus:ring-2 focus:ring-emerald-500 uppercase"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Cek Nomor
              </button>
            </div>
          </form>

          {/* Verification Result Feedback */}
          {result && (
            <div className="pt-2 animate-in fade-in">
              {result.found ? (
                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 text-emerald-950 flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs uppercase bg-emerald-200/70 text-emerald-800 px-2 py-0.5 rounded">
                        KUPON TERDAFTAR SAH
                      </span>
                    </div>
                    <div className="font-mono font-black text-2xl text-emerald-900 tracking-wider">
                      {result.ticketNumber}
                    </div>
                    <div className="text-xs text-emerald-800 space-y-0.5 pt-1">
                      <div>
                        Acara: <b>{config.event.title}</b>
                      </div>
                      <div>
                        Lokasi Cetak: <b>Lembar ke-{result.sheetNumber}</b> (Urutan ke-{result.index} dari {ticketNumbers.length} kupon)
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-300 rounded-xl p-4 text-red-950 flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-sm text-red-800">
                      NOMOR TIDAK TERDAFTAR!
                    </div>
                    <p className="text-xs text-red-700 mt-0.5">
                      Nomor "{searchQuery}" tidak ditemukan dalam daftar {ticketNumbers.length} kupon yang diterbitkan pada batch ini. Pastikan kupon tidak palsu.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick List Sample */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 block mb-1">
              Sampel Nomor yang Diterbitkan ({ticketNumbers.length} total):
            </span>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1.5 bg-slate-50 rounded-lg border border-slate-200">
              {ticketNumbers.slice(0, 30).map((num) => (
                <button
                  key={num}
                  onClick={() => {
                    setSearchQuery(num);
                    const idx = ticketNumbers.indexOf(num);
                    const ticketsPerPage = config.layout.columns * config.layout.rows;
                    const sheetNum = Math.floor(idx / ticketsPerPage) + 1;
                    setResult({
                      found: true,
                      ticketNumber: num,
                      index: idx + 1,
                      sheetNumber: sheetNum,
                    });
                  }}
                  className="font-mono text-[10px] px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 cursor-pointer"
                >
                  {num}
                </button>
              ))}
              {ticketNumbers.length > 30 && (
                <span className="text-[10px] text-slate-400 self-center px-1">
                  ...+{ticketNumbers.length - 30} lagi
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
