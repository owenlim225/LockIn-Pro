'use client';

import { useEffect, useState } from 'react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpBonus: number;
}

interface AchievementToastProps {
  achievement: Achievement | null;
  onComplete?: () => void;
}

export function AchievementToast({ achievement, onComplete }: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!achievement) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 4000);

    return () => clearTimeout(timer);
  }, [achievement, onComplete]);

  if (!achievement || !isVisible) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-primary p-4 min-w-64">
        <div className="flex items-start gap-4">
          <div className="text-4xl flex-shrink-0">{achievement.icon}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-foreground">{achievement.title}</h3>
            <p className="text-sm text-foreground/60 mt-1">{achievement.description}</p>
            <p className="text-sm font-bold text-secondary mt-2">+{achievement.xpBonus} Bonus XP</p>
          </div>
        </div>
      </div>
    </div>
  );
}
