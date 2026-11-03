import React, { useEffect, useState } from 'react';
import { TicketConfig } from '../types/ticket';
import { THEMES } from '../utils/themeStyles';
import { getQrDataUrl, getCachedQr } from '../utils/qrHelper';
import { generateBarcodeSvg } from '../utils/barcodeSvg';
import { Scissors, Calendar, Clock, MapPin, Gift, Trophy } from 'lucide-react';

interface TicketItemProps {
  ticketNumber: string;
  config: TicketConfig;
  className?: string;
  style?: React.CSSProperties;
}

export const TicketItem: React.FC<TicketItemProps> = ({
  ticketNumber,
  config,
  className = '',
  style = {},
}) => {
  const { event, layout, style: ticketStyle } = config;
  const theme = THEMES[ticketStyle.theme] || THEMES['red-white'];
  const isEcoOutline = ticketStyle.theme === 'eco-outline';
  const isInkSaver = ticketStyle.theme === 'ink-saver' || isEcoOutline;

  const cacheKey = `${ticketNumber}|${event.title}`;
  const [qrSrc, setQrSrc] = useState<string>(() => getCachedQr(cacheKey) || '');
  const [barcodeSvg, setBarcodeSvg] = useState<string>(() =>
    event.barcodeType === 'barcode' ? generateBarcodeSvg(ticketNumber, 110, 32) : ''
  );

  useEffect(() => {
    let active = true;
    if (event.showBarcode) {
      if (event.barcodeType === 'qr') {
        const cached = getCachedQr(cacheKey);
        if (cached) {
          setQrSrc(cached);
        } else {
          getQrDataUrl(cacheKey).then((url) => {
            if (active) setQrSrc(url);
          });
        }
      } else {
        setBarcodeSvg(generateBarcodeSvg(ticketNumber, 110, 32));
      }
    }
    return () => {
      active = false;
    };
  }, [ticketNumber, event.showBarcode, event.barcodeType, event.title, cacheKey]);

  const borderStyleClass =
    layout.cutLineStyle === 'dashed'
      ? 'border-dashed'
      : layout.cutLineStyle === 'solid'
      ? 'border-solid'
      : 'border-solid';

  return (
    <div
      style={style}
      className={`relative flex select-none overflow-hidden rounded-md bg-white text-slate-800 shadow-xs print:shadow-none transition-all ${
        layout.showTicketBorder
          ? `border-2 ${borderStyleClass} ${
              isEcoOutline
                ? 'border-black'
                : isInkSaver
                ? 'border-neutral-800'
                : theme.borderColor
            }`
          : ''
      } ${className}`}
    >
      {/* Background Watermark if set */}
      {event.watermarkText && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-5 z-0">
          <span className="text-4xl font-black uppercase tracking-widest -rotate-25 whitespace-nowrap">
            {event.watermarkText}
          </span>
        </div>
      )}

      {/* TEAR-OFF STUB (Sobekan Panitia) */}
      {event.showStub && event.stubPosition === 'left' && (
        <StubSection
          config={config}
          theme={theme}
          ticketNumber={ticketNumber}
          isInkSaver={isInkSaver}
          isEcoOutline={isEcoOutline}
          position="left"
        />
      )}

      {/* MAIN TICKET SECTION */}
      <div className="relative flex-1 flex flex-col justify-between p-2.5 min-w-0 z-1">
        {/* Header Ribbon */}
        <div
          className={`-mx-2.5 -mt-2.5 px-3 py-1.5 flex items-center justify-between ${
            isEcoOutline
              ? 'bg-white border-b-2 border-black text-black'
              : isInkSaver
              ? 'bg-neutral-100 border-b-2 border-neutral-800 text-neutral-900'
              : `${theme.headerBg} ${theme.headerText}`
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            {event.logoUrl ? (
              <img
                src={event.logoUrl}
                alt="Logo Kegiatan"
                className={`w-6 h-6 object-contain shrink-0 bg-white p-0.5 ${
                  event.logoShape === 'circle'
                    ? 'rounded-full'
                    : event.logoShape === 'rounded'
                    ? 'rounded'
                    : 'rounded-none'
                }`}
              />
            ) : (
              <div
                className={`w-6 h-6 shrink-0 flex items-center justify-center rounded ${
                  isEcoOutline
                    ? 'border border-black text-black bg-white'
                    : isInkSaver
                    ? 'bg-neutral-800 text-white'
                    : 'bg-white/20 text-white'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-black text-xs leading-tight tracking-wide truncate uppercase">
                {event.title}
              </h3>
              {(event.subtitle || event.organizer) && (
                <p className="text-[10px] leading-none opacity-85 truncate font-medium mt-0.5">
                  {event.subtitle || event.organizer}
                </p>
              )}
            </div>
          </div>

          {event.price && (
            <span
              className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded ml-2 ${
                isEcoOutline
                  ? 'border border-black text-black bg-white'
                  : isInkSaver
                  ? 'bg-neutral-800 text-white'
                  : 'bg-white/20 text-white'
              }`}
            >
              {event.price}
            </span>
          )}
        </div>

        {/* Grand Prize Highlight */}
        {event.grandPrize && (
          <div
            className={`my-1.5 px-2.5 py-1 rounded text-[10.5px] flex items-center gap-1.5 border leading-tight ${
              isEcoOutline
                ? 'bg-white text-black border-2 border-dashed border-black font-semibold'
                : isInkSaver
                ? 'bg-neutral-50 text-neutral-900 border-neutral-300'
                : theme.grandPrizeBg
            }`}
          >
            <Gift
              className={`w-3.5 h-3.5 shrink-0 ${
                isEcoOutline
                  ? 'text-black'
                  : isInkSaver
                  ? 'text-neutral-800'
                  : 'text-amber-600'
              }`}
            />
            <div className="truncate font-semibold">
              <span className="font-extrabold uppercase text-[9.5px] mr-1 opacity-90">
                DOORPRIZE:
              </span>
              {event.grandPrize}
            </div>
          </div>
        )}

        {/* Date, Time & Venue */}
        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-0.5 text-[10px] text-slate-600 mb-1 leading-tight">
          {event.date && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="font-medium text-slate-800">{event.date}</span>
            </span>
          )}
          {event.time && (
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{event.time}</span>
            </span>
          )}
          {event.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate max-w-[140px]">{event.location}</span>
            </span>
          )}
        </div>

        {/* PROMINENT LARGE TICKET NUMBER SECTION */}
        <div className="mt-auto pt-1.5 flex items-center justify-between gap-2 border-t border-slate-200">
          <div
            className={`flex-1 py-1.5 px-3 rounded-lg text-center transition-all ${
              isEcoOutline
                ? 'bg-white border-2 border-black text-black'
                : isInkSaver
                ? 'bg-neutral-900 text-white'
                : `${theme.badgeBg} ${theme.badgeText} shadow-xs`
            }`}
          >
            <div className="text-[8.5px] font-extrabold tracking-widest uppercase opacity-90 leading-tight">
              NOMOR UNDIAN
            </div>
            <div className="text-xl sm:text-2xl font-black font-mono tracking-widest leading-none mt-1">
              {ticketNumber}
            </div>
          </div>

          {/* Barcode / QR display (hanya muncul bila user aktifkan) */}
          {event.showBarcode && (
            <div className="shrink-0 flex flex-col items-center justify-center pl-1">
              {event.barcodeType === 'qr' && qrSrc ? (
                <img
                  src={qrSrc}
                  alt={`QR ${ticketNumber}`}
                  className="w-10 h-10 object-contain rounded border border-slate-200 p-0.5"
                />
              ) : event.barcodeType === 'barcode' && barcodeSvg ? (
                <div className="text-center">
                  <img
                    src={barcodeSvg}
                    alt={`Barcode ${ticketNumber}`}
                    className="h-6 w-20 object-contain"
                  />
                  <span className="text-[8px] font-mono font-semibold tracking-tighter text-slate-600 block">
                    {ticketNumber}
                  </span>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Small terms note */}
        {event.terms && (
          <div className="mt-1 text-[8px] text-slate-400 leading-tight truncate">
            {event.terms.replace(/\n/g, ' • ')}
          </div>
        )}
      </div>

      {/* TEAR-OFF STUB (Right side option) */}
      {event.showStub && event.stubPosition === 'right' && (
        <StubSection
          config={config}
          theme={theme}
          ticketNumber={ticketNumber}
          isInkSaver={isInkSaver}
          isEcoOutline={isEcoOutline}
          position="right"
        />
      )}
    </div>
  );
};

interface StubProps {
  config: TicketConfig;
  theme: typeof THEMES['red-white'];
  ticketNumber: string;
  isInkSaver: boolean;
  isEcoOutline: boolean;
  position: 'left' | 'right';
}

const StubSection: React.FC<StubProps> = ({
  config,
  theme,
  ticketNumber,
  isInkSaver,
  isEcoOutline,
  position,
}) => {
  const { event } = config;
  const fields = event.stubFields?.length
    ? event.stubFields
    : ['Nama Lengkap', 'No. WhatsApp', 'Alamat/Unit'];

  return (
    <div
      style={{ width: `${event.stubWidthPercent}%` }}
      className={`relative flex flex-col justify-between p-2 shrink-0 select-none ${
        isEcoOutline
          ? 'bg-white'
          : isInkSaver
          ? 'bg-neutral-50'
          : theme.stubBg
      } ${
        position === 'left'
          ? `border-r-2 border-dashed ${isEcoOutline ? 'border-black' : 'border-slate-300'}`
          : `border-l-2 border-dashed ${isEcoOutline ? 'border-black' : 'border-slate-300'}`
      }`}
    >
      {/* Perforation Cut Indicator Tag */}
      <div
        className={`absolute top-1 text-[8px] font-bold flex items-center gap-0.5 pointer-events-none z-10 ${
          position === 'left' ? '-right-3.5' : '-left-3.5'
        } ${isEcoOutline ? 'text-black' : 'text-slate-400'}`}
      >
        <Scissors className={`w-3.5 h-3.5 ${isEcoOutline ? 'text-black' : 'text-slate-500'}`} />
      </div>

      {/* Top Title */}
      <div
        className={`text-center pb-1 border-b ${
          isEcoOutline ? 'border-black' : 'border-slate-200/80'
        }`}
      >
        <span
          className={`text-[9px] font-extrabold uppercase tracking-tight block ${
            isEcoOutline ? 'text-black' : 'text-slate-700'
          }`}
        >
          SOBEKAN PANITIA
        </span>
        <span
          className={`text-[7.5px] block truncate ${
            isEcoOutline ? 'text-black font-medium' : 'text-slate-500'
          }`}
        >
          {event.title}
        </span>
      </div>

      {/* Prominent Ticket Number in Stub */}
      <div
        className={`text-center my-1 rounded-lg py-1 px-1 shadow-2xs border ${
          isEcoOutline
            ? 'bg-white border-2 border-black text-black'
            : isInkSaver
            ? 'bg-white border-2 border-neutral-900 text-black'
            : 'bg-white/95 border-2 border-slate-300'
        }`}
      >
        <span className="text-[8px] font-extrabold text-slate-600 block uppercase tracking-wider leading-tight">
          NO. UNDIAN
        </span>
        <span
          className={`text-base sm:text-lg font-black font-mono tracking-wider block leading-tight mt-0.5 ${
            isEcoOutline || isInkSaver ? 'text-black' : theme.accentColor
          }`}
        >
          {ticketNumber}
        </span>
      </div>

      {/* Hand-fill blank fields with dotted lines */}
      <div className="space-y-1.5 my-1">
        {fields.map((field, idx) => (
          <div key={idx} className="text-[8px] leading-none">
            <span
              className={`font-semibold ${
                isEcoOutline ? 'text-black' : 'text-slate-600'
              }`}
            >
              {field}:
            </span>
            <div
              className={`mt-0.5 w-full border-b border-dotted h-2 ${
                isEcoOutline ? 'border-black' : 'border-slate-400'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Footer Instructions */}
      <div
        className={`text-[7.5px] text-center font-medium pt-1 border-t ${
          isEcoOutline ? 'border-black text-black' : 'border-slate-200/60 text-slate-400'
        }`}
      >
        Dimasukkan ke Kotak Undian
      </div>
    </div>
  );
};
