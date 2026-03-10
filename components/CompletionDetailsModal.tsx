'use client';

import { Habit, HabitCompletion } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface CompletionDetailsModalProps {
  habit: Habit;
  completion: HabitCompletion;
  onClose: () => void;
}

export function CompletionDetailsModal({
  habit,
  completion,
  onClose,
}: CompletionDetailsModalProps) {
  const completedAt =
    completion.completedAt instanceof Date
      ? completion.completedAt
      : new Date(completion.completedAt);

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-3xl border-2 border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold pr-8">{habit.title}</DialogTitle>
          {habit.description && (
            <p className="text-sm text-foreground/60 mt-1">{habit.description}</p>
          )}
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <span className="font-semibold text-secondary">
              +{completion.xpEarned} XP
            </span>
            <span className="text-foreground/60">
              {completedAt.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}{' '}
              at{' '}
              {completedAt.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}
            </span>
          </div>

          {completion.notes && (
            <div>
              <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wide mb-1">
                Note
              </p>
              <p className="text-sm text-foreground italic">&quot;{completion.notes}&quot;</p>
            </div>
          )}

          {completion.proofImageUrl && (
            <div>
              <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wide mb-2">
                Proof
              </p>
              <img
                src={completion.proofImageUrl}
                alt="Completion proof"
                className="w-full max-h-64 object-contain rounded-xl border border-border bg-muted/30"
              />
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-4 rounded-xl font-semibold bg-primary text-foreground hover:bg-primary/90 transition-colors"
          >
            Close
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
