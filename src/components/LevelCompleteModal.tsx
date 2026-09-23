import React from 'react';
import { motion } from 'motion/react';
import { PixarMascot } from './PixarMascot';
import { ThemeType } from '../types';
import { Play, Grid, Home, Star } from 'lucide-react';

interface LevelCompleteModalProps {
  levelNumber: number;
  stars: number;
  score: number;
  targetTaps: number;
  hasNextLevel: boolean;
  theme?: ThemeType;
  onNextLevel: () => void;
  onSelectLevels: () => void;
  onHome: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  levelNumber,
  stars,
  score,
  targetTaps,
  hasNextLevel,
  theme = 'pixar',
  onNextLevel,
  onSelectLevels,
  onHome,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md select-none animate-in fade-in duration-200">
      <motion.div
        initial={{ scale: 0.75, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className={`w-full max-w-sm rounded-[36px] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.35)] border-2 flex flex-col items-center text-center relative overflow-hidden ${
          theme === 'classic'
            ? 'bg-white border-black text-black'
            : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 border-slate-200 text-slate-900'
        }`}
      >
        {/* Subtle top ambient glow */}
        <div
          className={`absolute top-0 inset-x-0 h-28 pointer-events-none ${
            theme === 'classic'
              ? 'bg-gradient-to-b from-zinc-200/40 to-transparent'
              : 'bg-gradient-to-b from-amber-400/20 via-yellow-200/10 to-transparent'
          }`}
        />

        {/* Mascot */}
        <div className="mb-2 relative">
          <PixarMascot emotion="shocked" size="lg" theme={theme} />
        </div>

        {/* Level Tag */}
        <div
          className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-1 ${
            theme === 'classic'
              ? 'bg-black text-white'
              : 'bg-amber-100 text-amber-800 border border-amber-300'
          }`}
        >
          BÖLÜM {levelNumber} TAMAMLANDI!
        </div>

        <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-none mb-3">
          Tebrikler! 🎉
        </h2>

        {/* Stars */}
        <div className="flex items-center gap-2 mb-4">
          {[1, 2, 3].map((s) => {
            const earned = s <= stars;
            return (
              <motion.div
                key={s}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15 * s, type: 'spring', stiffness: 400 }}
              >
                <Star
                  className={`w-9 h-9 ${
                    earned
                      ? theme === 'classic'
                        ? 'fill-black text-black stroke-[1.5]'
                        : 'fill-amber-400 text-amber-500 drop-shadow-[0_4px_8px_rgba(245,158,11,0.5)]'
                      : 'text-slate-300 fill-slate-100'
                  }`}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Score & Target Summary Box */}
        <div
          className={`w-full p-3.5 rounded-2xl border mb-5 flex items-center justify-around ${
            theme === 'classic'
              ? 'bg-zinc-50 border-black/30'
              : 'bg-white border-slate-200/90 shadow-sm'
          }`}
        >
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Doğru Dokunuş
            </div>
            <div className="text-lg font-black font-mono">
              {targetTaps} / {targetTaps} ✨
            </div>
          </div>
          <div className="w-[1px] h-8 bg-slate-200" />
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Toplam Skor
            </div>
            <div className="text-lg font-black font-mono">{score}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          {hasNextLevel && (
            <button
              onClick={onNextLevel}
              className={`w-full py-3.5 px-5 rounded-2xl font-black text-base shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer ${
                theme === 'classic'
                  ? 'bg-black text-white hover:bg-zinc-800'
                  : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white shadow-emerald-500/25 hover:brightness-105'
              }`}
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Sonraki Bölüm ({levelNumber + 1})</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2 w-full">
            <button
              onClick={onSelectLevels}
              className={`py-3 px-3 rounded-2xl font-bold text-sm border flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer ${
                theme === 'classic'
                  ? 'bg-white border-black text-black hover:bg-zinc-100'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Grid className="w-4 h-4" />
              <span>Bölümler</span>
            </button>

            <button
              onClick={onHome}
              className={`py-3 px-3 rounded-2xl font-bold text-sm border flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer ${
                theme === 'classic'
                  ? 'bg-white border-black text-black hover:bg-zinc-100'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Ana Menü</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
