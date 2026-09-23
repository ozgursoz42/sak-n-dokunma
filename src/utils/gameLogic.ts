import { GameObject, GameRule, RuleCategory, ShapeColor, ShapeType, ThemeType } from '../types';

export const COLOR_CONFIG: Record<
  ShapeColor,
  { name: string; hex: string; bgClass: string; borderClass: string; textClass: string }
> = {
  blue: { name: 'Mavi', hex: '#2563eb', bgClass: 'bg-blue-600', borderClass: 'border-blue-700', textClass: 'text-blue-600' },
  red: { name: 'Kırmızı', hex: '#dc2626', bgClass: 'bg-red-600', borderClass: 'border-red-700', textClass: 'text-red-600' },
  green: { name: 'Yeşil', hex: '#16a34a', bgClass: 'bg-emerald-600', borderClass: 'border-emerald-700', textClass: 'text-emerald-600' },
  yellow: { name: 'Sarı', hex: '#eab308', bgClass: 'bg-amber-400', borderClass: 'border-amber-500', textClass: 'text-amber-500' },
  purple: { name: 'Mor', hex: '#9333ea', bgClass: 'bg-purple-600', borderClass: 'border-purple-700', textClass: 'text-purple-600' },
  orange: { name: 'Turuncu', hex: '#ea580c', bgClass: 'bg-orange-500', borderClass: 'border-orange-600', textClass: 'text-orange-500' },
};

export const SHAPE_NAMES: Record<ShapeType, string> = {
  circle: 'Daire',
  square: 'Kare',
  triangle: 'Üçgen',
  star: 'Yıldız',
  diamond: 'Elmas',
  hexagon: 'Altıgen',
};

