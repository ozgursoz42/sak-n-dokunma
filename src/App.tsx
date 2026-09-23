/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { GameState, ThemeType } from './types';
import { MainMenu } from './components/MainMenu';
import { PlayScreen } from './components/PlayScreen';
import { LevelSelectModal } from './components/LevelSelectModal';
import { SettingsModal } from './components/SettingsModal';
import { getAppTheme, getUnlockedLevel } from './utils/levels';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [selectedLevel, setSelectedLevel] = useState<number>(() => getUnlockedLevel());
  const [theme, setTheme] = useState<ThemeType>(() => getAppTheme());
  const [showLevelsModal, setShowLevelsModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [versionKey, setVersionKey] = useState<number>(0);

  const handleStartGame = (level?: number) => {
    if (level) {
      setSelectedLevel(level);
    } else {
      setSelectedLevel(getUnlockedLevel());
    }
    setGameState('playing');
  };

  const handleSelectLevel = (level: number) => {
    setSelectedLevel(level);
    setShowLevelsModal(false);
    setGameState('playing');
  };

  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme);
  };

  const handleProgressReset = () => {
    setSelectedLevel(1);
    setVersionKey((prev) => prev + 1);
  };

  return (
    <div
      id="app-root-container"
      className={`fixed inset-0 w-full h-[100dvh] flex items-center justify-center p-0 sm:p-4 overflow-hidden select-none transition-colors duration-300 ${
        theme === 'classic' ? 'bg-[#e4e4e7]' : 'bg-[#f1f5f9]'
      }`}
    >
      {/* Background Grid Pattern */}
      <div
        className={`absolute inset-0 pointer-events-none ${
          theme === 'classic'
            ? 'bg-[radial-gradient(#71717a_1px,transparent_1px)] [background-size:20px_20px] opacity-25'
            : 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40'
        }`}
      />

      {/* Main Responsive Mobile Viewport Frame */}
      <main
        id="game-viewport"
        className={`relative w-full max-w-md h-full sm:h-[95vh] sm:max-h-[820px] sm:rounded-[36px] bg-white border-0 sm:border-2 shadow-[0_20px_60px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden transition-colors duration-300 ${
          theme === 'classic' ? 'sm:border-black' : 'sm:border-slate-300'
        }`}
      >
        {gameState === 'menu' && (
          <MainMenu
            key={`menu-${versionKey}-${theme}`}
            onStart={handleStartGame}
            onOpenLevels={() => setShowLevelsModal(true)}
            onOpenSettings={() => setShowSettingsModal(true)}
            theme={theme}
          />
        )}

        {gameState === 'playing' && (
          <PlayScreen
            key={`play-${selectedLevel}-${theme}`}
            initialLevel={selectedLevel}
            theme={theme}
            onBackToMenu={() => {
              setGameState('menu');
              setVersionKey((prev) => prev + 1);
            }}
            onOpenLevels={() => setShowLevelsModal(true)}
          />
        )}

        {/* Level Select Modal */}
        {showLevelsModal && (
          <LevelSelectModal
            onClose={() => setShowLevelsModal(false)}
            onSelectLevel={handleSelectLevel}
            theme={theme}
          />
        )}

        {/* Settings Modal */}
        {showSettingsModal && (
          <SettingsModal
            onClose={() => {
              setShowSettingsModal(false);
              setVersionKey((prev) => prev + 1);
            }}
            currentTheme={theme}
            onThemeChange={handleThemeChange}
            onProgressReset={handleProgressReset}
          />
        )}
      </main>
    </div>
  );
}
