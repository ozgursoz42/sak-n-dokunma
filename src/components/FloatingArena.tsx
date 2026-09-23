import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { GameObject, ThemeType } from '../types';
import { Pixar3DShape } from './Pixar3DShape';

interface FloatingObjectState {
  id: string;
  obj: GameObject;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  rotation: number;
  scale: number;
  isTapped: boolean;
}

interface FloatingArenaProps {
  objects: GameObject[];
  score: number;
  onTap: (obj: GameObject, position: { x: number; y: number }) => void;
  disabled?: boolean;
  theme?: ThemeType;
}

export const FloatingArena: React.FC<FloatingArenaProps> = ({
  objects,
  score,
  onTap,
  disabled = false,
  theme = 'pixar',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [items, setItems] = useState<FloatingObjectState[]>([]);
  const itemsRef = useRef<FloatingObjectState[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const dimensionsRef = useRef<{ width: number; height: number }>({ width: 340, height: 420 });

  // Base speed scales gently with score
  // Early levels (score 0-10): calm & gentle floating (~42-55 px/s) to let players adapt comfortably
  // Gradually speeds up as score increases up to 135 px/s
  const getBaseSpeed = useCallback(() => {
    if (score < 10) {
      return 42 + score * 1.5;
    }
    if (score < 30) {
      return 57 + (score - 10) * 1.2;
    }
    return Math.min(81 + Math.floor((score - 30) / 5) * 3, 135);
  }, [score]);

  // Initialize objects in the arena with good spacing and varied diagonal/horizontal/vertical velocities
  useEffect(() => {
    const container = containerRef.current;
    const width = container ? container.clientWidth : 340;
    const height = container ? container.clientHeight : 420;
    dimensionsRef.current = { width, height };

    const radius = 42; // Hit radius ~84px diameter
    const speed = getBaseSpeed();

    // Distribute evenly in a grid/circle pattern initially so they don't overlap on spawn
    const count = objects.length;
    const cols = count <= 3 ? count : count === 4 ? 2 : 3;
    const rows = Math.ceil(count / cols);

    const cellW = (width - radius * 2) / cols;
    const cellH = (height - radius * 2) / rows;

    const initialStates: FloatingObjectState[] = objects.map((obj, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);

      // Center within its spawn cell + minor jitter
      const spawnX = radius + col * cellW + cellW / 2 + (Math.random() - 0.5) * 20;
      const spawnY = radius + row * cellH + cellH / 2 + (Math.random() - 0.5) * 20;

      // Random movement direction (all 360 degrees: horizontal, vertical, diagonal)
      const angle = (idx * (2 * Math.PI / count)) + (Math.random() - 0.5) * 0.8;
      const itemSpeed = speed * (0.85 + Math.random() * 0.35);

      return {
        id: obj.id,
        obj,
        x: Math.max(radius, Math.min(width - radius, spawnX)),
        y: Math.max(radius, Math.min(height - radius, spawnY)),
        vx: Math.cos(angle) * itemSpeed,
        vy: Math.sin(angle) * itemSpeed,
        radius,
        rotation: (Math.random() - 0.5) * 12,
        scale: 1,
        isTapped: false,
      };
    });

    itemsRef.current = initialStates;
    setItems(initialStates);
    lastTimeRef.current = performance.now();
  }, [objects, getBaseSpeed]);

  // Handle window/container resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        dimensionsRef.current = {
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        };
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Continuous 60FPS physics animation loop
  useEffect(() => {
    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTimeRef.current) / 1000, 0.05); // Cap dt to prevent tunneling
      lastTimeRef.current = currentTime;

      const { width, height } = dimensionsRef.current;
      const currentItems = itemsRef.current;

      if (width > 0 && height > 0 && currentItems.length > 0) {
        // 1. Move and bounce off container walls
        for (let i = 0; i < currentItems.length; i++) {
          const item = currentItems[i];
          if (item.isTapped) continue;

          item.x += item.vx * dt;
          item.y += item.vy * dt;

          const r = item.radius;

          // Left wall
          if (item.x - r < 0) {
            item.x = r;
            item.vx = Math.abs(item.vx) * (0.95 + Math.random() * 0.1);
            // Slight angle perturbation to keep it organic
            item.vy += (Math.random() - 0.5) * 15;
          }
          // Right wall
          else if (item.x + r > width) {
            item.x = width - r;
            item.vx = -Math.abs(item.vx) * (0.95 + Math.random() * 0.1);
            item.vy += (Math.random() - 0.5) * 15;
          }

          // Top wall
          if (item.y - r < 0) {
            item.y = r;
            item.vy = Math.abs(item.vy) * (0.95 + Math.random() * 0.1);
            item.vx += (Math.random() - 0.5) * 15;
          }
          // Bottom wall
          else if (item.y + r > height) {
            item.y = height - r;
            item.vy = -Math.abs(item.vy) * (0.95 + Math.random() * 0.1);
            item.vx += (Math.random() - 0.5) * 15;
          }

          // Tilt slightly in the direction of velocity
          item.rotation = (item.vx / 100) * 8;
        }

        // 2. Soft elastic bounce between floating characters so they don't get stuck together
        for (let i = 0; i < currentItems.length; i++) {
          for (let j = i + 1; j < currentItems.length; j++) {
            const a = currentItems[i];
            const b = currentItems[j];
            if (a.isTapped || b.isTapped) continue;

            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.hypot(dx, dy);
            const minDist = a.radius + b.radius;

            if (dist < minDist && dist > 0.001) {
              const nx = dx / dist;
              const ny = dy / dist;

              // Separate overlap
              const overlap = (minDist - dist) * 0.5;
              a.x -= nx * overlap;
              a.y -= ny * overlap;
              b.x += nx * overlap;
              b.y += ny * overlap;

              // Normal velocities
              const kx = a.vx - b.vx;
              const ky = a.vy - b.vy;
              const p = 2 * (nx * kx + ny * ky) / 2;

              a.vx -= p * nx;
              a.vy -= p * ny;
              b.vx += p * nx;
              b.vy += p * ny;
            }
          }
        }

        // Re-render
        setItems([...currentItems]);
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    item: FloatingObjectState
  ) => {
    if (disabled || item.isTapped) return;

    // Trigger visual squish animation on the clicked item
    item.isTapped = true;
    item.scale = 1.35;
    setItems([...itemsRef.current]);

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = rect.left + rect.width / 2;
    const clickY = rect.top + rect.height / 2;

    onTap(item.obj, { x: clickX, y: clickY });

    setTimeout(() => {
      item.scale = 1;
      item.isTapped = false;
      setItems([...itemsRef.current]);
    }, 200);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[360px] sm:min-h-[420px] rounded-[32px] overflow-hidden select-none border-2 p-2 touch-none transition-colors duration-300 ${
        theme === 'classic'
          ? 'bg-[#fafaf9] border-black'
          : 'bg-gradient-to-b from-purple-50/40 via-white to-blue-50/30 border-slate-200/80 shadow-[inset_0_4px_24px_rgba(0,0,0,0.02)]'
      }`}
    >
      {/* Playful Floating Arena Ambient Backdrop */}
      <div
        className={`absolute inset-0 pointer-events-none ${
          theme === 'classic'
            ? 'bg-[radial-gradient(#a1a1aa_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-40'
            : 'bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:22px_22px] opacity-60'
        }`}
      />

      {/* Floating 3D / 2D Characters */}
      {items.map((item) => {
        const d = item.radius * 2;
        return (
          <div
            key={item.id}
            id={`floating-target-${item.id}`}
            onPointerDown={(e) => handlePointerDown(e, item)}
            style={{
              position: 'absolute',
              left: `${item.x - item.radius}px`,
              top: `${item.y - item.radius}px`,
              width: `${d}px`,
              height: `${d}px`,
              transform: `rotate(${item.rotation}deg) scale(${item.scale})`,
              transition: 'transform 0.08s ease-out',
              touchAction: 'none',
              cursor: disabled ? 'default' : 'pointer',
              zIndex: item.isTapped ? 30 : 10,
            }}
            className="group flex items-center justify-center select-none active:scale-90"
          >
            {/* Dynamic Ground Floating Shadow (Pixar mode only, completely removed in classic mode) */}
            {theme !== 'classic' && (
              <div
                className="absolute -bottom-2 w-14 h-4 rounded-full blur-[4px] pointer-events-none transition-all group-hover:scale-110 bg-slate-900/15 group-hover:bg-slate-900/25"
              />
            )}

            {/* The Free-Floating Pixar / Classic Character */}
            <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
              <Pixar3DShape
                shape={item.obj.shape}
                color={item.obj.color}
                size={item.obj.size}
                label={item.obj.label}
                number={item.obj.number}
                theme={theme}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
