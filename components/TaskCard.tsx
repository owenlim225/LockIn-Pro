'use client';

import { Habit, HabitCompletion } from '@/lib/types';
import { useState, useRef } from 'react';
import { FireSparkEffect } from './FireSparkEffect';
import { CelebrationEffect } from './CelebrationEffect';

interface TaskCardProps {
  habit: Habit;
  todayCompletion: HabitCompletion | null;
  onComplete: (habitId: string, notes: string) => void;
  onShowDetails: (habit: Habit) => void;
}

export function TaskCard({
  habit,
  todayCompletion,
  onComplete,
  onShowDetails,
}: TaskCardProps) {
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [fireEffect, setFireEffect] = useState(false);
  const [celebrateEffect, setCelebrateEffect] = useState(false);
  const [effectPos, setEffectPos] = useState({ x: 0, y: 0 });
  const checkboxRef = useRef<HTMLInputElement>(null);

  const handleComplete = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = checkboxRef.current?.getBoundingClientRect();
    if (rect) {
      setEffectPos({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
    
    setFireEffect(true);
    setCelebrateEffect(true);
    onComplete(habit.id, notes);
    setNotes('');
    setShowNotes(false);
  };

  const isCompleted = !!todayCompletion;

  return (
    <>
      <FireSparkEffect
        isActive={fireEffect}
        x={effectPos.x}
        y={effectPos.y}
        onComplete={() => setFireEffect(false)}
      />
      <CelebrationEffect
        trigger={celebrateEffect}
        onComplete={() => setCelebrateEffect(false)}
      />

      <div className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow border-2 border-transparent hover:border-primary/20">
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <div
            ref={checkboxRef}
            onClick={handleComplete}
            className={`flex-shrink-0 w-8 h-8 rounded-full border-3 flex items-center justify-center cursor-pointer transition-all ${
              isCompleted
                ? 'bg-secondary border-secondary'
                : 'border-secondary/30 hover:border-secondary'
            }`}
          >
            {isCompleted && (
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>

          {/* Task Info */}
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-bold transition-opacity ${isCompleted ? 'opacity-60' : ''}`}>
              {habit.title}
            </h3>
            {habit.description && (
              <p className="text-sm text-foreground/60 mt-1">{habit.description}</p>
            )}

            {/* Completion Details */}
            {isCompleted && todayCompletion && (
              <div className="mt-2 flex items-center gap-2 text-sm">
                <span className="font-semibold text-secondary">
                  +{todayCompletion.xpEarned} XP
                </span>
                <span className="text-foreground/50">
                  {todayCompletion.completedAt.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </span>
                {todayCompletion.notes && (
                  <span className="text-foreground/60 italic">"{todayCompletion.notes}"</span>
                )}
              </div>
            )}

            {/* Notes Input */}
            {showNotes && !isCompleted && (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add a reflection..."
                className="mt-3 w-full p-3 bg-input rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                rows={2}
              />
            )}
          </div>

          {/* XP Badge */}
          <div className="flex-shrink-0 bg-primary rounded-full px-3 py-1 font-bold text-foreground text-sm">
            +{habit.xpReward}
          </div>
        </div>

        {/* Action Buttons */}
        {!isCompleted && (
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="flex-1 text-sm font-semibold py-2 px-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-foreground"
            >
              {showNotes ? 'Cancel' : 'Add Note'}
            </button>
            <button
              onClick={handleComplete}
              className="flex-1 text-sm font-semibold py-2 px-3 rounded-xl bg-secondary hover:bg-secondary/90 text-white transition-colors"
            >
              Mark Done
            </button>
          </div>
        )}

        {isCompleted && (
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => onShowDetails(habit)}
              className="flex-1 text-sm font-semibold py-2 px-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-foreground"
            >
              View Details
            </button>
          </div>
        )}
      </div>
    </>
  );
}
