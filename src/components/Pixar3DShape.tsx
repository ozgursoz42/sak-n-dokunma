import React, { useState, useEffect } from 'react';
import { ShapeType, ShapeColor, ThemeType } from '../types';

interface Pixar3DShapeProps {
  shape: ShapeType;
  color: ShapeColor;
  size?: 'small' | 'medium' | 'large';
  label?: string;
  number?: number;
  isHovered?: boolean;
  theme?: ThemeType;
}

export const COLOR_PALETTE: Record<
  ShapeColor,
  {
    light: string;
    mid: string;
    deep: string;
    dark: string;
    rim: string;
    glow: string;
  }
> = {
  blue: {
    light: '#93c5fd',
    mid: '#3b82f6',
    deep: '#1d4ed8',
    dark: '#1e3a8a',
    rim: '#bfdbfe',
    glow: 'rgba(59, 130, 246, 0.45)',
  },
  red: {
    light: '#fca5a5',
    mid: '#ef4444',
    deep: '#b91c1c',
    dark: '#7f1d1d',
    rim: '#fecaca',
    glow: 'rgba(239, 68, 68, 0.45)',
  },
  green: {
    light: '#86efac',
    mid: '#22c55e',
    deep: '#15803d',
    dark: '#14532d',
    rim: '#bbf7d0',
    glow: 'rgba(34, 197, 94, 0.45)',
  },
  yellow: {
    light: '#fef08a',
    mid: '#eab308',
    deep: '#ca8a04',
    dark: '#854d0e',
    rim: '#fef9c3',
    glow: 'rgba(234, 179, 8, 0.45)',
  },
  purple: {
    light: '#d8b4fe',
    mid: '#a855f7',
    deep: '#7e22ce',
    dark: '#4c1d95',
    rim: '#f3e8ff',
    glow: 'rgba(168, 85, 247, 0.45)',
  },
  orange: {
    light: '#fdba74',
    mid: '#f97316',
    deep: '#c2410c',
    dark: '#7c2d12',
    rim: '#ffedd5',
    glow: 'rgba(249, 115, 22, 0.45)',
  },
};

