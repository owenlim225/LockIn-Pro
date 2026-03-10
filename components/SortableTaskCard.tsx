'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Habit, HabitCompletion } from '@/lib/types';
import { TaskCard } from '@/components/TaskCard';
import { cn } from '@/lib/utils';

interface SortableTaskCardProps {
  habit: Habit;
  todayCompletion: HabitCompletion | null;
  onComplete: (habitId: string, notes: string, proofImageUrl?: string) => void;
  onShowDetails: (habit: Habit) => void;
  onToggleStar?: (habitId: string) => void;
  onRequestComplete?: (habitId: string, notes: string) => void;
  isOverdue?: boolean;
  showReminderClock?: boolean;
  className?: string;
}

export function SortableTaskCard(props: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.habit.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={cn('touch-none', props.className)}>
      <div className="flex items-stretch gap-1">
        <div
          ref={setActivatorNodeRef}
          className="flex shrink-0 items-center justify-center w-8 rounded-l-2xl cursor-grab active:cursor-grabbing text-foreground/40 hover:text-foreground/70 hover:bg-muted/50 touch-manipulation"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <circle cx="9" cy="6" r="1.5" />
            <circle cx="9" cy="12" r="1.5" />
            <circle cx="9" cy="18" r="1.5" />
            <circle cx="15" cy="6" r="1.5" />
            <circle cx="15" cy="12" r="1.5" />
            <circle cx="15" cy="18" r="1.5" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <TaskCard {...props} />
        </div>
      </div>
    </div>
  );
}
