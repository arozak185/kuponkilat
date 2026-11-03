import React, { useState } from 'react';
import { TicketConfig, PaperSize, PaperOrientation, CouponTheme, CutLineStyle } from '../types/ticket';
import { PAPER_DIMENSIONS, RECOMMENDED_GRIDS } from '../utils/paperConstants';
import { THEMES } from '../utils/themeStyles';
import {
  Calendar,
  Grid,
  Hash,
  Palette,
  Upload,
  Trash2,
  Plus,
  Scissors,
  QrCode,
  Sparkles,
  Info,
} from 'lucide-react';

interface EditorSidebarProps {
  config: TicketConfig;
  onChange: (updater: (prev: TicketConfig) => TicketConfig) => void;
  ticketCount: number;
}

type TabType = 'event' | 'numbering' | 'layout' | 'style';

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  config,
  onChange,
  ticketCount,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('event');

  const { event, numbering, layout, style } = config;

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onChange((prev) => ({
            ...prev,
            event: { ...prev.event, logoUrl: reader.result as string },
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add stub field
  const handleAddStubField = () => {
    onChange((prev) => ({
      ...prev,
      event: {
        ...prev.event,
        stubFields: [...(prev.event.stubFields || []), 'Data Baru'],
      },
    }));
  };

  // Remove stub field
  const handleRemoveStubField = (idx: number) => {
    onChange((prev) => ({
      ...prev,
      event: {
        ...prev.event,
        stubFields: prev.event.stubFields.filter((_, i) => i !== idx),
      },
    }));
  };

  // Update stub field
  const handleUpdateStubField = (idx: number, val: string) => {
    onChange((prev) => {
      const newFields = [...prev.event.stubFields];
      newFields[idx] = val;
      return {
        ...prev,
        event: { ...prev.event, stubFields: newFields },
      };
    });
  };

  return (
    <aside className="w-full md:w-[380px] lg:w-[420px] bg-white border-r border-slate-200 flex flex-col h-full shrink-0 shadow-xs z-20">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 bg-slate-50/80 p-1.5 gap-1 shrink-0 overflow-x-auto">
        <button
          onClick={() => setActiveTab('event')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all whitespace-nowrap ${
            activeTab === 'event'
              ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-indigo-600" />
          <span>1. Info Acara</span>
        </button>

        <button
          onClick={() => setActiveTab('numbering')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all whitespace-nowrap ${
            activeTab === 'numbering'
              ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Hash className="w-3.5 h-3.5 text-indigo-600" />
          <span>2. Nomor ({ticketCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('layout')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all whitespace-nowrap ${
            activeTab === 'layout'
              ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Grid className="w-3.5 h-3.5 text-indigo-600" />
          <span>3. Tata Letak</span>
        </button>

        <button
          onClick={() => setActiveTab('style')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all whitespace-nowrap ${
            activeTab === 'style'
              ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Palette className="w-3.5 h-3.5 text-indigo-600" />
          <span>4. Desain & Logo</span>
        </button>
      </div>

      {/* Tab Content Form (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* ================= TAB 1: ACARA & HADIAH ================= */}
        {activeTab === 'event' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nama Kegiatan / Judul Acara *
              </label>
              <input
                type="text"
                value={event.title}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    event: { ...prev.event, title: e.target.value },
                  }))
                }
                placeholder="Contoh: JALAN SEHAT & BAZAR KEMERDEKAAN"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 font-semibold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Sub-judul / Tema
                </label>
                <input
                  type="text"
                  value={event.subtitle}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      event: { ...prev.event, subtitle: e.target.value },
                    }))
                  }
                  placeholder="Semarak HUT RI Ke-81"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Penyelenggara
                </label>
                <input
                  type="text"
                  value={event.organizer}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      event: { ...prev.event, organizer: e.target.value },
                    }))
                  }
                  placeholder="Panitia Karang Taruna RW 05"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            {/* Waktu & Lokasi */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2.5">
              <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
                Waktu & Tempat Pelaksanaan
              </span>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 mb-1">Hari & Tanggal</label>
                  <input
                    type="text"
                    value={event.date}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        event: { ...prev.event, date: e.target.value },
                      }))
                    }
                    placeholder="Minggu, 17 Agustus 2026"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Jam / Waktu</label>
                  <input
                    type="text"
                    value={event.time}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        event: { ...prev.event, time: e.target.value },
                      }))
                    }
                    placeholder="06.00 WIB s/d Selesai"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Lokasi Kegiatan</label>
                <input
                  type="text"
                  value={event.location}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      event: { ...prev.event, location: e.target.value },
                    }))
                  }
                  placeholder="Lapangan Utama Balai Desa Merdeka"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            {/* Hadiah Utama / Doorprize Highlight */}
            <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 space-y-2">
              <label className="block font-bold text-amber-900">
                ★ Highlight Hadiah / Doorprize Utama
              </label>
              <textarea
                rows={2}
                value={event.grandPrize}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    event: { ...prev.event, grandPrize: e.target.value },
                  }))
                }
                placeholder="1 Unit Sepeda Motor Listrik, Kulkas 2 Pintu, Smart TV, Sepeda Gunung & 50+ Doorprize Menarik"
                className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-lg text-slate-800"
              />
              <p className="text-[10px] text-amber-800">
                Ditampilkan mencolok di pita banner tiket untuk menarik antusiasme peserta.
              </p>
            </div>

            {/* Biaya & Keterangan Tambahan */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Biaya / Kupon
                </label>
                <input
                  type="text"
                  value={event.price}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      event: { ...prev.event, price: e.target.value },
                    }))
                  }
                  placeholder="Rp 10.000 / Lembar"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Watermark / Teks Sah
                </label>
                <input
                  type="text"
                  value={event.watermarkText}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      event: { ...prev.event, watermarkText: e.target.value },
                    }))
                  }
                  placeholder="KUPON SAH"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            {/* Syarat & Ketentuan */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Syarat & Ketentuan Ringkas
              </label>
              <textarea
                rows={2}
                value={event.terms}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    event: { ...prev.event, terms: e.target.value },
                  }))
                }
                placeholder="1. Sobekan wajib dimasukkan ke kotak undian sebelum jam 08.00 WIB.&#10;2. Pemenang wajib hadir saat pengundian."
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        )}

        {/* ================= TAB 2: PENOMORAN ================= */}
        {activeTab === 'numbering' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Mode Penomoran */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Mode Penomoran Kupon
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'sequential', label: 'Berurutan', desc: '0001, 0002...' },
                  { id: 'random', label: 'Acak Unik', desc: 'Tidak Berurutan' },
                  { id: 'custom', label: 'Kustom List', desc: 'Input / Paste' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() =>
                      onChange((prev) => ({
                        ...prev,
                        numbering: {
                          ...prev.numbering,
                          mode: m.id as 'sequential' | 'random' | 'custom',
                        },
                      }))
                    }
                    className={`p-2 rounded-lg border text-left cursor-pointer transition-all ${
                      numbering.mode === m.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-semibold">{m.label}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {numbering.mode !== 'custom' ? (
              <>
                {/* Prefix & Suffix */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Awalan (Prefix)
                    </label>
                    <input
                      type="text"
                      value={numbering.prefix}
                      onChange={(e) =>
                        onChange((prev) => ({
                          ...prev,
                          numbering: { ...prev.numbering, prefix: e.target.value },
                        }))
                      }
                      placeholder="JS-"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Akhiran (Suffix)
                    </label>
                    <input
                      type="text"
                      value={numbering.suffix}
                      onChange={(e) =>
                        onChange((prev) => ({
                          ...prev,
                          numbering: { ...prev.numbering, suffix: e.target.value },
                        }))
                      }
                      placeholder="(Opsional)"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                </div>

                {/* Start Number & Total Count */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Nomor Awal
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={numbering.startNumber}
                      onChange={(e) =>
                        onChange((prev) => ({
                          ...prev,
                          numbering: {
                            ...prev.numbering,
                            startNumber: parseInt(e.target.value) || 1,
                          },
                        }))
                      }
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Jumlah Total Kupon
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={3000}
                      value={numbering.totalCount}
                      onChange={(e) =>
                        onChange((prev) => ({
                          ...prev,
                          numbering: {
                            ...prev.numbering,
                            totalCount: Math.max(1, parseInt(e.target.value) || 1),
                          },
                        }))
                      }
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono font-bold text-indigo-700"
                    />
                  </div>
                </div>

                {/* Digits padding & Step */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Panjang Digit (Nol Depan)
                    </label>
                    <select
                      value={numbering.digits}
                      onChange={(e) =>
                        onChange((prev) => ({
                          ...prev,
                          numbering: {
                            ...prev.numbering,
                            digits: parseInt(e.target.value),
                          },
                        }))
                      }
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value={2}>2 Digit (01 - 99)</option>
                      <option value={3}>3 Digit (001 - 999)</option>
                      <option value={4}>4 Digit (0001 - 9999)</option>
                      <option value={5}>5 Digit (00001 - 99999)</option>
                      <option value={6}>6 Digit (000001 - 999999)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Jarak / Step
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={numbering.step}
                      onChange={(e) =>
                        onChange((prev) => ({
                          ...prev,
                          numbering: {
                            ...prev.numbering,
                            step: parseInt(e.target.value) || 1,
                          },
                        }))
                      }
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                </div>

                {/* Shortcut Jumlah Kupon Cepat */}
                <div>
                  <span className="block text-slate-500 mb-1 text-[11px]">
                    Atur Cepat Jumlah Kupon:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[20, 50, 100, 200, 500, 1000].map((cnt) => (
                      <button
                        key={cnt}
                        onClick={() =>
                          onChange((prev) => ({
                            ...prev,
                            numbering: { ...prev.numbering, totalCount: cnt },
                          }))
                        }
                        className={`px-2.5 py-1 rounded border text-xs font-mono cursor-pointer ${
                          numbering.totalCount === cnt
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {cnt}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Custom List Input */
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Masukkan Daftar Nomor / Nama Peserta
                </label>
                <textarea
                  rows={6}
                  value={numbering.customNumbers.join('\n')}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      numbering: {
                        ...prev.numbering,
                        customNumbers: e.target.value.split('\n'),
                      },
                    }))
                  }
                  placeholder="Ketik atau paste satu nomor per baris:&#10;VIP-001&#10;VIP-002&#10;Ahmad Dahlan&#10;Budi Santoso"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Satu baris per kupon. Cocok jika Anda sudah memiliki daftar nomor dari buku kupon lama atau nama peserta lomba.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: TATA LETAK & KERTAS ================= */}
        {activeTab === 'layout' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Pilihan Ukuran Kertas */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Ukuran Kertas Pencetakan
              </label>
              <div className="space-y-1.5">
                {(Object.keys(PAPER_DIMENSIONS) as PaperSize[]).map((sizeKey) => {
                  const p = PAPER_DIMENSIONS[sizeKey];
                  const isSelected = layout.paperSize === sizeKey;
                  return (
                    <button
                      key={sizeKey}
                      onClick={() =>
                        onChange((prev) => ({
                          ...prev,
                          layout: { ...prev.layout, paperSize: sizeKey },
                        }))
                      }
                      className={`w-full p-2.5 rounded-lg border text-left cursor-pointer flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{p.name}</span>
                          {sizeKey === 'F4' && (
                            <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.2 rounded font-semibold">
                              Populer Fotokopi ID
                            </span>
                          )}
                          {sizeKey === 'A4' && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded font-semibold">
                              Standar Printer
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 font-normal">
                          {p.description}
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">
                        {p.widthMm} × {p.heightMm} mm
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Orientasi Kertas */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Orientasi Kertas
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'portrait', label: 'Tegak (Portrait)' },
                  { id: 'landscape', label: 'Mendatar (Landscape)' },
                ].map((o) => (
                  <button
                    key={o.id}
                    onClick={() =>
                      onChange((prev) => ({
                        ...prev,
                        layout: {
                          ...prev.layout,
                          orientation: o.id as PaperOrientation,
                        },
                      }))
                    }
                    className={`py-2 px-3 rounded-lg border text-center font-medium cursor-pointer ${
                      layout.orientation === o.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Susunan Grid Kupon Per Lembar */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Susunan Kupon Per Lembar
              </label>

              {/* Grid Presets */}
              <div className="space-y-1 mb-2.5">
                {RECOMMENDED_GRIDS.map((g) => {
                  const isCurrent =
                    layout.columns === g.cols && layout.rows === g.rows;
                  return (
                    <button
                      key={g.label}
                      onClick={() =>
                        onChange((prev) => ({
                          ...prev,
                          layout: {
                            ...prev.layout,
                            columns: g.cols,
                            rows: g.rows,
                          },
                        }))
                      }
                      className={`w-full px-2.5 py-1.5 rounded-lg border text-left flex items-center justify-between cursor-pointer ${
                        isCurrent
                          ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xs">{g.label}</span>
                      <span
                        className={`text-[10px] ${
                          isCurrent ? 'text-indigo-100' : 'text-slate-400'
                        }`}
                      >
                        {g.recommendedFor}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom Rows & Columns */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <div>
                  <label className="block text-slate-600 mb-1">
                    Kolom (Samping)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={layout.columns}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        layout: {
                          ...prev.layout,
                          columns: Math.max(1, parseInt(e.target.value) || 1),
                        },
                      }))
                    }
                    className="w-full px-2.5 py-1 bg-white border border-slate-300 rounded-md font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">
                    Baris (Kebawah)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={layout.rows}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        layout: {
                          ...prev.layout,
                          rows: Math.max(1, parseInt(e.target.value) || 1),
                        },
                      }))
                    }
                    className="w-full px-2.5 py-1 bg-white border border-slate-300 rounded-md font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Margin & Jarak Spasi (Gap) */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Margin Kertas (mm)
                </label>
                <input
                  type="number"
                  min={2}
                  max={25}
                  value={layout.marginMm}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      layout: {
                        ...prev.layout,
                        marginMm: Math.max(2, parseInt(e.target.value) || 2),
                      },
                    }))
                  }
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Jarak Antar Kupon (mm)
                </label>
                <input
                  type="number"
                  min={0}
                  max={15}
                  value={layout.gapMm}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      layout: {
                        ...prev.layout,
                        gapMm: Math.max(0, parseInt(e.target.value) || 0),
                      },
                    }))
                  }
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>

            {/* Garis Potong Panduan Pemotongan */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Garis Panduan Potong Kupon
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'dashed', label: 'Garis Putus-Putus' },
                  { id: 'solid', label: 'Garis Tipis Solid' },
                  { id: 'cropmarks', label: 'Tanda Sudut (Crop Marks)' },
                  { id: 'none', label: 'Tanpa Garis Luar' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() =>
                      onChange((prev) => ({
                        ...prev,
                        layout: {
                          ...prev.layout,
                          cutLineStyle: c.id as CutLineStyle,
                        },
                      }))
                    }
                    className={`p-2 rounded-lg border text-left cursor-pointer ${
                      layout.cutLineStyle === c.id
                        ? 'border-indigo-600 bg-indigo-50 font-bold text-indigo-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: DESAIN, LOGO & SOBEKAN ================= */}
        {activeTab === 'style' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Pilihan Tema Warna */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Tema Warna Kupon
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {(Object.keys(THEMES) as CouponTheme[]).map((thmKey) => {
                  const t = THEMES[thmKey];
                  const isSelected = style.theme === thmKey;
                  return (
                    <button
                      key={thmKey}
                      onClick={() =>
                        onChange((prev) => ({
                          ...prev,
                          style: { ...prev.style, theme: thmKey },
                        }))
                      }
                      className={`p-2 rounded-lg border text-left cursor-pointer flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold ring-1 ring-indigo-500'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-5 h-5 rounded-md border border-slate-300 shadow-2xs ${t.headerBg}`}
                        />
                        <span>{t.name}</span>
                      </div>
                      {thmKey === 'ink-saver' && (
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                          Toner Hemat
                        </span>
                      )}
                      {thmKey === 'eco-outline' && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded border border-emerald-300">
                          Super Irit Tinta (B&W)
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Logo Upload Section */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
              <label className="block font-bold text-slate-800">
                Logo Acara / Instansi / Sponsor
              </label>

              {event.logoUrl ? (
                <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200">
                  <img
                    src={event.logoUrl}
                    alt="Logo Preview"
                    className="w-12 h-12 object-contain rounded border border-slate-200 p-0.5 bg-slate-50"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-slate-700 font-semibold block truncate">
                      Logo Terpasang
                    </span>
                    <button
                      onClick={() =>
                        onChange((prev) => ({
                          ...prev,
                          event: { ...prev.event, logoUrl: null },
                        }))
                      }
                      className="text-red-600 hover:text-red-700 inline-flex items-center gap-1 text-[11px] mt-1 cursor-pointer font-medium"
                    >
                      <Trash2 className="w-3 h-3" /> Hapus Logo
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-lg p-3 bg-white cursor-pointer transition-colors text-center">
                    <Upload className="w-5 h-5 text-indigo-500 mb-1" />
                    <span className="text-xs font-semibold text-slate-700">
                      Upload Logo (PNG / JPG / SVG)
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Rasio 1:1 atau logo transparan disarankan
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Logo shape */}
              {event.logoUrl && (
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-slate-600 text-[11px]">Bentuk:</span>
                  {(['rounded', 'circle', 'square'] as const).map((shp) => (
                    <button
                      key={shp}
                      onClick={() =>
                        onChange((prev) => ({
                          ...prev,
                          event: { ...prev.event, logoShape: shp },
                        }))
                      }
                      className={`px-2 py-0.5 rounded text-[10px] font-medium capitalize cursor-pointer border ${
                        event.logoShape === shp
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {shp === 'rounded' ? 'Membulat' : shp === 'circle' ? 'Bulat' : 'Persegi'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Pengaturan Sobekan Panitia (Tear-off Stub) */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Scissors className="w-4 h-4 text-slate-700" />
                  <span className="font-bold text-slate-800">
                    Sobekan Kupon Panitia (Tear-off)
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={event.showStub}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      event: { ...prev.event, showStub: e.target.checked },
                    }))
                  }
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              {event.showStub && (
                <div className="space-y-2.5 pt-1 border-t border-slate-200">
                  {/* Posisi Sobekan */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-600 mb-1">
                        Posisi Sobekan
                      </label>
                      <select
                        value={event.stubPosition}
                        onChange={(e) =>
                          onChange((prev) => ({
                            ...prev,
                            event: {
                              ...prev.event,
                              stubPosition: e.target.value as 'left' | 'right',
                            },
                          }))
                        }
                        className="w-full px-2.5 py-1 bg-white border border-slate-300 rounded-md"
                      >
                        <option value="left">Sisi Kiri (Standar)</option>
                        <option value="right">Sisi Kanan</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 mb-1">
                        Lebar Sobekan: {event.stubWidthPercent}%
                      </label>
                      <input
                        type="range"
                        min={20}
                        max={36}
                        value={event.stubWidthPercent}
                        onChange={(e) =>
                          onChange((prev) => ({
                            ...prev,
                            event: {
                              ...prev.event,
                              stubWidthPercent: parseInt(e.target.value),
                            },
                          }))
                        }
                        className="w-full accent-indigo-600"
                      />
                    </div>
                  </div>

                  {/* Form Isian Peserta di Sobekan */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-700 font-semibold">
                        Kolom Isian Peserta:
                      </label>
                      <button
                        onClick={handleAddStubField}
                        className="text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-0.5 text-[10px] font-bold cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Tambah Baris
                      </button>
                    </div>

                    <div className="space-y-1">
                      {event.stubFields.map((field, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={field}
                            onChange={(e) =>
                              handleUpdateStubField(fIdx, e.target.value)
                            }
                            className="flex-1 px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                          />
                          {event.stubFields.length > 1 && (
                            <button
                              onClick={() => handleRemoveStubField(fIdx)}
                              className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                              title="Hapus baris ini"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Kode QR & Barcode Verifikasi */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-slate-700" />
                  <span className="font-bold text-slate-800">
                    Kode Verifikasi (QR / Barcode)
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={event.showBarcode}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      event: { ...prev.event, showBarcode: e.target.checked },
                    }))
                  }
                  className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
                />
              </div>

              {event.showBarcode && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {[
                    { id: 'qr', label: 'QR Code (Rekomendasi)' },
                    { id: 'barcode', label: 'Garis Barcode' },
                  ].map((b) => (
                    <button
                      key={b.id}
                      onClick={() =>
                        onChange((prev) => ({
                          ...prev,
                          event: {
                            ...prev.event,
                            barcodeType: b.id as 'qr' | 'barcode',
                          },
                        }))
                      }
                      className={`p-1.5 rounded-lg border text-center text-xs cursor-pointer ${
                        event.barcodeType === b.id
                          ? 'border-indigo-600 bg-indigo-50 font-bold text-indigo-900'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
