import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Grid, Settings, Trophy, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';
import { PixarMascot } from './PixarMascot';
import { Pixar3DShape } from './Pixar3DShape';
import { getUserProfile, getUnlockedLevel } from '../utils/levels';
import { ThemeType } from '../types';

interface MainMenuProps {
  onStart: (level?: number) => void;
  onOpenLevels: () => void;
  onOpenSettings: () => void;
  theme?: ThemeType;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStart,
  onOpenLevels,
  onOpenSettings,
  theme = 'pixar',
}) => {
  const [soundMuted, setSoundMuted] = useState<boolean>(sound.isMuted);
  const highScore = parseInt(localStorage.getItem('sakin_dokunma_highscore') || '0', 10);
  const profile = getUserProfile();
  const unlocked = getUnlockedLevel();

  const handlePlayClick = () => {
    sound.playSparkleSuccess(1);
    onStart(unlocked);
  };

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-between p-5 sm:p-6 select-none overflow-hidden transition-colors duration-300 ${
        theme === 'classic'
          ? 'bg-[#fafaf9] text-black'
          : 'bg-gradient-to-b from-slate-50 via-white to-purple-50/30 text-slate-900'
      }`}
    >
      {/* Background 3D Ambient Circles (in Pixar mode) */}
      {theme === 'pixar' ? (
        <>
          <div className="absolute top-10 -left-12 w-48 h-48 rounded-full bg-purple-200/30 blur-3xl pointer-events-none" />
          <div className="absolute bottom-20 -right-12 w-52 h-52 rounded-full bg-blue-200/30 blur-3xl pointer-events-none" />
        </>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(#d4d4d8_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-35 pointer-events-none" />
      )}

      {/* Top Bar with Profile & Score */}
      <div className="w-full flex items-center justify-between pt-1 z-10">
        <div
          onClick={onOpenSettings}
          className={`flex items-center gap-2 text-xs font-black px-3.5 py-1.5 rounded-full border shadow-sm cursor-pointer active:scale-95 transition-all ${
            theme === 'classic'
              ? 'bg-white border-black text-black'
              : 'bg-white/95 border-slate-200/90 text-slate-800'
          }`}
          title="Profili Düzenle"
        >
          <span className="text-base">{profile.avatar}</span>
          <span className="truncate max-w-[90px]">{profile.name}</span>
          <span className="text-slate-300">·</span>
          <span className="text-amber-600">Bölüm {unlocked}</span>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-full border shadow-sm ${
              theme === 'classic'
                ? 'bg-white border-black text-black'
                : 'bg-white/90 border-slate-200/90 text-slate-700'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{highScore}</span>
          </div>

          <button
            onClick={() => setSoundMuted(sound.toggleMute())}
            className={`p-2 rounded-2xl border shadow-sm hover:bg-slate-50 active:scale-95 transition-all cursor-pointer ${
              theme === 'classic'
                ? 'bg-white border-black text-black'
                : 'bg-white border-slate-200/90 text-slate-700'
            }`}
            title={soundMuted ? 'Sesi Aç' : 'Sesi Kapat'}
          >
            {soundMuted ? (
              <VolumeX className="w-4 h-4 text-red-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-600" />
            )}
          </button>
        </div>
      </div>

      {/* Center 3D Pixar / Classic Showcase */}
      <div className="flex flex-col items-center text-center my-auto z-10 py-1">
        {/* Animated Mascot & Orbiting Shapes */}
        <div className="relative w-36 h-36 sm:w-40 sm:h-40 mb-2 flex items-center justify-center">
          <PixarMascot emotion="mischievous" size="lg" theme={theme} />

          {/* Floating Miniature Companions */}
          <motion.div
            animate={{
              y: [-5, 5, -5],
              rotate: [-10, 10, -10],
            }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            className={`absolute -top-1 -left-2 w-11 h-11 ${theme !== 'classic' ? 'drop-shadow-md' : ''}`}
          >
            <Pixar3DShape shape="star" color="yellow" size="small" theme={theme} />
          </motion.div>

          <motion.div
            animate={{
              y: [5, -5, 5],
              rotate: [8, -8, 8],
            }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            className={`absolute -bottom-1 -right-1 w-11 h-11 ${theme !== 'classic' ? 'drop-shadow-md' : ''}`}
          >
            <Pixar3DShape shape="circle" color="blue" size="small" theme={theme} />
          </motion.div>

          <motion.div
            animate={{
              y: [-4, 4, -4],
              rotate: [-6, 6, -6],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className={`absolute top-10 -right-4 w-9 h-9 ${theme !== 'classic' ? 'drop-shadow-md' : ''}`}
          >
            <Pixar3DShape shape="square" color="red" size="small" theme={theme} />
          </motion.div>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-1.5 border ${
              theme === 'classic'
                ? 'bg-zinc-100 text-black border-black'
                : 'bg-purple-100 text-purple-800 border-purple-200'
            }`}
          >
            <Sparkles className="w-3 h-3 text-purple-600" />
            <span>{theme === 'classic' ? 'Klasik Siyah-Beyaz Çizim' : '3D Pixar Refleks Oyunu'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none">
            SAKIN DOKUNMA!
          </h1>

          <p className="text-xs font-bold text-slate-500 mt-1 tracking-wide">
            Bölüm {unlocked} Hazır · Hızlı Oku, Yanılma! ⚡
          </p>
        </motion.div>
      </div>

      {/* Action Buttons Column:
          1. OYNA
          2. BÖLÜMLER
          3. AYARLAR
      */}
      <div className="w-full max-w-xs flex flex-col gap-2.5 pb-2 z-10">
        {/* 1. OYNA Button */}
        <motion.button
          id="btn-start-game"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={handlePlayClick}
          className={`w-full py-3.5 px-6 rounded-2xl font-black text-base tracking-wider flex items-center justify-center gap-2.5 shadow-lg transition-all cursor-pointer border ${
            theme === 'classic'
              ? 'bg-black text-white border-black hover:bg-zinc-800'
              : 'bg-gradient-to-r from-slate-950 via-slate-900 to-purple-950 hover:from-slate-900 hover:to-purple-900 text-white border-slate-800 shadow-slate-950/20'
          }`}
        >
          <Play className="w-5 h-5 fill-current" />
          <span>OYNA (BÖLÜM {unlocked})</span>
        </motion.button>

        {/* 2. BÖLÜMLER Button */}
        <motion.button
          id="btn-open-levels"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onOpenLevels}
          className={`w-full py-3 px-6 rounded-2xl font-black text-sm tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer border-2 shadow-sm ${
            theme === 'classic'
              ? 'bg-white border-black text-black hover:bg-zinc-100'
              : 'bg-white border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-slate-800'
          }`}
        >
          <Grid className="w-4 h-4 text-amber-500" />
          <span>BÖLÜMLER ({unlocked}/20 Açık)</span>
        </motion.button>

        {/* 3. AYARLAR Button */}
        <motion.button
          id="btn-open-settings"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onOpenSettings}
          className={`w-full py-2.5 px-6 rounded-2xl font-bold text-xs tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer border shadow-sm ${
            theme === 'classic'
              ? 'bg-zinc-50 border-black/40 text-black hover:bg-zinc-100'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>AYARLAR (Profil & Tema)</span>
        </motion.button>
      </div>
    </div>
  );
};
