import React from 'react';
import { motion } from 'motion/react';
import { TOTAL_LEVELS, getLevelConfig, getLevelStars, getUnlockedLevel } from '../utils/levels';
import { ThemeType } from '../types';
import { Lock, Star, X, Play } from 'lucide-react';

interface LevelSelectModalProps {
  onClose: () => void;
  onSelectLevel: (level: number) => void;
  theme?: ThemeType;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  onClose,
  onSelectLevel,
  theme = 'pixar',
}) => {
  const unlocked = getUnlockedLevel();
  const starsMap = getLevelStars();

  const levels = Array.from({ length: TOTAL_LEVELS }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md select-none animate-in fade-in duration-200">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 320 }}
        className={`w-full max-w-md max-h-[90vh] rounded-[36px] p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.35)] border-2 flex flex-col relative overflow-hidden ${
          theme === 'classic'
            ? 'bg-white border-black text-black'
            : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">BÖLÜMLER</h2>
            <p className="text-xs font-bold text-slate-400">
              Açık: {Math.min(unlocked, TOTAL_LEVELS)} / {TOTAL_LEVELS} Bölüm
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-2xl border transition-all cursor-pointer active:scale-95 ${
              theme === 'classic'
                ? 'bg-zinc-100 border-black text-black'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level Grid */}
        <div className="flex-1 overflow-y-auto py-4 grid grid-cols-4 sm:grid-cols-5 gap-2.5 sm:gap-3 pr-1">
          {levels.map((lvl) => {
            const isUnlocked = lvl <= unlocked;
            const stars = starsMap[lvl] || 0;
            const config = getLevelConfig(lvl);

            if (!isUnlocked) {
              return (
                <div
                  key={lvl}
                  className={`aspect-square rounded-2xl border flex flex-col items-center justify-center p-2 opacity-60 cursor-not-allowed ${
                    theme === 'classic'
                      ? 'bg-zinc-100 border-dashed border-zinc-400 text-zinc-400'
                      : 'bg-slate-100 border-dashed border-slate-300 text-slate-400'
                  }`}
                >
                  <Lock className="w-5 h-5 mb-1" />
                  <span className="text-xs font-black">{lvl}</span>
                </div>
              );
            }

            return (
              <motion.button
                key={lvl}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onSelectLevel(lvl);
                  onClose();
                }}
                className={`relative aspect-square rounded-2xl border-2 flex flex-col items-center justify-between p-2 transition-all cursor-pointer shadow-sm group ${
                  theme === 'classic'
                    ? 'bg-white border-black text-black hover:bg-zinc-50'
                    : lvl === unlocked
                    ? 'bg-gradient-to-b from-amber-50 to-orange-50/80 border-amber-400 shadow-amber-200/50'
                    : 'bg-white border-slate-200 hover:border-slate-400'
                }`}
              >
                {/* Active Indicator pulse for current unlocked highest level */}
                {lvl === unlocked && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                  </span>
                )}

                {/* Level number */}
                <div className="text-sm font-black tracking-tight">{lvl}</div>

                {/* Target badge */}
                <div className="text-[10px] font-bold text-slate-400 font-mono">
                  {config.requiredCorrectTaps} hedef
                </div>

                {/* Stars earned */}
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3].map((s) => (
                    <Star
                      key={s}
                      className={`w-2.5 h-2.5 ${
                        s <= stars
                          ? theme === 'classic'
                            ? 'fill-black text-black'
                            : 'fill-amber-400 text-amber-500'
                          : 'text-slate-200 fill-slate-100'
                      }`}
                    />
                  ))}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="pt-2 text-center text-xs font-semibold text-slate-400 border-t border-slate-200">
          Her bölümde gereken doğru dokunuş hedefini tamamla ve bir sonrakini aç!
        </div>
      </motion.div>
    </div>
  );
};
