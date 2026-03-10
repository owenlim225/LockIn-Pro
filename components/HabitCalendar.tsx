'use client';

import { Habit } from '@/lib/types';
import { useState } from 'react';

interface HabitCalendarProps {
  habit: Habit;
}

export function HabitCalendar({ habit }: HabitCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

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
            className={`aspect-square flex items-center justify-center rounded-lg font-semibold text-sm transition-all ${
              day === null
                ? ''
                : isCompleted(day as number)
                  ? 'bg-secondary text-white'
                  : 'bg-muted text-foreground'
            }`}
          >
            {day && (
              <>
                {isCompleted(day) && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {!isCompleted(day) && day}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-sm text-foreground/60 text-center">
          <span className="font-semibold text-foreground">{habit.completions.length}</span> completions tracked
        </p>
      </div>
    </div>
  );
}
