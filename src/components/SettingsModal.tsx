import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  getUserProfile,
  saveUserProfile,
  AVATAR_OPTIONS,
  getAppTheme,
  setAppTheme,
  resetAllProgress,
} from '../utils/levels';
import { ThemeType, UserProfile } from '../types';
import { sound } from '../utils/audio';
import { X, Volume2, VolumeX, RotateCcw, Check, Sparkles, Feather } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
  currentTheme: ThemeType;
  onThemeChange: (newTheme: ThemeType) => void;
  onProgressReset: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  currentTheme,
  onThemeChange,
  onProgressReset,
}) => {
  const [profile, setProfile] = useState<UserProfile>(() => getUserProfile());
  const [isSaved, setIsSaved] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isMuted, setIsMuted] = useState(sound.isMuted);

  const handleSaveProfile = () => {
    saveUserProfile(profile);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 1500);
  };

  const handleSelectTheme = (theme: ThemeType) => {
    setAppTheme(theme);
    onThemeChange(theme);
  };

  const handleConfirmReset = () => {
    resetAllProgress();
    setShowResetConfirm(false);
    onProgressReset();
    onClose();
  };

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md select-none animate-in fade-in duration-200">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 320 }}
        className={`w-full max-w-sm max-h-[92vh] rounded-[36px] p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.35)] border-2 flex flex-col relative overflow-hidden ${
          currentTheme === 'classic'
            ? 'bg-white border-black text-black'
            : 'bg-gradient-to-b from-white via-slate-50 to-slate-100 border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">AYARLAR</h2>
            <p className="text-xs font-bold text-slate-400">Profil & Tema Tercihleri</p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-2xl border transition-all cursor-pointer active:scale-95 ${
              currentTheme === 'classic'
                ? 'bg-zinc-100 border-black text-black'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-3 space-y-4 pr-1">
          {/* 1. Theme Selector (Pixar 3D vs Klasik Siyah-Beyaz Çizim) */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-1.5">
              Görsel Tema
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleSelectTheme('pixar')}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                  currentTheme === 'pixar'
                    ? 'border-amber-400 bg-amber-50/60 shadow-md font-black text-slate-950 ring-2 ring-amber-300'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-bold'
                }`}
              >
                <div className="text-2xl mb-1">✨ 🎨</div>
                <div className="text-xs font-black">Pixar 3D</div>
                <div className="text-[10px] text-slate-400">Canlı & Parlak</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectTheme('classic')}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                  currentTheme === 'classic'
                    ? 'border-black bg-zinc-100 shadow-md font-black text-black ring-2 ring-black'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 font-bold'
                }`}
              >
                <div className="text-2xl mb-1">✒️ 📰</div>
                <div className="text-xs font-black">Klasik Çizim</div>
                <div className="text-[10px] text-slate-400">Siyah-Beyaz Çizgi</div>
              </button>
            </div>
          </div>

          {/* 2. User Profile Setup */}
          <div
            className={`p-3.5 rounded-2xl border ${
              currentTheme === 'classic'
                ? 'bg-zinc-50 border-black/30'
                : 'bg-white border-slate-200/90 shadow-sm'
            }`}
          >
            <label className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-2">
              Oyuncu Profili
            </label>

            {/* Avatar Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2.5">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setProfile((p) => ({ ...p, avatar: av }))}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl transition-all cursor-pointer flex-shrink-0 ${
                    profile.avatar === av
                      ? currentTheme === 'classic'
                        ? 'border-2 border-black bg-zinc-200 scale-110'
                        : 'border-2 border-amber-400 bg-amber-100 scale-110'
                      : 'border border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>

            {/* Name Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={profile.name}
                maxLength={16}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                placeholder="İsminiz..."
                className={`flex-1 px-3 py-2 rounded-xl text-sm font-bold border outline-none ${
                  currentTheme === 'classic'
                    ? 'border-black bg-white text-black focus:ring-1 focus:ring-black'
                    : 'border-slate-300 bg-slate-50 text-slate-900 focus:border-amber-500 focus:bg-white'
                }`}
              />
              <button
                type="button"
                onClick={handleSaveProfile}
                className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1 transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-emerald-600 text-white'
                    : currentTheme === 'classic'
                    ? 'bg-black text-white hover:bg-zinc-800'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {isSaved ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{isSaved ? 'Kaydedildi' : 'Kaydet'}</span>
              </button>
            </div>
          </div>

          {/* 3. Audio Setting */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-700">Ses Efektleri</span>
            <button
              type="button"
              onClick={toggleSound}
              className={`p-2 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                isMuted
                  ? 'bg-red-50 border-red-300 text-red-600'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-700'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span>{isMuted ? 'Kapalı' : 'Açık'}</span>
            </button>
          </div>

          {/* 4. Reset Progress */}
          <div className="pt-1">
            {!showResetConfirm ? (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="w-full py-2.5 px-3 rounded-2xl border border-rose-300 bg-rose-50/50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>İlerlemeyi Sıfırla</span>
              </button>
            ) : (
              <div className="p-3 rounded-2xl border-2 border-rose-400 bg-rose-50 text-center">
                <p className="text-xs font-black text-rose-900 mb-2">
                  Tüm açılan bölümler ve yıldızlar sıfırlanacak. Emin misiniz?
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleConfirmReset}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-rose-600 text-white font-black text-xs hover:bg-rose-700 active:scale-95 cursor-pointer"
                  >
                    Evet, Sıfırla
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 py-1.5 px-2 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 active:scale-95 cursor-pointer"
                  >
                    Vazgeç
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
