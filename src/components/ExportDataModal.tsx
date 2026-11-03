import React, { useState } from 'react';
import { TicketConfig } from '../types/ticket';
import { X, Download, Copy, Check, FileSpreadsheet } from 'lucide-react';

interface ExportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketNumbers: string[];
  config: TicketConfig;
}

export const ExportDataModal: React.FC<ExportDataModalProps> = ({
  isOpen,
  onClose,
  ticketNumbers,
  config,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownloadCsv = () => {
    let csv = `REKAP KUPOON UNDIAN - ${config.event.title}\n`;
    csv += `Tanggal Kegiatan: ${config.event.date}\n`;
    csv += `Total Kupon: ${ticketNumbers.length}\n\n`;
    csv += 'No,Nomor Kupon Undian,Status Penjualan,Nama Pembeli / Peserta,No WhatsApp / HP,Alamat / Divisi,Tanda Terima Panitia\n';

    ticketNumbers.forEach((num, idx) => {
      csv += `${idx + 1},"${num}","Belum Terjual","","","",""\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `Master_Rekap_Kupon_${config.event.title.replace(/\s+/g, '_')}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyNumbers = () => {
    navigator.clipboard.writeText(ticketNumbers.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-800">
                Ekspor Data & Master Absensi Penjualan
              </h2>
              <p className="text-xs text-slate-500">
                Format tabel spreadsheet untuk rekap buku penjualan tiket panitia
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

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span>Kegiatan:</span>
              <b className="text-slate-800 truncate max-w-xs">{config.event.title}</b>
            </div>
            <div className="flex justify-between">
              <span>Jumlah Kupon Terbit:</span>
              <b className="font-mono text-indigo-700">{ticketNumbers.length} nomor</b>
            </div>
            <div className="flex justify-between">
              <span>Rentang Nomor:</span>
              <b className="font-mono text-slate-800">
                {ticketNumbers[0]} s/d {ticketNumbers[ticketNumbers.length - 1]}
              </b>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Pratinjau Daftar Nomor:
            </label>
            <textarea
              readOnly
              rows={6}
              value={ticketNumbers.slice(0, 50).join('\n') + (ticketNumbers.length > 50 ? `\n... (+${ticketNumbers.length - 50} nomor lainnya)` : '')}
              className="w-full p-2.5 border border-slate-300 rounded-xl font-mono text-xs bg-slate-50 text-slate-700"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
            <button
              onClick={handleDownloadCsv}
              className="w-full sm:flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Buku Rekap CSV / Excel</span>
            </button>

            <button
              onClick={handleCopyNumbers}
              className="w-full sm:w-auto py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Tersalin!' : 'Salin Nomor'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