const ALL_COLORS: ShapeColor[] = ['blue', 'red', 'green', 'yellow', 'purple', 'orange'];
const ALL_SHAPES: ShapeType[] = ['circle', 'square', 'triangle', 'star', 'diamond', 'hexagon'];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateRound(
  score: number,
  theme: ThemeType = 'pixar'
): { rule: GameRule; objects: GameObject[] } {
  // Calculate object count (starts with 3 objects, gently scales)
  let count = 3;
  if (score >= 35) count = 4;
  if (score >= 75) count = 5;
  if (score >= 130) count = 6;

  // Calculate onboarding time limit:
  // Starts at 6.0 seconds for early levels, scaling down smoothly
  let baseTime = 6.0;
  if (score < 10) {
    baseTime = 6.0 - score * 0.1; // 6.0s down to 5.0s
  } else if (score < 25) {
    baseTime = 5.0 - (score - 10) * 0.05; // 5.0s down to 4.25s
  } else if (score < 60) {
    baseTime = 4.25 - (score - 25) * 0.03; // 4.25s down to 3.2s
  } else if (score < 100) {
    baseTime = 3.2 - (score - 60) * 0.0175; // 3.2s down to 2.5s
  } else {
    baseTime = Math.max(2.5 - (score - 100) * 0.01, 1.6); // Floor at 1.6s
  }

  const isClassic = theme === 'classic';

  // --------------------------------------------------------------------------
  // SİYAH-BEYAZ (KLASİK) TEMA:
  // Renklendirme olmadığı için kurallar ve bölümler SADECE ŞEKİLLER üzerine kurgulanır.
  // Hiçbir renk kuralı üretilmez, ikonların altında renk ismi yazılmaz.
  // --------------------------------------------------------------------------
  if (isClassic) {
    const classicPool: RuleCategory[] = ['shape_touch'];
    if (score >= 6) classicPool.push('shape_avoid');
    if (score >= 15) classicPool.push('size_extremes');
    if (score >= 25) classicPool.push('shape_corners');
    if (score >= 40) classicPool.push('shape_unique', 'number_max');
    if (score >= 60) {
      classicPool.push('reverse_trick', 'number_even', 'number_odd', 'shape_sides_avoid');
    }

    const chosenCategory = pickRandom(classicPool);
    const availableShapes = shuffle(ALL_SHAPES).slice(0, count);

    let rule: GameRule;
    const objects: GameObject[] = [];

    switch (chosenCategory) {
      case 'shape_touch': {
        const targetShape = pickRandom(availableShapes);
        rule = {
          id: `rule-${Date.now()}`,
          category: 'shape_touch',
          instructionText: `${SHAPE_NAMES[targetShape]} şekline dokun!`,
          isNegative: false,
          targetShape,
          timeLimitSeconds: baseTime,
        };

        availableShapes.forEach((shp, idx) => {
          const isTarget = shp === targetShape;
          objects.push({
            id: `obj-${idx}-${Date.now()}`,
            color: 'blue',
            colorName: '',
            shape: shp,
            size: 'medium',
            isDangerous: !isTarget,
            isCorrect: isTarget,
          });
        });
        break;
      }

      case 'shape_avoid': {
        const forbiddenShape = pickRandom(availableShapes);
        rule = {
          id: `rule-${Date.now()}`,
          category: 'shape_avoid',
          instructionText: `${SHAPE_NAMES[forbiddenShape]} şekline SAKIN DOKUNMA!`,
          subText: 'Farklı bir şekle dokun.',
          isNegative: true,
          targetShape: forbiddenShape,
          timeLimitSeconds: baseTime,
        };

        availableShapes.forEach((shp, idx) => {
          const isForbidden = shp === forbiddenShape;
          objects.push({
            id: `obj-${idx}-${Date.now()}`,
            color: 'blue',
            colorName: '',
            shape: shp,
            size: 'medium',
            isDangerous: isForbidden,
            isCorrect: !isForbidden,
          });
        });
        break;
      }

      case 'reverse_trick': {
        const trickShape = pickRandom(availableShapes);
        rule = {
          id: `rule-${Date.now()}`,
          category: 'reverse_trick',
          instructionText: `TERS KÖŞE! ${SHAPE_NAMES[trickShape]} HARİCİNE dokun!`,
          subText: 'Ters refleks! Farklı bir şekil seç.',
          isNegative: true,
          targetShape: trickShape,
          timeLimitSeconds: baseTime,
        };

        availableShapes.forEach((shp, idx) => {
          const isTrick = shp === trickShape;
          objects.push({
            id: `obj-${idx}-${Date.now()}`,
            color: 'blue',
            colorName: '',
            shape: shp,
            size: 'medium',
            isDangerous: isTrick,
            isCorrect: !isTrick,
          });
        });
        break;
      }

      case 'size_extremes': {
        const wantsLargest = Math.random() > 0.5;
        const assignedSizes: ('small' | 'medium' | 'large')[] = [];
        assignedSizes.push(wantsLargest ? 'large' : 'small');
        for (let i = 1; i < count; i++) {
          assignedSizes.push(wantsLargest ? 'small' : 'large');
        }
        const shuffledSizes = shuffle(assignedSizes);

        rule = {
          id: `rule-${Date.now()}`,
          category: 'size_extremes',
          instructionText: wantsLargest ? 'En BÜYÜK şekle dokun!' : 'En KÜÇÜK şekle dokun!',
          isNegative: false,
          timeLimitSeconds: baseTime,
        };

        availableShapes.forEach((shp, idx) => {
          const sz = shuffledSizes[idx];
          const isWinner = wantsLargest ? sz === 'large' : sz === 'small';
          objects.push({
            id: `obj-${idx}-${Date.now()}`,
            color: 'blue',
            colorName: '',
            shape: shp,
            size: sz,
            isDangerous: !isWinner,
            isCorrect: isWinner,
          });
        });
        break;
      }

      case 'shape_corners': {
        // Distinct corner rules with unambiguous targets
        const CORNER_TYPES: { shape: ShapeType; text: string; conflict: ShapeType[] }[] = [
          { shape: 'circle', text: 'KÖŞESİZ (yuvarlak) şekle dokun!', conflict: ['circle'] },
          { shape: 'triangle', text: '3 KÖŞELİ şekle dokun!', conflict: ['triangle'] },
          { shape: 'square', text: '4 KÖŞELİ kareye dokun!', conflict: ['square', 'diamond'] },
          { shape: 'star', text: '5 KÖŞELİ yıldıza dokun!', conflict: ['star'] },
          { shape: 'hexagon', text: '6 KÖŞELİ altıgene dokun!', conflict: ['hexagon'] },
        ];

        const cornerGoal = pickRandom(CORNER_TYPES);
        const otherAllowedShapes = shuffle(
          ALL_SHAPES.filter((s) => !cornerGoal.conflict.includes(s))
        ).slice(0, count - 1);

        const roundShapes = shuffle([cornerGoal.shape, ...otherAllowedShapes]);

        rule = {
          id: `rule-${Date.now()}`,
          category: 'shape_corners',
          instructionText: cornerGoal.text,
          isNegative: false,
          targetShape: cornerGoal.shape,
          timeLimitSeconds: baseTime,
        };

        roundShapes.forEach((shp, idx) => {
          const isTarget = shp === cornerGoal.shape;
          objects.push({
            id: `obj-${idx}-${Date.now()}`,
            color: 'blue',
            colorName: '',
            shape: shp,
            size: 'medium',
            isDangerous: !isTarget,
            isCorrect: isTarget,
          });
        });
        break;
      }

      case 'shape_unique': {
        // One unique shape among multiple identical shapes
        const uniqueShape = pickRandom(ALL_SHAPES);
        const commonShape = pickRandom(ALL_SHAPES.filter((s) => s !== uniqueShape));

        const roundShapes: ShapeType[] = [uniqueShape];
        for (let i = 1; i < count; i++) {
          roundShapes.push(commonShape);
        }
        const shuffledUniqueShapes = shuffle(roundShapes);

        rule = {
          id: `rule-${Date.now()}`,
          category: 'shape_unique',
          instructionText: 'Diğerlerinden FARKLI şekle dokun!',
          subText: 'Tek olan şekli yakala!',
          isNegative: false,
          targetShape: uniqueShape,
          timeLimitSeconds: baseTime * 1.05,
        };

        shuffledUniqueShapes.forEach((shp, idx) => {
          const isTarget = shp === uniqueShape;
          objects.push({
            id: `obj-${idx}-${Date.now()}`,
            color: 'blue',
            colorName: '',
            shape: shp,
            size: 'medium',
            isDangerous: !isTarget,
            isCorrect: isTarget,
          });
        });
        break;
      }

      case 'shape_sides_avoid': {
        // Negative corner avoidance: "KÖŞELİ şekillere SAKIN DOKUNMA! (Sadece köşesiz daireye dokun)"
        const cornerShapes = shuffle(ALL_SHAPES.filter((s) => s !== 'circle')).slice(0, count - 1);
        const roundShapes = shuffle(['circle' as ShapeType, ...cornerShapes]);

        rule = {
          id: `rule-${Date.now()}`,
          category: 'shape_sides_avoid',
          instructionText: 'KÖŞELİ şekillere SAKIN DOKUNMA!',
          subText: 'Sadece yuvarlak/köşesiz daireye dokun!',
          isNegative: true,
          targetShape: 'circle',
          timeLimitSeconds: baseTime,
        };

        roundShapes.forEach((shp, idx) => {
          const isCircle = shp === 'circle';
          objects.push({
            id: `obj-${idx}-${Date.now()}`,
            color: 'blue',
            colorName: '',
            shape: shp,
            size: 'medium',
            isDangerous: !isCircle,
            isCorrect: isCircle,
          });
        });
        break;
      }

      case 'number_max': {
        const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, count);
        const maxNum = Math.max(...numbers);

        rule = {
          id: `rule-${Date.now()}`,
          category: 'number_max',
          instructionText: 'En BÜYÜK sayıya dokun!',
          isNegative: false,
          timeLimitSeconds: baseTime * 1.1,
        };

        numbers.forEach((num, idx) => {
          const isTarget = num === maxNum;
          objects.push({
            id: `obj-${idx}-${Date.now()}`,
            color: 'blue',
            colorName: '',
            shape: availableShapes[idx % availableShapes.length],
            number: num,
            size: 'medium',
            isDangerous: !isTarget,
            isCorrect: isTarget,
          });
        });
        break;
      }

      case 'number_even': {
        const evens = [2, 4, 6, 8];
        const odds = [1, 3, 5, 7, 9];
        const targetEven = pickRandom(evens);
        const otherOdds = shuffle(odds).slice(0, count - 1);
        const chosenNumbers = shuffle([targetEven, ...otherOdds]);

        rule = {
          id: `rule-${Date.now()}`,
          category: 'number_even',
          instructionText: 'ÇİFT sayılı şekle dokun!',
          subText: '2, 4, 6 veya 8',
          isNegative: false,
          timeLimitSeconds: baseTime * 1.1,
        };

        chosenNumbers.forEach((num, idx) => {
          const isEven = num % 2 === 0;
          objects.push({
            id: `obj-${idx}-${Date.now()}`,
            color: 'blue',
            colorName: '',
            shape: availableShapes[idx % availableShapes.length],
            number: num,
            size: 'medium',
            isDangerous: !isEven,
            isCorrect: isEven,
          });
        });
        break;
      }

      case 'number_odd':
      default: {
        const evens = [2, 4, 6, 8];
        const odds = [1, 3, 5, 7, 9];
        const targetOdd = pickRandom(odds);
        const otherEvens = shuffle(evens).slice(0, count - 1);
        const chosenNumbers = shuffle([targetOdd, ...otherEvens]);

        rule = {
          id: `rule-${Date.now()}`,
          category: 'number_odd',
          instructionText: 'TEK sayılı şekle dokun!',
          subText: '1, 3, 5, 7 veya 9',
          isNegative: false,
          timeLimitSeconds: baseTime * 1.1,
        };

        chosenNumbers.forEach((num, idx) => {
          const isOdd = num % 2 !== 0;
          objects.push({
            id: `obj-${idx}-${Date.now()}`,
            color: 'blue',
            colorName: '',
            shape: availableShapes[idx % availableShapes.length],
            number: num,
            size: 'medium',
            isDangerous: !isOdd,
            isCorrect: isOdd,
          });
        });
        break;
      }
    }

    return { rule, objects: shuffle(objects) };
  }

  // --------------------------------------------------------------------------
  // RENKLİ PIXAR TEMASI:
  // Renk ve şekil odaklı eğlenceli turlar (ikon altında renk ismi yazılmaz)
  // --------------------------------------------------------------------------
  const rulePool: RuleCategory[] = ['color_touch', 'shape_touch'];
  if (score >= 6) rulePool.push('color_avoid');
  if (score >= 18) rulePool.push('shape_avoid');
  if (score >= 40) rulePool.push('size_extremes', 'number_max');
  if (score >= 75) rulePool.push('stroop_text', 'reverse_trick', 'number_even', 'shape_unique');

  const chosenType = pickRandom(rulePool);

  const availableColors = shuffle(ALL_COLORS).slice(0, count);
  const availableShapes = shuffle(ALL_SHAPES).slice(0, count);
  const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, count);

  let rule: GameRule;
  const objects: GameObject[] = [];

  switch (chosenType) {
    case 'color_touch': {
      const targetColor = pickRandom(availableColors);
      rule = {
        id: `rule-${Date.now()}`,
        category: 'color_touch',
        instructionText: `${COLOR_CONFIG[targetColor].name} olana dokun.`,
        isNegative: false,
        highlightColor: targetColor,
        timeLimitSeconds: baseTime,
      };

      availableColors.forEach((col, idx) => {
        const isTarget = col === targetColor;
        objects.push({
          id: `obj-${idx}-${Date.now()}`,
          color: col,
          colorName: COLOR_CONFIG[col].name,
          shape: pickRandom(ALL_SHAPES),
          size: 'medium',
          isDangerous: !isTarget,
          isCorrect: isTarget,
        });
      });
      break;
    }

    case 'color_avoid': {
      const forbiddenColor = pickRandom(availableColors);
      rule = {
        id: `rule-${Date.now()}`,
        category: 'color_avoid',
        instructionText: `${COLOR_CONFIG[forbiddenColor].name} olana SAKIN DOKUNMA!`,
        subText: 'Diğer herhangi birine dokun.',
        isNegative: true,
        highlightColor: forbiddenColor,
        timeLimitSeconds: baseTime,
      };

      availableColors.forEach((col, idx) => {
        const isForbidden = col === forbiddenColor;
        objects.push({
          id: `obj-${idx}-${Date.now()}`,
          color: col,
          colorName: COLOR_CONFIG[col].name,
          shape: pickRandom(ALL_SHAPES),
          size: 'medium',
          isDangerous: isForbidden,
          isCorrect: !isForbidden,
        });
      });
      break;
    }

    case 'shape_touch': {
      const targetShape = pickRandom(availableShapes);
      rule = {
        id: `rule-${Date.now()}`,
        category: 'shape_touch',
        instructionText: `${SHAPE_NAMES[targetShape]} şekline dokun!`,
        isNegative: false,
        targetShape: targetShape,
        timeLimitSeconds: baseTime,
      };

      availableShapes.forEach((shp, idx) => {
        const isTarget = shp === targetShape;
        objects.push({
          id: `obj-${idx}-${Date.now()}`,
          color: availableColors[idx % availableColors.length],
          colorName: COLOR_CONFIG[availableColors[idx % availableColors.length]].name,
          shape: shp,
          size: 'medium',
          isDangerous: !isTarget,
          isCorrect: isTarget,
        });
      });
      break;
    }

    case 'shape_avoid': {
      const forbiddenShape = pickRandom(availableShapes);
      rule = {
        id: `rule-${Date.now()}`,
        category: 'shape_avoid',
        instructionText: `${SHAPE_NAMES[forbiddenShape]} şekline SAKIN DOKUNMA!`,
        subText: 'Farklı bir şekle dokun.',
        isNegative: true,
        targetShape: forbiddenShape,
        timeLimitSeconds: baseTime,
      };

      availableShapes.forEach((shp, idx) => {
        const isForbidden = shp === forbiddenShape;
        objects.push({
          id: `obj-${idx}-${Date.now()}`,
          color: availableColors[idx % availableColors.length],
          colorName: COLOR_CONFIG[availableColors[idx % availableColors.length]].name,
          shape: shp,
          size: 'medium',
          isDangerous: isForbidden,
          isCorrect: !isForbidden,
        });
      });
      break;
    }

    case 'number_max': {
      const maxNum = Math.max(...numbers);
      rule = {
        id: `rule-${Date.now()}`,
        category: 'number_max',
        instructionText: 'En BÜYÜK sayıya dokun!',
        isNegative: false,
        timeLimitSeconds: baseTime * 1.1,
      };

      numbers.forEach((num, idx) => {
        const isTarget = num === maxNum;
        objects.push({
          id: `obj-${idx}-${Date.now()}`,
          color: availableColors[idx % availableColors.length],
          colorName: COLOR_CONFIG[availableColors[idx % availableColors.length]].name,
          shape: 'circle',
          number: num,
          size: 'medium',
          isDangerous: !isTarget,
          isCorrect: isTarget,
        });
      });
      break;
    }

    case 'number_even': {
      const hasEven = numbers.some((n) => n % 2 === 0);
      const chosenNumbers = hasEven ? numbers : [...numbers.slice(0, numbers.length - 1), 4];

      rule = {
        id: `rule-${Date.now()}`,
        category: 'number_even',
        instructionText: 'ÇİFT sayıya dokun!',
        subText: '2, 4, 6 veya 8',
        isNegative: false,
        timeLimitSeconds: baseTime * 1.1,
      };

      chosenNumbers.forEach((num, idx) => {
        const isEven = num % 2 === 0;
        objects.push({
          id: `obj-${idx}-${Date.now()}`,
          color: availableColors[idx % availableColors.length],
          colorName: COLOR_CONFIG[availableColors[idx % availableColors.length]].name,
          shape: 'square',
          number: num,
          size: 'medium',
          isDangerous: !isEven,
          isCorrect: isEven,
        });
      });
      break;
    }

    case 'size_extremes': {
      const wantsLargest = Math.random() > 0.5;
      const assignedSizes: ('small' | 'medium' | 'large')[] = [];
      assignedSizes.push(wantsLargest ? 'large' : 'small');
      for (let i = 1; i < count; i++) {
        assignedSizes.push(wantsLargest ? 'small' : 'large');
      }
      const shuffledSizes = shuffle(assignedSizes);

      rule = {
        id: `rule-${Date.now()}`,
        category: 'size_extremes',
        instructionText: wantsLargest ? 'En BÜYÜK şekle dokun!' : 'En KÜÇÜK şekle dokun!',
        isNegative: false,
        timeLimitSeconds: baseTime,
      };

      shuffledSizes.forEach((sz, idx) => {
        const isWinner = wantsLargest ? sz === 'large' : sz === 'small';
        objects.push({
          id: `obj-${idx}-${Date.now()}`,
          color: availableColors[idx % availableColors.length],
          colorName: COLOR_CONFIG[availableColors[idx % availableColors.length]].name,
          shape: 'circle',
          size: sz,
          isDangerous: !isWinner,
          isCorrect: isWinner,
        });
      });
      break;
    }

    case 'shape_unique': {
      const uniqueShape = pickRandom(ALL_SHAPES);
      const commonShape = pickRandom(ALL_SHAPES.filter((s) => s !== uniqueShape));

      const roundShapes: ShapeType[] = [uniqueShape];
      for (let i = 1; i < count; i++) {
        roundShapes.push(commonShape);
      }
      const shuffledUniqueShapes = shuffle(roundShapes);

      rule = {
        id: `rule-${Date.now()}`,
        category: 'shape_unique',
        instructionText: 'Diğerlerinden FARKLI şekle dokun!',
        subText: 'Tek olan şekli yakala!',
        isNegative: false,
        targetShape: uniqueShape,
        timeLimitSeconds: baseTime * 1.05,
      };

      shuffledUniqueShapes.forEach((shp, idx) => {
        const isTarget = shp === uniqueShape;
        objects.push({
          id: `obj-${idx}-${Date.now()}`,
          color: availableColors[idx % availableColors.length],
          colorName: COLOR_CONFIG[availableColors[idx % availableColors.length]].name,
          shape: shp,
          size: 'medium',
          isDangerous: !isTarget,
          isCorrect: isTarget,
        });
      });
      break;
    }

    case 'stroop_text': {
      const wordColor = pickRandom(availableColors);
      const textColor = pickRandom(availableColors.filter((c) => c !== wordColor));
      const textSaysName = COLOR_CONFIG[wordColor].name;

      const askForText = Math.random() > 0.5;

      rule = {
        id: `rule-${Date.now()}`,
        category: 'stroop_text',
        instructionText: askForText
          ? `Üzerinde "${textSaysName}" YAZANA dokun!`
          : `Rengi ${COLOR_CONFIG[textColor].name} olana dokun!`,
        subText: 'Kandırmacaya dikkat!',
        isNegative: false,
        timeLimitSeconds: baseTime * 1.15,
      };

      availableColors.forEach((col, idx) => {
        const label = idx === 0 ? textSaysName : COLOR_CONFIG[pickRandom(ALL_COLORS)].name;
        const finalCol = idx === 0 ? textColor : col;
        const isCorrect = askForText ? label === textSaysName : finalCol === textColor;

        objects.push({
          id: `obj-${idx}-${Date.now()}`,
          color: finalCol,
          colorName: COLOR_CONFIG[finalCol].name,
          shape: 'square',
          label: label,
          size: 'medium',
          isDangerous: !isCorrect,
          isCorrect: isCorrect,
        });
      });
      break;
    }

    case 'reverse_trick':
    default: {
      const trickColor = pickRandom(availableColors);
      rule = {
        id: `rule-${Date.now()}`,
        category: 'reverse_trick',
        instructionText: `TERS KÖŞE! ${COLOR_CONFIG[trickColor].name} HARİCİNE dokun!`,
        subText: 'Ters refleks!',
        isNegative: true,
        highlightColor: trickColor,
        timeLimitSeconds: baseTime,
      };

      availableColors.forEach((col, idx) => {
        const isTrick = col === trickColor;
        objects.push({
          id: `obj-${idx}-${Date.now()}`,
          color: col,
          colorName: COLOR_CONFIG[col].name,
          shape: pickRandom(ALL_SHAPES),
          size: 'medium',
          isDangerous: isTrick,
          isCorrect: !isTrick,
        });
      });
      break;
    }
  }

  return { rule, objects: shuffle(objects) };
}
