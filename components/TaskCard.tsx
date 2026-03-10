'use client';

import { Habit, HabitCompletion } from '@/lib/types';
import { useState, useRef } from 'react';
import { FireSparkEffect } from './FireSparkEffect';
import { CelebrationEffect } from './CelebrationEffect';
import { CompletionProofModal } from './CompletionProofModal';
import { CompletionDetailsModal } from './CompletionDetailsModal';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TaskCardProps {
  habit: Habit;
  todayCompletion: HabitCompletion | null;
  onComplete: (habitId: string, notes: string, proofImageUrl?: string) => void;
  onShowDetails: (habit: Habit) => void;
  onToggleStar?: (habitId: string) => void;
  onRequestComplete?: (habitId: string, notes: string) => void;
  isOverdue?: boolean;
  showReminderClock?: boolean;
}

export function TaskCard({
  habit,
  todayCompletion,
  onComplete,
  onShowDetails,
  onToggleStar,
  onRequestComplete,
  isOverdue = false,
  showReminderClock = false,
}: TaskCardProps) {
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [fireEffect, setFireEffect] = useState(false);
  const [celebrateEffect, setCelebrateEffect] = useState(false);
  const [effectPos, setEffectPos] = useState({ x: 0, y: 0 });
  const [showProofModal, setShowProofModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const checkboxRef = useRef<HTMLInputElement>(null);

  const triggerComplete = (proofImageUrl?: string, notesOverride?: string) => {
    const rect = checkboxRef.current?.getBoundingClientRect();
    if (rect) {
      setEffectPos({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
    setFireEffect(true);
    setCelebrateEffect(true);
    onComplete(habit.id, notesOverride ?? notes, proofImageUrl);
    setNotes('');
    setShowNotes(false);
    setShowProofModal(false);
  };

  const handleCompleteClick = () => {
    if (onRequestComplete) {
      setShowProofModal(true);
    } else {
      triggerComplete();
    }
  };

  const handleProofConfirm = (notesFromModal: string, proofImageUrl: string) => {
    triggerComplete(proofImageUrl, notesFromModal);
  };

  const isCompleted = !!todayCompletion;
  const isStarred = !!habit.isStarred;

  return (
    <>
      {showProofModal && (
        <CompletionProofModal
          habitTitle={habit.title}
          onConfirm={handleProofConfirm}
          onCancel={() => setShowProofModal(false)}
        />
      )}
      {showDetailsModal && todayCompletion && (
        <CompletionDetailsModal
          habit={habit}
          completion={todayCompletion}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
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

      <Card
        className={`rounded-3xl p-5 shadow-sm hover:shadow-md transition-all duration-200 border-2 active:scale-[0.995] ${
          isOverdue
            ? 'bg-destructive/5 border-destructive hover:border-destructive'
            : 'bg-card border-transparent hover:border-primary/20'
        }`}
      >
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <div
            ref={checkboxRef}
            onClick={isCompleted ? undefined : handleCompleteClick}
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
            <div className="flex items-center gap-2">
              <h3 className={`text-lg font-bold transition-opacity ${isCompleted ? 'opacity-60' : ''}`}>
                {habit.title}
              </h3>
              {onToggleStar && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={(e) => { e.stopPropagation(); onToggleStar(habit.id); }}
                  className="rounded shrink-0 transition-colors"
                  aria-label={isStarred ? 'Unstar' : 'Star'}
                >
                  {isStarred ? (
                    <span className="text-primary text-lg">★</span>
                  ) : (
                    <span className="text-muted-foreground text-lg">☆</span>
                  )}
                </Button>
              )}
            </div>
            {habit.description && (
              <p className="text-sm text-foreground/60 mt-1">{habit.description}</p>
            )}
            {(habit.reminderAt || habit.dueDate || (habit.recurrence === 'custom' && habit.customDueDateTime)) && (
              <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-foreground/60">
                {habit.reminderAt && (
                  <span>Remind: {habit.reminderAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} {habit.reminderAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                )}
                {(habit.dueDate || (habit.recurrence === 'custom' && habit.customDueDateTime)) && (
                  <span>Due: {(habit.dueDate || habit.customDueDateTime)!.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} {(habit.dueDate || habit.customDueDateTime)!.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                )}
              </div>
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
                {todayCompletion.proofImageUrl && (
                  <span className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded bg-muted text-foreground/70" title="Proof attached" aria-label="Proof attached">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                  </span>
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

          {/* Reminder clock (animated) */}
          {showReminderClock && (
            <div
              className="flex-shrink-0 flex items-center justify-center w-8 h-8 text-foreground/80 animate-clock-ring"
              title="Reminder set for today"
              aria-hidden
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <circle cx="12" cy="12" r="9" />
                <path strokeLinecap="round" d="M12 6v6l4 2" />
              </svg>
            </div>
          )}
          {/* XP Badge */}
          <div className="flex-shrink-0 bg-primary rounded-full px-3 py-1 font-bold text-foreground text-sm">
            +{habit.xpReward}
          </div>
        </div>

        {/* Action Buttons */}
        {!isCompleted && (
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowNotes(!showNotes)}
              className="flex-1 rounded-xl font-semibold transition-all active:scale-[0.98]"
            >
              {showNotes ? 'Cancel' : 'Add Note'}
            </Button>
            <Button
              variant="secondary"
              onClick={handleCompleteClick}
              className="flex-1 rounded-xl font-semibold transition-all active:scale-[0.98]"
            >
              Mark Done
            </Button>
          </div>
        )}

        {isCompleted && (
          <div className="mt-3 flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDetailsModal(true)}
              className="flex-1 rounded-xl font-semibold transition-all active:scale-[0.98]"
            >
              View Details
            </Button>
          </div>
        )}
      </Card>
    </>
  );
}
