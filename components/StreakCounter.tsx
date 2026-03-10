'use client';

import { useEffect, useState } from 'react';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakCounter({ currentStreak, longestStreak }: StreakCounterProps) {
  const [displayStreak, setDisplayStreak] = useState(0);

  useEffect(() => {
    if (currentStreak === 0) {
      setDisplayStreak(0);
      return;
    }

    let count = 0;
    const interval = setInterval(() => {
      count++;
      setDisplayStreak(Math.min(count, currentStreak));
      if (count >= currentStreak) clearInterval(interval);
    }, 30);

    return () => clearInterval(interval);
  }, [currentStreak]);

  return (
    <div className="flex items-center gap-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-3xl">🔥</span>
          <p className="text-4xl font-black text-secondary tabular-nums">
            {displayStreak}
          </p>
        </div>
        <p className="text-xs text-muted-foreground">Current Streak</p>
      </div>

      {longestStreak > currentStreak && (
        <div className="flex items-center gap-1 px-3 py-2 bg-primary/10 rounded-xl">
          <span className="text-lg">👑</span>
          <div>
            <p className="text-xs font-bold text-primary">{longestStreak}</p>
            <p className="text-xs text-muted-foreground">Best</p>
          </div>
        </div>
      )}
    </div>
  );
}
