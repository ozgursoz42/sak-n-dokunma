import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ThemeType } from '../types';

export type MascotEmotion = 'neutral' | 'mischievous' | 'laughing' | 'shocked' | 'taunting';

interface PixarMascotProps {
  emotion?: MascotEmotion;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  theme?: ThemeType;
}

export const PixarMascot: React.FC<PixarMascotProps> = ({
  emotion = 'mischievous',
  size = 'lg',
  className = '',
  theme = 'pixar',
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const isClassic = theme === 'classic';

  // Natural eye blink loop
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 140);
    }, 3200 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  const sizeClasses = {
    sm: 'w-14 h-14',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-36 h-36',
  }[size];

  return (
    <motion.div
      className={`relative inline-block select-none ${sizeClasses} ${className} ${
        isClassic ? 'grayscale contrast-125' : ''
      }`}
      animate={{
        y: emotion === 'laughing' ? [-3, 3, -3] : [-2, 2, -2],
        rotate: emotion === 'shocked' ? [-2, 2, -2] : [0, 1.5, 0, -1.5, 0],
      }}
      transition={{
        duration: emotion === 'laughing' ? 0.3 : 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <svg
        viewBox="0 0 160 160"
        className={`w-full h-full ${
          isClassic
            ? 'drop-shadow-[0_8px_16px_rgba(0,0,0,0.25)]'
            : 'drop-shadow-[0_12px_24px_rgba(99,102,241,0.35)]'
        }`}
      >
        <defs>
          {/* 3D Soft Sky Blue & Vibrant Indigo Body Gradient */}
          <radialGradient id="mascotBody3D" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#bae6fd" />
            <stop offset="30%" stopColor="#60a5fa" />
            <stop offset="65%" stopColor="#3b82f6" />
            <stop offset="90%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </radialGradient>

          {/* Cute Soft Rounded Ears Gradient */}
          <linearGradient id="earGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>

          {/* Cute Ear Inner Pink Tint */}
          <radialGradient id="earInner" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbcfe8" />
            <stop offset="80%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#db2777" />
          </radialGradient>

          {/* Top Star/Antenna Spark Gradient */}
          <radialGradient id="antennaStar" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#facc15" />
            <stop offset="90%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#ca8a04" />
          </radialGradient>

          {/* Glossy Eye Shaders */}
          <radialGradient id="eyeSpecular" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#f8fafc" />
            <stop offset="85%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </radialGradient>

          {/* Warm Amber/Gold Pixar Iris */}
          <radialGradient id="mascotIris" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="85%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#92400e" />
          </radialGradient>

          {/* Cheek Blush */}
          <radialGradient id="blushGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
          </radialGradient>

          {/* 3D Specular Highlight for Head */}
          <linearGradient id="headGloss" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* --- CUTE ROUNDED EARS (Soft friendly bunny/bear style) --- */}
        {/* Left Ear Outer */}
        <ellipse
          cx="44"
          cy="42"
          rx="16"
          ry="22"
          transform="rotate(-25 44 42)"
          fill="url(#earGradient)"
          stroke="#1e3a8a"
          strokeWidth="2"
        />
        {/* Left Ear Inner */}
        <ellipse
          cx="45"
          cy="43"
          rx="9"
          ry="14"
          transform="rotate(-25 45 43)"
          fill="url(#earInner)"
          opacity="0.85"
        />

        {/* Right Ear Outer */}
        <ellipse
          cx="116"
          cy="42"
          rx="16"
          ry="22"
          transform="rotate(25 116 42)"
          fill="url(#earGradient)"
          stroke="#1e3a8a"
          strokeWidth="2"
        />
        {/* Right Ear Inner */}
        <ellipse
          cx="115"
          cy="43"
          rx="9"
          ry="14"
          transform="rotate(25 115 43)"
          fill="url(#earInner)"
          opacity="0.85"
        />

        {/* --- PLAYFUL LITTLE STAR ANTENNA ON TOP --- */}
        {/* Curved stem */}
        <path
          d="M 80 48 Q 78 28 80 18"
          stroke="#1d4ed8"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Little Glowing Star Bead */}
        <path
          d="M 80 8 L 83 14 L 89 15 L 85 19 L 86 25 L 80 22 L 74 25 L 75 19 L 71 15 L 77 14 Z"
          fill="url(#antennaStar)"
          stroke="#a16207"
          strokeWidth="1.2"
          filter="drop-shadow(0 2px 4px rgba(234,179,8,0.5))"
        />

        {/* --- MAIN 3D CHUBBY HEAD --- */}
        <circle
          cx="80"
          cy="92"
          r="54"
          fill="url(#mascotBody3D)"
          stroke="#1e3a8a"
          strokeWidth="2.5"
        />

        {/* Top 3D Gloss Highlight on forehead */}
        <ellipse
          cx="76"
          cy="60"
          rx="32"
          ry="14"
          fill="url(#headGloss)"
        />

        {/* Cute Chubby Cheeks (Rosy Blush) */}
        <ellipse cx="44" cy="106" rx="14" ry="9" fill="url(#blushGlow)" />
        <ellipse cx="116" cy="106" rx="14" ry="9" fill="url(#blushGlow)" />

        {/* --- EXPRESSIVE PIXAR EYES --- */}
        {!isBlinking ? (
          <g>
            {/* Left Eye Sclera */}
            <ellipse
              cx="58"
              cy="84"
              rx={emotion === 'shocked' ? 17 : 14}
              ry={emotion === 'shocked' ? 20 : 17}
              fill="url(#eyeSpecular)"
              stroke="#0f172a"
              strokeWidth="2"
            />
            {/* Left Iris */}
            <circle
              cx={emotion === 'taunting' ? 62 : 60}
              cy={emotion === 'shocked' ? 84 : 86}
              r={emotion === 'shocked' ? 10 : 8.5}
              fill="url(#mascotIris)"
            />
            {/* Left Pupil */}
            <circle
              cx={emotion === 'taunting' ? 63 : 61}
              cy={emotion === 'shocked' ? 84 : 86}
              r={emotion === 'shocked' ? 6 : 4.5}
              fill="#09090b"
            />
            {/* Left Eye Catchlights (Double Specular Sparks) */}
            <circle cx="56" cy="80" r="3" fill="#ffffff" />
            <circle cx="63" cy="89" r="1.5" fill="#ffffff" />

            {/* Right Eye Sclera */}
            <ellipse
              cx="102"
              cy="84"
              rx={emotion === 'shocked' ? 17 : 14}
              ry={emotion === 'shocked' ? 20 : 17}
              fill="url(#eyeSpecular)"
              stroke="#0f172a"
              strokeWidth="2"
            />
            {/* Right Iris */}
            <circle
              cx={emotion === 'taunting' ? 98 : 100}
              cy={emotion === 'shocked' ? 84 : 86}
              r={emotion === 'shocked' ? 10 : 8.5}
              fill="url(#mascotIris)"
            />
            {/* Right Pupil */}
            <circle
              cx={emotion === 'taunting' ? 97 : 99}
              cy={emotion === 'shocked' ? 84 : 86}
              r={emotion === 'shocked' ? 6 : 4.5}
              fill="#09090b"
            />
            {/* Right Eye Catchlights */}
            <circle cx="97" cy="80" r="3" fill="#ffffff" />
            <circle cx="104" cy="89" r="1.5" fill="#ffffff" />

            {/* Friendly Pixar Eyebrows */}
            {emotion === 'mischievous' || emotion === 'taunting' ? (
              <>
                <path
                  d="M 46 68 Q 58 64 68 70"
                  stroke="#1e3a8a"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 114 68 Q 102 64 92 70"
                  stroke="#1e3a8a"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </>
            ) : emotion === 'shocked' ? (
              <>
                <path
                  d="M 46 63 Q 58 58 68 65"
                  stroke="#1e3a8a"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 114 63 Q 102 58 92 65"
                  stroke="#1e3a8a"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </>
            ) : (
              <>
                <path
                  d="M 46 70 Q 58 67 68 72"
                  stroke="#1e3a8a"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M 114 70 Q 102 67 92 72"
                  stroke="#1e3a8a"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </>
            )}
          </g>
        ) : (
          /* Blink State */
          <g>
            <path
              d="M 46 86 Q 58 94 70 86"
              stroke="#0f172a"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 90 86 Q 102 94 114 86"
              stroke="#0f172a"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        )}

        {/* Tiny Cute Button Nose */}
        <ellipse cx="80" cy="99" rx="4.5" ry="3.2" fill="#1e3a8a" opacity="0.7" />

        {/* --- FRIENDLY & ADORABLE MOUTH --- */}
        {emotion === 'laughing' ? (
          /* Wide Happy Laughing Open Smile */
          <g>
            <path
              d="M 60 108 Q 80 134 100 108 Z"
              fill="#831843"
              stroke="#4c0519"
              strokeWidth="2"
            />
            {/* Pink Tongue */}
            <path d="M 68 122 Q 80 114 92 122 Q 80 133 68 122 Z" fill="#f43f5e" />
          </g>
        ) : emotion === 'shocked' ? (
          /* Shocked O-shaped Mouth */
          <ellipse
            cx="80"
            cy="115"
            rx="9"
            ry="11"
            fill="#1e3a8a"
            stroke="#0f172a"
            strokeWidth="2"
          />
        ) : (
          /* Sweet Cheerful Smile */
          <path
            d="M 64 110 Q 80 124 96 110"
            stroke="#0f172a"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
        )}
      </svg>
    </motion.div>
  );
};
