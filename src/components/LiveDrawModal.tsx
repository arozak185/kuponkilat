import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { soundEffects } from '../utils/audioSynth';
import { WinnerRecord } from '../types/ticket';
import {
  Trophy,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  X,
  Play,
  RotateCcw,
  Sparkles,
  Download,
  Trash2,
} from 'lucide-react';

interface LiveDrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketNumbers: string[];
  eventTitle: string;
}

export const LiveDrawModal: React.FC<LiveDrawModalProps> = ({
  isOpen,
  onClose,
  ticketNumbers,
  eventTitle,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDisplayNum, setCurrentDisplayNum] = useState<string>('---');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [prizeName, setPrizeName] = useState('Hadiah Utama / Doorprize');
  const [winners, setWinners] = useState<WinnerRecord[]>([]);
  const [allowRepeats, setAllowRepeats] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const animIntervalRef = useRef<number | null>(null);

  // Available pool of numbers
  const wonNumbers = new Set(winners.map((w) => w.ticketNumber));
  const availablePool = allowRepeats
    ? ticketNumbers
    : ticketNumbers.filter((n) => !wonNumbers.has(n));

  useEffect(() => {
    if (ticketNumbers.length > 0 && currentDisplayNum === '---') {
      setCurrentDisplayNum(ticketNumbers[0]);
    }
  }, [ticketNumbers, currentDisplayNum]);

  // Clean up timer
  useEffect(() => {
    return () => {
      if (animIntervalRef.current) {
        clearInterval(animIntervalRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'],
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 60,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 60,
          origin: { x: 1 },
        });
      }, 250);
    } catch {
      // ignore
    }
  };

  const startDraw = () => {
    if (isDrawing || availablePool.length === 0) return;

    setIsDrawing(true);
    let speed = 40;
    let elapsed = 0;
    const totalDuration = 3500; // 3.5 seconds suspense

    const step = () => {
      // Pick random number from pool for visual flip
      const randomIdx = Math.floor(Math.random() * availablePool.length);
      const tempNum = availablePool[randomIdx];
      setCurrentDisplayNum(tempNum);

      if (soundEnabled) {
        soundEffects.playTick();
      }

      elapsed += speed;

      if (elapsed < totalDuration) {
        // Slow down gradually at the end for massive suspense
        if (elapsed > totalDuration * 0.7) {
          speed += 25;
        } else if (elapsed > totalDuration * 0.4) {
          speed += 8;
        }
        animIntervalRef.current = window.setTimeout(step, speed);
      } else {
        // Final Winner chosen!
        const finalWinner = availablePool[Math.floor(Math.random() * availablePool.length)];
        setCurrentDisplayNum(finalWinner);
        setIsDrawing(false);

        if (soundEnabled) {
          soundEffects.playFanfare();
        }
        triggerConfetti();

        // Record winner
        const newWinner: WinnerRecord = {
          id: `${Date.now()}-${Math.random()}`,
          ticketNumber: finalWinner,
          prizeName: prizeName || 'Doorprize',
          timestamp: new Date().toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
        };
        setWinners((prev) => [newWinner, ...prev]);
      }
    };

    animIntervalRef.current = window.setTimeout(step, speed);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const exportWinnersCsv = () => {
    if (winners.length === 0) return;
    let csv = 'No,Nomor Undian,Hadiah,Waktu Pengundian\n';
    winners.forEach((w, idx) => {
      csv += `${winners.length - idx},"${w.ticketNumber}","${w.prizeName}","${w.timestamp}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Daftar_Pemenang_${eventTitle.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in"
    >
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-white">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-wide flex items-center gap-2">
                <span>PANGGUNG PENGUNDIAN DOORPRIZE LIVE</span>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full border border-amber-500/30">
                  Ready to Screen
                </span>
              </h2>
              <p className="text-xs text-slate-400 truncate max-w-md">{eventTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled((s) => !s)}
              className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                soundEnabled
                  ? 'bg-slate-800 border-slate-700 text-amber-400'
                  : 'bg-slate-800/50 border-slate-800 text-slate-500'
              }`}
              title={soundEnabled ? 'Matikan Suara' : 'Aktifkan Efek Suara'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
              title="Layar Penuh (Proyektor / LED Screen)"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-red-500/20 hover:text-red-400 border border-slate-700 text-slate-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-6">
          {/* Left: Huge Roller Screen */}
          <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-inner">
            {/* Background Glow */}
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Prize Label Input */}
            <div className="w-full max-w-md mb-4 text-center z-1">
              <label className="text-[11px] font-semibold text-amber-400/90 uppercase tracking-widest block mb-1">
                Kategori Hadiah yang Diundi:
              </label>
              <input
                type="text"
                value={prizeName}
                disabled={isDrawing}
                onChange={(e) => setPrizeName(e.target.value)}
                placeholder="Contoh: Grand Prize - Honda Beat / Kulkas 2 Pintu"
                className="w-full text-center px-4 py-2 bg-slate-800/90 border border-amber-500/40 rounded-xl text-amber-200 font-bold text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            {/* BIG NUMBER DISPLAY BOX */}
            <div className="my-6 relative z-1 w-full max-w-lg">
              <div
                className={`py-8 px-6 rounded-2xl border-2 text-center transition-all transform shadow-2xl relative overflow-hidden ${
                  isDrawing
                    ? 'border-amber-400 bg-slate-950/90 scale-102 ring-4 ring-amber-400/20'
                    : 'border-slate-700 bg-slate-950/80'
                }`}
              >
                <div className="text-[11px] uppercase tracking-widest text-slate-400 font-extrabold mb-2">
                  {isDrawing ? 'MEMUTAR NOMOR UNDIAN...' : 'NOMOR KUPON PEMENANG'}
                </div>

                <div className="font-mono font-black text-5xl sm:text-7xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 select-all drop-shadow-md">
                  {currentDisplayNum}
                </div>

                {isDrawing && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer pointer-events-none" />
                )}
              </div>
            </div>

            {/* Draw Action Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3 z-1 w-full max-w-md justify-center">
              <button
                onClick={startDraw}
                disabled={isDrawing || availablePool.length === 0}
                className={`w-full py-3.5 px-8 rounded-xl font-extrabold text-base flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg active:scale-95 ${
                  isDrawing
                    ? 'bg-amber-600/50 text-slate-400 cursor-not-allowed'
                    : availablePool.length === 0
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:from-amber-400 hover:to-yellow-300 shadow-amber-500/25'
                }`}
              >
                {isDrawing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Sedang Mengundi...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" />
                    <span>PUTAR UNDIAN SEKARANG</span>
                  </>
                )}
              </button>
            </div>

            {/* Pool Statistics */}
            <div className="flex items-center gap-4 mt-4 text-xs text-slate-400 z-1">
              <span>
                Kupon Tersedia: <b className="text-white">{availablePool.length}</b> dari{' '}
                {ticketNumbers.length}
              </span>
              <span>•</span>
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={allowRepeats}
                  onChange={(e) => setAllowRepeats(e.target.checked)}
                  className="rounded text-amber-500"
                />
                <span>Boleh Menang Lagi</span>
              </label>
            </div>
          </div>

          {/* Right: Winner History Board */}
          <div className="w-full lg:w-80 flex flex-col bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-sm text-slate-200">
                  Daftar Pemenang ({winners.length})
                </span>
              </div>

              {winners.length > 0 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={exportWinnersCsv}
                    className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
                    title="Download Rekap CSV"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Kosongkan riwayat pemenang?')) setWinners([]);
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-slate-800 cursor-pointer"
                    title="Reset Riwayat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Winner Cards List */}
            <div className="flex-1 overflow-y-auto space-y-2 py-3 pr-1">
              {winners.length === 0 ? (
                <div className="text-center py-12 text-slate-600 text-xs">
                  Belum ada pemenang yang diundi.
                  <br />
                  Klik tombol <b>PUTAR UNDIAN</b> untuk memulai!
                </div>
              ) : (
                winners.map((win, idx) => (
                  <div
                    key={win.id}
                    className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 p-2.5 rounded-xl flex items-center justify-between gap-2 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-900/50">
                          #{winners.length - idx}
                        </span>
                        <span className="font-mono font-bold text-base text-white">
                          {win.ticketNumber}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5 font-medium">
                        {win.prizeName}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0">
                      {win.timestamp}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
