import React from 'react';
import { motion } from 'motion/react';
import { AlertOctagon, HeartCrack, Zap } from 'lucide-react';

interface MistakeEffectProps {
  reason?: string;
  livesRemaining: number;
}

export const MistakeEffect: React.FC<MistakeEffectProps> = ({
  reason = 'Tuzak! Sakın Dokunma!',
  livesRemaining,
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
      {/* 1. Dramatic Red Warning Vignette Flash */}
      <motion.div
        initial={{ opacity: 0.85 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 bg-red-600/35 border-[10px] border-red-600 shadow-[inset_0_0_80px_rgba(220,38,38,0.8)]"
      />

      {/* 2. Comic Electric / Lightning Fracture Lines */}
      <motion.svg
        initial={{ opacity: 1, scale: 0.95 }}
        animate={{ opacity: 0, scale: 1.15 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="absolute inset-0 w-full h-full stroke-red-500 fill-none"
      >
        <path
          d="M 50 0 L 70 80 L 40 140 L 90 220 L 50 340 L 120 480"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="drop-shadow(0 0 10px #ef4444)"
        />
        <path
          d="M 280 0 L 250 100 L 290 190 L 220 280 L 260 400"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="drop-shadow(0 0 10px #ef4444)"
        />
        <path
          d="M 0 250 L 120 230 L 190 280 L 320 240 L 400 290"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="drop-shadow(0 0 10px #ef4444)"
        />
      </motion.svg>

      {/* 3. Huge Comic "BONK / TUZAK!" Banner */}
      <motion.div
        initial={{ scale: 0.2, rotate: -15, opacity: 0 }}
        animate={{
          scale: [0.2, 1.35, 1],
          rotate: [-15, 6, 0],
          opacity: [0, 1, 1],
        }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.45, ease: 'backOut' }}
        className="relative z-10 flex flex-col items-center text-center p-6 rounded-3xl bg-slate-950 text-white border-4 border-red-600 shadow-[0_0_60px_rgba(239,68,68,0.7)] max-w-[320px] mx-4"
      >
        {/* Animated Broken Heart & Zap Icon */}
        <div className="relative mb-2">
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.3, repeat: 2 }}
            className="w-16 h-16 rounded-2xl bg-red-600/30 border-2 border-red-500 flex items-center justify-center text-red-500 shadow-lg"
          >
            <HeartCrack className="w-10 h-10 animate-pulse" />
          </motion.div>
          <Zap className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 fill-yellow-400 animate-bounce" />
        </div>

        <span className="text-2xl font-black text-red-500 tracking-tight leading-none uppercase">
          TUZAK! 💥
        </span>

        <p className="text-sm font-bold text-white mt-1">
          {reason}
        </p>

        <div className="mt-3 px-3 py-1 rounded-full bg-red-950 border border-red-800 text-[11px] font-black text-red-300">
          Kalan Can: {'❤️'.repeat(Math.max(0, livesRemaining))} ({livesRemaining})
        </div>
      </motion.div>
    </div>
  );
};
