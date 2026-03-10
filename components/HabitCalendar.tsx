'use client';

import { Habit, HabitCompletion } from '@/lib/types';
import { useState } from 'react';
import { CompletionDetailsModal } from '@/components/CompletionDetailsModal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface HabitCalendarProps {
  habit: Habit;
}

export function HabitCalendar({ habit }: HabitCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCompletion, setSelectedCompletion] = useState<HabitCompletion | null>(null);
  const [noCompletionDate, setNoCompletionDate] = useState<{ year: number; month: number; day: number } | null>(null);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const completedDates = new Set(
    habit.completions.map(c => {
      const d = new Date(c.completedAt);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    })
  );

  const getCompletionForDay = (day: number): HabitCompletion | null => {
    return habit.completions.find(c => {
      const d = new Date(c.completedAt);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    }) ?? null;
  };

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const isCompleted = (day: number) => {
    const dateStr = `${year}-${month}-${day}`;
    return completedDates.has(dateStr);
  };

  const handleDayClick = (day: number) => {
    const completion = getCompletionForDay(day);
    if (completion) {
      setSelectedCompletion(completion);
    } else {
      setNoCompletionDate({ year, month, day });
    }
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const canGoPrev = !(month === habit.createdAt.getMonth() && year === habit.createdAt.getFullYear());
  const canGoNext = !(month === new Date().getMonth() && year === new Date().getFullYear());

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-primary/20">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-lg font-bold">
          {monthNames[month]} {year}
        </h3>
        <button
          onClick={nextMonth}
          disabled={!canGoNext}
          className="p-2 rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-xs font-bold text-foreground/60 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => (
          <div
            key={index}
            role={day !== null ? 'button' : undefined}
            tabIndex={day !== null ? 0 : undefined}
            onClick={day !== null ? () => handleDayClick(day) : undefined}
            onKeyDown={day !== null ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleDayClick(day); } } : undefined}
            className={`aspect-square flex items-center justify-center rounded-lg font-semibold text-sm transition-all ${
              day === null
                ? ''
                : isCompleted(day as number)
                  ? 'bg-secondary text-white cursor-pointer hover:bg-secondary/90 active:scale-[0.98]'
                  : 'bg-muted text-foreground cursor-pointer hover:bg-muted/80 active:scale-[0.98]'
            } ${day !== null ? 'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2' : ''}`}
            aria-label={day !== null ? `Day ${day}${isCompleted(day as number) ? ', completed – view details' : ', no completion'}` : undefined}
          >
            {day && (
              <>
                {isCompleted(day) && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {!isCompleted(day) && day}
              </>
            )}
          </div>
        ))}
      </div>

      {selectedCompletion && (
        <CompletionDetailsModal
          habit={habit}
          completion={selectedCompletion}
          onClose={() => setSelectedCompletion(null)}
        />
      )}

      {noCompletionDate && (
        <Dialog open onOpenChange={(open) => !open && setNoCompletionDate(null)}>
          <DialogContent className="sm:max-w-md rounded-3xl border-2 border-primary/20 duration-300">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold pr-8">{habit.title}</DialogTitle>
              {habit.description && (
                <p className="text-sm text-foreground/60 mt-1">{habit.description}</p>
              )}
            </DialogHeader>
            <p className="text-sm text-foreground/70 py-2">
              No completion recorded for{' '}
              {new Date(noCompletionDate.year, noCompletionDate.month, noCompletionDate.day).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
              .
            </p>
            <DialogFooter className="sm:justify-end">
              <Button onClick={() => setNoCompletionDate(null)} className="w-full sm:w-auto rounded-xl">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Stats */}
      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-sm text-foreground/60 text-center">
          <span className="font-semibold text-foreground">{habit.completions.length}</span> completions tracked
        </p>
      </div>
    </div>
  );
}
