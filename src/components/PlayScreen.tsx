import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameObject, GameRule, GameStats, ThemeType } from '../types';
import { generateRound } from '../utils/gameLogic';
import { FloatingArena } from './FloatingArena';
import { GameOverView } from './GameOverView';
import { SparkleEffect } from './SparkleEffect';
import { MistakeEffect } from './MistakeEffect';
import { PixarMascot, MascotEmotion } from './PixarMascot';
import { LevelCompleteModal } from './LevelCompleteModal';
import {
  getLevelConfig,
  saveLevelStars,
  setUnlockedLevel,
  getUnlockedLevel,
  TOTAL_LEVELS,
} from '../utils/levels';
import { sound } from '../utils/audio';
import { Volume2, VolumeX, Flame, AlertTriangle, ArrowLeft, Target, Star } from 'lucide-react';

interface PlayScreenProps {
  initialLevel?: number;
  theme?: ThemeType;
  onBackToMenu: () => void;
  onOpenLevels: () => void;
}

export const PlayScreen: React.FC<PlayScreenProps> = ({
  initialLevel,
  theme = 'pixar',
  onBackToMenu,
  onOpenLevels,
}) => {
  const [currentLevel, setCurrentLevel] = useState<number>(() => {
    return initialLevel ? Math.max(1, initialLevel) : getUnlockedLevel();
  });

  const levelConfig = getLevelConfig(currentLevel);
  const [levelCorrectTaps, setLevelCorrectTaps] = useState<number>(0);
  const [showLevelComplete, setShowLevelComplete] = useState<boolean>(false);
  const [earnedStars, setEarnedStars] = useState<number>(3);

  const [stats, setStats] = useState<GameStats>(() => {
    const savedHighScore = localStorage.getItem('sakin_dokunma_highscore');
    return {
      score: 0,
      highScore: savedHighScore ? parseInt(savedHighScore, 10) || 0 : 0,
      lives: 3,
      combo: 0,
      maxCombo: 0,
      level: currentLevel,
      levelCorrectTaps: 0,
      levelRequiredTaps: levelConfig.requiredCorrectTaps,
      totalTaps: 0,
      correctTaps: 0,
    };
  });

  const [currentRound, setCurrentRound] = useState<{ rule: GameRule; objects: GameObject[] }>(() =>
    generateRound(0, theme)
  );

  const [timeLeft, setTimeLeft] = useState<number>(currentRound.rule.timeLimitSeconds);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [soundMuted, setSoundMuted] = useState<boolean>(sound.isMuted);

  // Dynamic visual feedback states
  const [showSparkles, setShowSparkles] = useState<boolean>(false);
  const [tapOrigin, setTapOrigin] = useState<{ x: number; y: number } | null>(null);
  const [showMistake, setShowMistake] = useState<boolean>(false);
  const [lastMistakeReason, setLastMistakeReason] = useState<string>('');
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [ruleChangedAlert, setRuleChangedAlert] = useState<boolean>(false);
  const [mascotEmotion, setMascotEmotion] = useState<MascotEmotion>('mischievous');

  const timerRef = useRef<number | null>(null);
  const totalTimeRef = useRef<number>(currentRound.rule.timeLimitSeconds);
  const lastTickTimeRef = useRef<number>(0);

  // Advance to next round within current level
  const startNextRound = useCallback(
    (newScore: number) => {
      const nextRound = generateRound(newScore, theme);
      setCurrentRound(nextRound);
      totalTimeRef.current = nextRound.rule.timeLimitSeconds;
      setTimeLeft(nextRound.rule.timeLimitSeconds);

      // Rule change alert
      if (
        nextRound.rule.isNegative ||
        nextRound.rule.category === 'reverse_trick' ||
        nextRound.rule.category === 'stroop_text' ||
        nextRound.rule.category === 'shape_unique' ||
        nextRound.rule.category === 'shape_sides_avoid'
      ) {
        sound.playRuleSwitch();
        setRuleChangedAlert(true);
        setMascotEmotion('mischievous');
        setTimeout(() => setRuleChangedAlert(false), 850);
      }
    },
    [theme]
  );

  // Handle mistake or timeout
  const handleMistake = useCallback(
    (reason: string) => {
      sound.playComedicMistake();

      setLastMistakeReason(reason);
      setShowMistake(true);
      setScreenShake(true);
      setMascotEmotion('laughing');

      setTimeout(() => setScreenShake(false), 500);
      setTimeout(() => setShowMistake(false), 850);

      setStats((prev) => {
        const newLives = prev.lives - 1;
        const isDead = newLives <= 0;

        if (isDead) {
          sound.playComedicGameOver();
          setIsGameOver(true);
          const newHigh = Math.max(prev.score, prev.highScore);
          localStorage.setItem('sakin_dokunma_highscore', String(newHigh));
          return {
            ...prev,
            lives: 0,
            combo: 0,
            highScore: newHigh,
            lastTrapReason: reason,
          };
        }

        // Advance to next round
        setTimeout(() => startNextRound(prev.score), 250);

        return {
          ...prev,
          lives: newLives,
          combo: 0,
          lastTrapReason: reason,
        };
      });
    },
    [startNextRound]
  );

  // Timer loop
  useEffect(() => {
    if (isGameOver || showLevelComplete) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = 45;
    const decrement = intervalMs / 1000;

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        const urgency = prev / totalTimeRef.current;
        if (urgency <= 0.35 && prev > 0.1) {
          const now = Date.now();
          if (now - lastTickTimeRef.current > (urgency < 0.2 ? 180 : 320)) {
            sound.playTensionTick(urgency);
            lastTickTimeRef.current = now;
          }
        }

        if (prev <= 0.05) {
          clearInterval(timerRef.current!);
          handleMistake('Süre doldu! Hızlı düşünmelisin! ⚡');
          return 0;
        }
        return prev - decrement;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentRound.rule.id, isGameOver, showLevelComplete, handleMistake]);

  // Handle shape tap
  const handleTap = (object: GameObject, position?: { x: number; y: number }) => {
    if (isGameOver || showMistake || showLevelComplete) return;

    if (object.isCorrect) {
      const nextCombo = stats.combo + 1;
      sound.playSparkleSuccess(nextCombo);

      if (position) {
        setTapOrigin(position);
      }
      setShowSparkles(true);
      setMascotEmotion('shocked');
      setTimeout(() => setShowSparkles(false), 700);
      setTimeout(() => setMascotEmotion('mischievous'), 900);

      const pointsEarned = 1 + Math.floor(nextCombo / 3);
      const newScore = stats.score + pointsEarned;
      const nextLevelCorrect = levelCorrectTaps + 1;

      setStats((prev) => ({
        ...prev,
        score: newScore,
        combo: nextCombo,
        maxCombo: Math.max(prev.maxCombo, nextCombo),
        totalTaps: prev.totalTaps + 1,
        correctTaps: prev.correctTaps + 1,
        levelCorrectTaps: nextLevelCorrect,
      }));

      // Check if target for level completion is reached!
      if (nextLevelCorrect >= levelConfig.requiredCorrectTaps) {
        // Calculate stars based on remaining lives
        const stars = stats.lives >= 3 ? 3 : stats.lives === 2 ? 2 : 1;
        setEarnedStars(stars);
        saveLevelStars(currentLevel, stars);
        setUnlockedLevel(currentLevel + 1);

        sound.playSparkleSuccess(5);
        if (timerRef.current) clearInterval(timerRef.current);
        setShowLevelComplete(true);
      } else {
        setLevelCorrectTaps(nextLevelCorrect);
        startNextRound(newScore);
      }
    } else {
      // Mistake
      const reason = currentRound.rule.isNegative
        ? 'Dokunmaman gereken nesneye dokundun! ⚠️'
        : 'Yanlış nesneye dokundun! 🎯';
      handleMistake(reason);
    }
  };

  const handleNextLevel = () => {
    const nextLvl = currentLevel + 1;
    setCurrentLevel(nextLvl);
    setLevelCorrectTaps(0);
    setShowLevelComplete(false);
    setShowMistake(false);
    setShowSparkles(false);
    setMascotEmotion('mischievous');
    startNextRound(stats.score);
  };

  const handleRestart = () => {
    const savedHighScore = localStorage.getItem('sakin_dokunma_highscore');
    const high = savedHighScore ? parseInt(savedHighScore, 10) || 0 : stats.highScore;

    setStats({
      score: 0,
      highScore: high,
      lives: 3,
      combo: 0,
      maxCombo: 0,
      level: currentLevel,
      levelCorrectTaps: 0,
      levelRequiredTaps: levelConfig.requiredCorrectTaps,
      totalTaps: 0,
      correctTaps: 0,
    });
    setLevelCorrectTaps(0);
    setIsGameOver(false);
    setShowMistake(false);
    setShowSparkles(false);
    setMascotEmotion('mischievous');
    startNextRound(0);
  };

  const timerPercentage = Math.max(0, Math.min(100, (timeLeft / totalTimeRef.current) * 100));

  return (
    <div
      className={`relative w-full h-full flex flex-col justify-between p-4 sm:p-5 select-none overflow-hidden transition-all duration-100 ${
        theme === 'classic' ? 'bg-[#fafaf9] text-black' : 'bg-slate-50/50 text-slate-900'
      } ${screenShake ? 'animate-wiggle' : ''}`}
    >
      {/* 1. Sparkle Celebration Overlay */}
      {showSparkles && <SparkleEffect combo={stats.combo} origin={tapOrigin} />}

      {/* 2. Comic High-Impact Mistake Overlay */}
      {showMistake && (
        <MistakeEffect
          reason={lastMistakeReason}
          livesRemaining={stats.lives}
        />
      )}

      {/* Top Header */}
      <div className="w-full flex flex-col gap-2 z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToMenu}
            className={`p-2 rounded-2xl border shadow-sm hover:bg-slate-50 active:scale-95 transition-all cursor-pointer ${
              theme === 'classic'
                ? 'bg-white border-black text-black'
                : 'bg-white border-slate-200/90 text-slate-700'
            }`}
            title="Ana Menü"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Level & Target Badge */}
          <div className="flex items-center gap-2">
            <div
              onClick={onOpenLevels}
              className={`px-3 py-1 rounded-full text-xs font-black tracking-wide border shadow-sm cursor-pointer active:scale-95 flex items-center gap-1.5 ${
                theme === 'classic'
                  ? 'bg-white border-black text-black'
                  : 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-900 border-purple-200'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-purple-600" />
              <span>BÖLÜM {currentLevel}</span>
              <span className="text-slate-300">·</span>
              <span className="font-mono text-purple-700">
                {levelCorrectTaps}/{levelConfig.requiredCorrectTaps}
              </span>
            </div>
            <PixarMascot emotion={mascotEmotion} size="sm" theme={theme} />
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
              <VolumeX className="w-5 h-5 text-red-500" />
            ) : (
              <Volume2 className="w-5 h-5 text-emerald-600" />
            )}
          </button>
        </div>

        {/* Dynamic Directive / Rule Box */}
        <div
          className={`relative w-full p-3.5 sm:p-4 rounded-3xl border-2 overflow-hidden flex flex-col items-center justify-center text-center shadow-lg ${
            theme === 'classic'
              ? 'bg-black text-white border-black shadow-black/20'
              : 'bg-gradient-to-b from-slate-900 via-slate-900 to-purple-950 text-white border-slate-800 shadow-[0_12px_24px_rgba(15,23,42,0.25)]'
          }`}
        >
          {/* Rule Alert Banner */}
          <AnimatePresence>
            {ruleChangedAlert && (
              <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute top-1 text-[10px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-1 bg-amber-400/20 px-3 py-0.5 rounded-full border border-amber-400/40"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>KURAL DEĞİŞTİ!</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Instruction Text */}
          <p
            className={`text-lg sm:text-xl font-black tracking-tight mt-1 ${
              currentRound.rule.isNegative ? 'text-rose-400 drop-shadow-sm' : 'text-white'
            }`}
          >
            {currentRound.rule.instructionText}
          </p>

          {currentRound.rule.subText && (
            <p className="text-xs font-semibold text-slate-300 mt-0.5">
              {currentRound.rule.subText}
            </p>
          )}

          {/* Countdown Progress Bar with Visible Remaining Seconds on Right */}
          <div className="w-full flex items-center gap-2.5 mt-2.5">
            <div className="flex-1 h-2 bg-slate-800/80 rounded-full overflow-hidden p-[1px] border border-slate-700/60">
              <div
                className={`h-full rounded-full transition-all duration-75 ease-linear shadow-sm ${
                  timerPercentage > 45
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                    : timerPercentage > 20
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                    : 'bg-gradient-to-r from-red-600 to-rose-500 animate-pulse'
                }`}
                style={{ width: `${timerPercentage}%` }}
              />
            </div>

            {/* Remaining Seconds Text (Turns Red in Final Seconds) */}
            <span
              className={`text-xs font-mono font-black min-w-[38px] text-right transition-colors duration-150 ${
                timeLeft <= 1.8 || timerPercentage <= 25
                  ? 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.9)] animate-pulse'
                  : 'text-slate-300'
              }`}
            >
              {Math.max(0, timeLeft).toFixed(1)}s
            </span>
          </div>
        </div>

        {/* Score & Lives Sub-bar */}
        <div className="flex items-center justify-between px-2 pt-0.5">
          <div className="text-sm font-bold text-slate-700 flex items-center">
            <span>Skor: </span>
            <span className="text-base font-black text-slate-950 ml-1 font-mono">{stats.score}</span>
            <span className="mx-2 text-slate-300 font-bold">·</span>
            <span>Can: </span>
            <span className="text-base font-black text-rose-600 ml-1 font-mono">{stats.lives}</span>
          </div>

          {stats.combo >= 2 && (
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="flex items-center gap-1 text-xs font-black text-amber-700 bg-amber-50 px-3 py-0.5 rounded-full border border-amber-300 shadow-sm"
            >
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>KOMBO x{stats.combo}</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Main Interactive Floating Arena */}
      <div className="w-full flex-1 flex flex-col justify-center my-1.5 overflow-hidden">
        <FloatingArena
          objects={currentRound.objects}
          score={stats.score}
          onTap={handleTap}
          disabled={isGameOver || showMistake || showLevelComplete}
          theme={theme}
        />
      </div>

      {/* Bottom helper text */}
      <div className="text-center text-xs font-bold text-slate-400 pb-1">
        Hedef: {levelConfig.requiredCorrectTaps} doğru dokunuş ile bölümü geç! ✨
      </div>

      {/* Level Complete Celebration Modal */}
      {showLevelComplete && (
        <LevelCompleteModal
          levelNumber={currentLevel}
          stars={earnedStars}
          score={stats.score}
          targetTaps={levelConfig.requiredCorrectTaps}
          hasNextLevel={currentLevel < TOTAL_LEVELS}
          theme={theme}
          onNextLevel={handleNextLevel}
          onSelectLevels={onOpenLevels}
          onHome={onBackToMenu}
        />
      )}

      {/* Game Over Modal Screen */}
      {isGameOver && (
        <GameOverView
          stats={stats}
          theme={theme}
          onRestart={handleRestart}
          onHome={onBackToMenu}
        />
      )}
    </div>
  );
};
