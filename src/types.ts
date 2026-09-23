export type ShapeType = 'circle' | 'square' | 'triangle' | 'star' | 'diamond' | 'hexagon';
export type ShapeColor = 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'orange';
export type ThemeType = 'pixar' | 'classic'; // 'pixar': 3D colorful, 'classic': monochrome ink & black/white sketch

export interface GameObject {
  id: string;
  shape: ShapeType;
  color: ShapeColor;
  colorName: string; // 'Mavi', 'Kırmızı', etc.
  number?: number;
  label?: string;
  size: 'small' | 'medium' | 'large';
  isDangerous: boolean; // If true, tapping this is a trap under current rule
  isCorrect: boolean;   // If true, tapping this fulfills the current rule
  x?: number; // relative movement offset if any
  y?: number;
}

export type RuleCategory =
  | 'color_touch'       // "Mavi olana dokun."
  | 'color_avoid'       // "Kırmızı olana SAKIN DOKUNMA!"
  | 'shape_touch'       // "Yıldıza dokun!"
  | 'shape_avoid'       // "Kareye SAKIN DOKUNMA!"
  | 'stroop_text'       // "YAZIYA dokun (Yazan renk)" vs "RENGİNE dokun"
  | 'number_max'        // "En BÜYÜK sayıya dokun"
  | 'number_even'       // "ÇİFT sayıya dokun"
  | 'number_odd'        // "TEK sayıya dokun"
  | 'size_extremes'     // "En BÜYÜK şekle dokun" / "En KÜÇÜK şekle dokun"
  | 'reverse_trick'     // "TERSİNİ YAP!"
  | 'shape_corners'     // "3 KÖŞELİ şekle dokun"
  | 'shape_unique'      // "Diğerlerinden FARKLI şekle dokun"
  | 'shape_sides_avoid';// "KÖŞELİ şekillere SAKIN DOKUNMA!"

export interface GameRule {
  id: string;
  category: RuleCategory;
  instructionText: string;
  subText?: string;
  isNegative: boolean; // is a "SAKIN DOKUNMA" rule
  highlightColor?: ShapeColor;
  targetShape?: ShapeType;
  timeLimitSeconds: number;
}

export type GameState = 'menu' | 'playing' | 'game_over';

export interface LevelConfig {
  levelNumber: number;
  requiredCorrectTaps: number;
  title: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
}

export interface GameStats {
  score: number;
  highScore: number;
  lives: number;
  combo: number;
  maxCombo: number;
  level: number;
  levelCorrectTaps: number;
  levelRequiredTaps: number;
  totalTaps: number;
  correctTaps: number;
  lastTrapReason?: string;
}
