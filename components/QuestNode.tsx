'use client';

import { Habit, HabitCompletion } from '@/lib/types';

interface QuestNodeProps {
  habit: Habit;
  todayCompletion: HabitCompletion | null;
  onSelect: (habit: Habit) => void;
  isCompleted: boolean;
  nodeIndex: number;
}

export function QuestNode({
  habit,
  todayCompletion,
  onSelect,
  isCompleted,
  nodeIndex,
}: QuestNodeProps) {
  const icons: Record<string, string> = {
    running: '🏃',
    meditation: '🧘',
    reading: '📚',
    water: '💧',
    sleep: '😴',
    exercise: '💪',
    coding: '💻',
    cooking: '🍳',
    default: '⭐',
  };

  const icon = icons[habit.icon] || icons.default;

  return (
    <div className="flex flex-col items-center">
      {/* Connection line to next node */}
      {nodeIndex < 4 && (
        <div className="w-1 h-12 bg-gradient-to-b from-primary/50 to-primary/20 mx-auto mb-2" />
      )}

      {/* Node */}
      <button
        onClick={() => onSelect(habit)}
        className={`relative w-24 h-24 rounded-full font-bold text-3xl transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center shadow-lg border-4 ${
          isCompleted
            ? 'bg-secondary border-secondary/50 shadow-secondary/30 scale-105 animate-pulse-grow'
            : 'bg-white border-primary hover:border-secondary'
        }`}
      >
        <span>{icon}</span>
        {isCompleted && (
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </button>

      {/* Label */}
      <h3 className="mt-3 text-sm font-bold text-center max-w-20 line-clamp-2">
        {habit.title}
      </h3>

      {/* Streak indicator */}
      {isCompleted && (
        <div className="mt-1 flex items-center gap-1 text-xs font-bold text-secondary">
          <span>🔥</span>
          <span>{todayCompletion?.xpEarned || habit.xpReward} XP</span>
        </div>
      )}
    </div>
  );
}
