import React from 'react';
import { motion } from 'motion/react';

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  angle: number;
  distance: number;
}

interface SparkleEffectProps {
  combo?: number;
  origin?: { x: number; y: number } | null;
}

export const SparkleEffect: React.FC<SparkleEffectProps> = ({ combo = 1, origin }) => {
  const count = Math.min(14 + combo * 2, 30);
  const colors = ['#f59e0b', '#fbbf24', '#38bdf8', '#a855f7', '#ec4899', '#10b981', '#ffffff'];

  const particles: SparkleParticle[] = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 2 * Math.PI + (Math.random() - 0.5) * 0.4;
    const distance = 50 + Math.random() * 100;
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      size: 10 + Math.random() * 16,
      color: colors[i % colors.length],
      delay: Math.random() * 0.08,
      angle,
      distance,
    };
  });

  const celebrationWords = [
    '✨ DOĞRU!',
    '🌟 HARİKA!',
    '⚡ KUSURSUZ!',
    '🔥 SÜPER REFLEKS!',
    '💎 EFSANE!',
  ];
  const word = celebrationWords[Math.min(combo - 1, celebrationWords.length - 1)] || '✨ MÜTHİŞ!';

  // Position style for local origin or viewport center
  const originStyle = origin
    ? { left: `${origin.x}px`, top: `${origin.y}px` }
    : { left: '50%', top: '50%' };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Luminous Ambient Flash */}
      <motion.div
        initial={{ opacity: 0.35 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        className="absolute inset-0 bg-gradient-to-tr from-amber-400/20 via-yellow-200/20 to-purple-500/20 backdrop-blur-[1px]"
      />

      {/* Origin Container for Burst, Shockwave, and Word */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none"
        style={originStyle}
      >
        {/* Golden Radiant Expanding Shockwave Ring */}
        <motion.div
          initial={{ scale: 0.1, opacity: 0.95 }}
          animate={{ scale: 2.8, opacity: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="absolute w-36 h-36 rounded-full border-4 border-amber-300 shadow-[0_0_40px_rgba(251,191,36,0.85)]"
        />

        {/* Floating 3D Sparkle Words */}
        <motion.div
          initial={{ scale: 0.3, y: 10, opacity: 0, rotate: -4 }}
          animate={{ scale: [0.3, 1.25, 1], y: -55, opacity: [0, 1, 0], rotate: 4 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="absolute z-10 px-4 py-1.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black text-lg shadow-[0_10px_25px_rgba(245,158,11,0.5)] border-2 border-white flex items-center gap-1.5 whitespace-nowrap"
        >
          <span>{word}</span>
          {combo >= 2 && (
            <span className="text-xs bg-slate-950 text-amber-300 px-2 py-0.5 rounded-full font-mono">
              x{combo}
            </span>
          )}
        </motion.div>

        {/* Burst of Twinkling Multi-Color Star Particles radiating from target */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
            animate={{
              x: p.x,
              y: p.y,
              scale: [0, 1.3, 0.2],
              opacity: [1, 1, 0],
              rotate: [0, 180],
            }}
            transition={{
              duration: 0.65,
              delay: p.delay,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute"
          >
            <svg
              width={p.size}
              height={p.size}
              viewBox="0 0 24 24"
              style={{
                filter: `drop-shadow(0 0 8px ${p.color})`,
              }}
            >
              <path
                d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z"
                fill={p.color}
              />
            </svg>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
