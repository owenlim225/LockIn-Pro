'use client';

import { useEffect, useState } from 'react';

interface CelebrationEffectProps {
  trigger: boolean;
  onComplete?: () => void;
}

export function CelebrationEffect({ trigger, onComplete }: CelebrationEffectProps) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!trigger) return;

    setIsActive(true);
    const timer = setTimeout(() => {
      setIsActive(false);
      onComplete?.();
    }, 1500);

    return () => clearTimeout(timer);
  }, [trigger, onComplete]);

  if (!isActive) return null;

  const confetti = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.3,
    duration: 2 + Math.random() * 0.5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
      {/* Center burst animation */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="text-6xl animate-pulse">🎉</div>
      </div>

      {/* Confetti pieces */}
      {confetti.map(piece => (
        <div
          key={piece.id}
          className="absolute w-2 h-2 rounded-full animate-bounce"
          style={{
            left: `${piece.left}%`,
            top: '-10px',
            backgroundColor: ['#ffd700', '#1fb881', '#ff4b4b', '#4dabf7'][Math.floor(Math.random() * 4)],
            animation: `fall ${piece.duration}s linear ${piece.delay}s forwards`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
