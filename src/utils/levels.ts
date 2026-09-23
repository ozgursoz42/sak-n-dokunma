import { LevelConfig, UserProfile, ThemeType } from '../types';

export const TOTAL_LEVELS = 20;

export const LEVEL_CONFIGS: LevelConfig[] = [
  { levelNumber: 1, requiredCorrectTaps: 5, title: 'Başlangıç Eğitimi' },
  { levelNumber: 2, requiredCorrectTaps: 7, title: 'Isınma Turları' },
  { levelNumber: 3, requiredCorrectTaps: 9, title: 'İlk Tuzaklar' },
  { levelNumber: 4, requiredCorrectTaps: 12, title: 'Şekil Avcısı' },
  { levelNumber: 5, requiredCorrectTaps: 15, title: 'Hızlı Refleks' },
  { levelNumber: 6, requiredCorrectTaps: 18, title: 'Kandırmaca Alanı' },
  { levelNumber: 7, requiredCorrectTaps: 22, title: 'Göz Yanılgısı' },
  { levelNumber: 8, requiredCorrectTaps: 26, title: 'Refleks Çırağı' },
  { levelNumber: 9, requiredCorrectTaps: 30, title: 'Ateşli Ritim' },
  { levelNumber: 10, requiredCorrectTaps: 35, title: 'Fırtına Öncesi' },
  { levelNumber: 11, requiredCorrectTaps: 40, title: 'Büyük Kaos' },
  { levelNumber: 12, requiredCorrectTaps: 45, title: 'Ters Köşe' },
  { levelNumber: 13, requiredCorrectTaps: 50, title: 'Işık Hızı' },
  { levelNumber: 14, requiredCorrectTaps: 55, title: 'Göz Kırpma' },
  { levelNumber: 15, requiredCorrectTaps: 60, title: 'Hileli Labirent' },
  { levelNumber: 16, requiredCorrectTaps: 65, title: 'Usta Odaklanma' },
  { levelNumber: 17, requiredCorrectTaps: 70, title: 'Büyük Meydan Okuma' },
  { levelNumber: 18, requiredCorrectTaps: 75, title: 'Zaman Kapanı' },
  { levelNumber: 19, requiredCorrectTaps: 80, title: 'Zirveye Adım' },
  { levelNumber: 20, requiredCorrectTaps: 88, title: 'Efsane Şampiyon' },
];

export function getLevelConfig(levelNumber: number): LevelConfig {
  const found = LEVEL_CONFIGS.find((l) => l.levelNumber === levelNumber);
  if (found) return found;

  // Fallback for levels beyond 20
  return {
    levelNumber,
    requiredCorrectTaps: 88 + (levelNumber - 20) * 10,
    title: `Bölüm ${levelNumber}`,
  };
}

export function getUnlockedLevel(): number {
  if (typeof window === 'undefined') return 1;
  const saved = localStorage.getItem('sakin_dokunma_unlocked_level');
  return saved ? Math.max(1, parseInt(saved, 10) || 1) : 1;
}

export function setUnlockedLevel(lvl: number): void {
  if (typeof window === 'undefined') return;
  const current = getUnlockedLevel();
  if (lvl > current) {
    localStorage.setItem('sakin_dokunma_unlocked_level', String(lvl));
  }
}

export function getLevelStars(): Record<number, number> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem('sakin_dokunma_level_stars');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveLevelStars(level: number, stars: number): void {
  if (typeof window === 'undefined') return;
  const allStars = getLevelStars();
  const currentBest = allStars[level] || 0;
  if (stars > currentBest) {
    allStars[level] = stars;
    localStorage.setItem('sakin_dokunma_level_stars', JSON.stringify(allStars));
  }
}

export const AVATAR_OPTIONS = ['🤖', '⭐', '🦊', '⚡', '🎯', '👑', '🔥', '🚀'];

export function getUserProfile(): UserProfile {
  if (typeof window === 'undefined') {
    return { name: 'Oyuncu', avatar: '🤖' };
  }
  const name = localStorage.getItem('sakin_dokunma_player_name') || 'Oyuncu';
  let avatar = localStorage.getItem('sakin_dokunma_player_avatar') || '🤖';
  if (avatar === '😈') avatar = '🤖';
  return { name, avatar };
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('sakin_dokunma_player_name', profile.name.trim() || 'Oyuncu');
  localStorage.setItem('sakin_dokunma_player_avatar', profile.avatar || '🤖');
}

export function getAppTheme(): ThemeType {
  if (typeof window === 'undefined') return 'pixar';
  const saved = localStorage.getItem('sakin_dokunma_theme');
  return saved === 'classic' ? 'classic' : 'pixar';
}

export function setAppTheme(theme: ThemeType): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('sakin_dokunma_theme', theme);
}

export function resetAllProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('sakin_dokunma_unlocked_level', '1');
  localStorage.removeItem('sakin_dokunma_level_stars');
  localStorage.removeItem('sakin_dokunma_highscore');
}
