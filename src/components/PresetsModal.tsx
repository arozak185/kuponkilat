import React from 'react';
import { PRESET_TEMPLATES, PresetTemplate } from '../utils/presets';
import { TicketConfig } from '../types/ticket';
import { X, Sparkles, Check, ArrowRight } from 'lucide-react';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (config: TicketConfig) => void;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-800">
                Pilih Contoh Template Kegiatan Siap Pakai
              </h2>
              <p className="text-xs text-slate-500">
                Gunakan template yang sesuai dengan acara Anda untuk mempercepat pembuatan kupon
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

        {/* List of presets */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRESET_TEMPLATES.map((preset) => (
            <div
              key={preset.id}
              className="group border border-slate-200 hover:border-indigo-500 rounded-xl p-4 bg-white hover:bg-indigo-50/20 transition-all flex flex-col justify-between shadow-2xs hover:shadow-md cursor-pointer"
              onClick={() => {
                onSelectPreset(preset.config);
                onClose();
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                    {preset.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Kertas {preset.config.layout.paperSize} ({preset.config.layout.columns}x{preset.config.layout.rows})
                  </span>
                </div>

                <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {preset.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {preset.description}
                </p>

                {/* Event summary badges */}
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-[11px] text-slate-600">
                  <div className="truncate">
                    <b>Acara:</b> {preset.config.event.title}
                  </div>
                  <div className="truncate text-amber-700 font-medium">
                    <b>Doorprize:</b> {preset.config.event.grandPrize}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 flex items-center justify-end text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
                <span>Gunakan Template Ini</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