export const Pixar3DShape: React.FC<Pixar3DShapeProps> = ({
  shape,
  color,
  size = 'medium',
  label,
  number,
  theme = 'pixar',
}) => {
  const [blink, setBlink] = useState(false);
  const isClassic = theme === 'classic';
  const palette = COLOR_PALETTE[color] || COLOR_PALETTE.blue;
  const gradId = `shape-grad-${shape}-${color}-${theme}`;
  const glossId = `shape-gloss-${shape}-${color}-${theme}`;
  const strokeColor = isClassic ? '#000000' : palette.dark;
  const strokeWidth = isClassic ? 3.5 : 2.5;

  // Blinking loop for cute character life (only in colorful Pixar mode)
  useEffect(() => {
    if (isClassic) return;
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 130);
    }, 2800 + Math.random() * 2500);
    return () => clearInterval(interval);
  }, [isClassic]);

  const scaleFactor = size === 'large' ? 1.15 : size === 'small' ? 0.85 : 1;

  // Eye component (Pixar theme)
  const renderEyes = (cx: number, cy: number, eyeDist: number = 18, eyeSize: number = 8) => {
    if (blink) {
      return (
        <g className="transition-all">
          <path
            d={`M ${cx - eyeDist - eyeSize} ${cy} Q ${cx - eyeDist} ${cy + 5} ${cx - eyeDist + eyeSize} ${cy}`}
            stroke="#000000"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={`M ${cx + eyeDist - eyeSize} ${cy} Q ${cx + eyeDist} ${cy + 5} ${cx + eyeDist + eyeSize} ${cy}`}
            stroke="#000000"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      );
    }

    return (
      <g>
        {/* Left Eye Sclera */}
        <ellipse
          cx={cx - eyeDist}
          cy={cy}
          rx={eyeSize}
          ry={eyeSize * 1.15}
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="2"
        />
        {/* Left Pupil */}
        <circle cx={cx - eyeDist + 1} cy={cy + 1} r={eyeSize * 0.58} fill="#09090b" />
        {/* Left Eye Sparkles */}
        <circle cx={cx - eyeDist - 1.5} cy={cy - 2} r={eyeSize * 0.28} fill="#ffffff" />
        <circle cx={cx - eyeDist + 2.5} cy={cy + 3} r={eyeSize * 0.14} fill="#ffffff" />

        {/* Right Eye Sclera */}
        <ellipse
          cx={cx + eyeDist}
          cy={cy}
          rx={eyeSize}
          ry={eyeSize * 1.15}
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="2"
        />
        {/* Right Pupil */}
        <circle cx={cx + eyeDist + 1} cy={cy + 1} r={eyeSize * 0.58} fill="#09090b" />
        {/* Right Eye Sparkles */}
        <circle cx={cx + eyeDist - 1.5} cy={cy - 2} r={eyeSize * 0.28} fill="#ffffff" />
        <circle cx={cx + eyeDist + 2.5} cy={cy + 3} r={eyeSize * 0.14} fill="#ffffff" />

        {/* Rosy Cheeks */}
        <ellipse cx={cx - eyeDist - 6} cy={cy + 11} rx={5} ry={3.5} fill="#f43f5e" opacity="0.38" />
        <ellipse cx={cx + eyeDist + 6} cy={cy + 11} rx={5} ry={3.5} fill="#f43f5e" opacity="0.38" />

        {/* Smile */}
        <path
          d={`M ${cx - 5} ${cy + 10} Q ${cx} ${cy + 16} ${cx + 5} ${cy + 10}`}
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    );
  };

  return (
    <div
      className="relative w-full h-full flex items-center justify-center pointer-events-none"
      style={{ transform: `scale(${scaleFactor})` }}
    >
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full max-w-[100px] max-h-[100px] overflow-visible"
        style={{
          filter: isClassic ? 'none' : `drop-shadow(0 10px 18px ${palette.glow})`,
        }}
      >
        {!isClassic && (
          <defs>
            <radialGradient id={gradId} cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor={palette.light} />
              <stop offset="35%" stopColor={palette.mid} />
              <stop offset="75%" stopColor={palette.deep} />
              <stop offset="100%" stopColor={palette.dark} />
            </radialGradient>

            <linearGradient id={glossId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.75} />
              <stop offset="60%" stopColor="#ffffff" stopOpacity={0.0} />
            </linearGradient>

            <radialGradient id={`shadow-${gradId}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </radialGradient>
          </defs>
        )}

        {/* Ground Occlusion Shadow (Pixar mode only, completely removed in classic) */}
        {!isClassic && (
          <ellipse cx="60" cy="112" rx="36" ry="7" fill={`url(#shadow-${gradId})`} />
        )}

        {/* 1. CIRCLE */}
        {shape === 'circle' && (
          <g>
            <circle
              cx="60"
              cy="58"
              r="44"
              fill={isClassic ? '#ffffff' : `url(#${gradId})`}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            {!isClassic && <ellipse cx="56" cy="32" rx="24" ry="12" fill={`url(#${glossId})`} />}
            {!isClassic ? (
              renderEyes(60, 56, 15, 8.5)
            ) : (
              number === undefined && <circle cx="60" cy="58" r="5" fill="#000000" />
            )}
          </g>
        )}

        {/* 2. SQUARE */}
        {shape === 'square' && (
          <g>
            <rect
              x="18"
              y="16"
              width="84"
              height="84"
              rx={isClassic ? 8 : 22}
              fill={isClassic ? '#ffffff' : `url(#${gradId})`}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
            {!isClassic && (
              <rect
                x="26"
                y="22"
                width="68"
                height="28"
                rx="14"
                fill={`url(#${glossId})`}
              />
            )}
            {!isClassic ? (
              renderEyes(60, 58, 16, 8.5)
            ) : (
              number === undefined && <circle cx="60" cy="58" r="5" fill="#000000" />
            )}
          </g>
        )}

        {/* 3. TRIANGLE */}
        {shape === 'triangle' && (
          <g>
            <path
              d={
                isClassic
                  ? 'M 60 16 L 102 88 L 18 88 Z'
                  : 'M 60 14 C 64 14, 67 18, 70 23 L 102 82 C 105 87, 103 94, 96 96 C 92 97, 28 97, 24 96 C 17 94, 15 87, 18 82 L 50 23 C 53 18, 56 14, 60 14 Z'
              }
              fill={isClassic ? '#ffffff' : `url(#${gradId})`}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
            />
            {!isClassic && <ellipse cx="60" cy="34" rx="14" ry="8" fill={`url(#${glossId})`} />}
            {!isClassic ? (
              renderEyes(60, 68, 14, 7.5)
            ) : (
              number === undefined && <circle cx="60" cy="62" r="5" fill="#000000" />
            )}
          </g>
        )}

        {/* 4. STAR */}
        {shape === 'star' && (
          <g>
            <path
              d="M 60 12 L 72 38 L 101 42 L 79 63 L 85 91 L 60 76 L 35 91 L 41 63 L 19 42 L 48 38 Z"
              fill={isClassic ? '#ffffff' : `url(#${gradId})`}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
            />
            {!isClassic && <circle cx="60" cy="46" r="14" fill={`url(#${glossId})`} />}
            {!isClassic ? (
              renderEyes(60, 56, 13, 7.5)
            ) : (
              number === undefined && <circle cx="60" cy="58" r="5" fill="#000000" />
            )}
          </g>
        )}

        {/* 5. DIAMOND */}
        {shape === 'diamond' && (
          <g>
            <path
              d={
                isClassic
                  ? 'M 60 16 L 102 58 L 60 100 L 18 58 Z'
                  : 'M 60 14 C 62 14, 65 17, 68 20 L 100 52 C 104 56, 104 64, 100 68 L 68 100 C 65 103, 62 105, 60 105 C 58 105, 55 103, 52 100 L 20 68 C 16 64, 16 56, 20 52 L 52 20 C 55 17, 58 14, 60 14 Z'
              }
              fill={isClassic ? '#ffffff' : `url(#${gradId})`}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
            />
            {!isClassic && <ellipse cx="60" cy="38" rx="16" ry="10" fill={`url(#${glossId})`} />}
            {!isClassic ? (
              renderEyes(60, 60, 15, 8)
            ) : (
              number === undefined && <circle cx="60" cy="58" r="5" fill="#000000" />
            )}
          </g>
        )}

        {/* 6. HEXAGON */}
        {shape === 'hexagon' && (
          <g>
            <path
              d="M 60 14 L 96 34 L 96 82 L 60 102 L 24 82 L 24 34 Z"
              fill={isClassic ? '#ffffff' : `url(#${gradId})`}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
            />
            {!isClassic && <ellipse cx="60" cy="36" rx="20" ry="10" fill={`url(#${glossId})`} />}
            {!isClassic ? (
              renderEyes(60, 58, 15, 8)
            ) : (
              number === undefined && <circle cx="60" cy="58" r="5" fill="#000000" />
            )}
          </g>
        )}
      </svg>

      {/* Number Badge (Clean 2D text without shadow in classic mode) */}
      {number !== undefined && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`text-3xl font-black font-mono tracking-tighter ${
              isClassic ? 'text-black' : 'text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]'
            }`}
          >
            {number}
          </span>
        </div>
      )}

      {/* Stroop Text Label (Only when label is explicitly provided for stroop challenge in colorful mode) */}
      {label && !isClassic && (
        <div className="absolute -bottom-1 px-3 py-0.5 rounded-full border-2 shadow-md bg-white/95 border-slate-900 text-slate-950">
          <span className="text-[11px] font-black uppercase tracking-wider">
            {label}
          </span>
        </div>
      )}
    </div>
  );
};
