import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Trophy, Home } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameStats, ThemeType } from '../types';
import { PixarMascot } from './PixarMascot';

interface GameOverViewProps {
  stats: GameStats;
  theme?: ThemeType;
  onRestart: () => void;
  onHome: () => void;
}

export const GameOverView: React.FC<GameOverViewProps> = ({
  stats,
  theme = 'pixar',
  onRestart,
  onHome,
}) => {
  const isNewHighScore = stats.score > 0 && stats.score >= stats.highScore;

  useEffect(() => {
    if (isNewHighScore) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: theme === 'classic'
            ? ['#000000', '#555555', '#aaaaaa', '#ffffff']
            : ['#a855f7', '#fbbf24', '#ef4444', '#3b82f6', '#10b981'],
        });
      } catch {}
    }
  }, [isNewHighScore, theme]);

  const getMascotQuote = () => {
    if (stats.score === 0) return 'Daha ilk adımda mı şaşırdın? Gözünü açık tut! ✨';
    if (stats.score < 30) return 'Fena değil ama tuzaklara dikkat et! 🎯';
    if (stats.score < 80) return 'Hızlısın ama kural aniden değişince yakalandın! ⚡';
    if (stats.score < 150) return 'Harika refleksler! Zorlu kurallara çok iyi dayandın! 🌟';
    return 'Efsanevi odaklanma ve refleks! Bir dahaki sefere daha da yüksek rekor kıracaksın! 🚀🔥';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-md select-none">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 320 }}
        className={`w-full max-w-sm rounded-[36px] p-7 shadow-[0_25px_60px_rgba(0,0,0,0.35)] border-2 flex flex-col items-center text-center relative overflow-hidden ${
          theme === 'classic'
            ? 'bg-white border-black text-black'
            : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 border-slate-200 text-slate-900'
        }`}
      >
        {/* Subtle top ambient glow */}
        <div
          className={`absolute top-0 inset-x-0 h-24 pointer-events-none ${
            theme === 'classic'
              ? 'bg-gradient-to-b from-zinc-200/40 to-transparent'
              : 'bg-gradient-to-b from-purple-500/10 to-transparent'
          }`}
        />

        {/* 3D Pixar / Classic Mascot */}
        <div className="mb-2 relative">
          <PixarMascot
            emotion={isNewHighScore ? 'shocked' : 'laughing'}
            size="lg"
            theme={theme}
          />
        </div>

        {/* Title: "OYUN BİTTİ" (no yellow emoji) */}
        <h2 className="text-3xl font-black tracking-tight leading-none mb-1">
          OYUN BİTTİ
        </h2>

        {/* Score display matching screenshot */}
        <div className="w-full my-3 flex items-center justify-center">
          <div
            className={`w-full p-4 rounded-3xl border flex items-center justify-between ${
              theme === 'classic'
                ? 'bg-zinc-50 border-black/30'
                : 'bg-white border-slate-200/90 shadow-sm'
            }`}
          >
            <div className="text-left">
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                Skorun
              </span>
              <span className="text-3xl font-black tracking-tight font-mono">
                {stats.score}
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                En Yüksek
              </span>
              <span className="text-2xl font-black text-amber-500 flex items-center justify-end gap-1 font-mono">
                <Trophy className="w-4 h-4 fill-amber-500" />
                {stats.highScore}
              </span>
            </div>
          </div>
        </div>

        {/* Mascot Feedback Speech Bubble */}
        <div
          className={`w-full p-3.5 rounded-2xl border text-xs font-semibold leading-relaxed mb-4 text-left ${
            theme === 'classic'
              ? 'bg-zinc-100 border-black/30 text-black'
              : 'bg-blue-50/70 border-blue-100 text-blue-950'
          }`}
        >
          <span className="font-black text-blue-600 mr-1.5">Maskot:</span>
          <span>"{getMascotQuote()}"</span>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          <button
            onClick={onRestart}
            className={`w-full py-3.5 px-6 rounded-2xl font-black text-base shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer ${
              theme === 'classic'
                ? 'bg-black text-white hover:bg-zinc-800'
                : 'bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white shadow-purple-950/20 hover:brightness-110'
            }`}
          >
            <RotateCcw className="w-5 h-5" />
            <span>Tekrar Dene</span>
          </button>

          <button
            onClick={onHome}
            className={`w-full py-3 px-6 rounded-2xl font-bold text-sm border flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer ${
              theme === 'classic'
                ? 'bg-white border-black text-black hover:bg-zinc-50'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Ana Menü</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
