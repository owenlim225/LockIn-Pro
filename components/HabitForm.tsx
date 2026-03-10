'use client';

import { Habit, Recurrence } from '@/lib/types';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface HabitFormProps {
  onSubmit: (habit: Habit) => void;
  onCancel: () => void;
  initialHabit?: Habit;
}

const ICON_OPTIONS = ['running', 'meditation', 'reading', 'water', 'sleep', 'exercise', 'coding', 'cooking'];
const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];

function toDateTimeLocal(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDateTimeLocal(s: string): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

export function HabitForm({ onSubmit, onCancel, initialHabit }: HabitFormProps) {
  const [title, setTitle] = useState(initialHabit?.title || '');
  const [description, setDescription] = useState(initialHabit?.description || '');
  const [xpReward, setXpReward] = useState(initialHabit?.xpReward || 10);
  const [recurrence, setRecurrence] = useState<Recurrence>(initialHabit?.recurrence || 'daily');
  const [icon, setIcon] = useState(initialHabit?.icon || 'default');
  const [color, setColor] = useState(initialHabit?.color || COLORS[0]);
  const [isStarred, setIsStarred] = useState(initialHabit?.isStarred ?? false);
  const [reminderAt, setReminderAt] = useState<string>(initialHabit?.reminderAt ? toDateTimeLocal(new Date(initialHabit.reminderAt)) : '');
  const [dueDate, setDueDate] = useState<string>(initialHabit?.dueDate ? toDateTimeLocal(new Date(initialHabit.dueDate)) : '');
  const [customDueDateTime, setCustomDueDateTime] = useState<string>(initialHabit?.customDueDateTime ? toDateTimeLocal(new Date(initialHabit.customDueDateTime)) : '');

  const setCustomPreset = (preset: 'today' | 'tomorrow' | 'next_week') => {
    const now = new Date();
    let d: Date;
    if (preset === 'today') {
      d = new Date(now);
      d.setHours(17, 0, 0, 0);
    } else if (preset === 'tomorrow') {
      d = new Date(now);
      d.setDate(d.getDate() + 1);
      d.setHours(17, 0, 0, 0);
    } else {
      d = new Date(now);
      d.setDate(d.getDate() + 7);
      d.setHours(17, 0, 0, 0);
    }
    setCustomDueDateTime(toDateTimeLocal(d));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    const habit: Habit = {
      id: initialHabit?.id || uuidv4(),
      title,
      description,
      xpReward,
      recurrence,
      icon,
      color,
      createdAt: initialHabit?.createdAt || new Date(),
      completions: initialHabit?.completions || [],
      isStarred,
      reminderAt: fromDateTimeLocal(reminderAt),
      dueDate: fromDateTimeLocal(dueDate),
      customDueDateTime: recurrence === 'custom' ? fromDateTimeLocal(customDueDateTime) : null,
    };

    onSubmit(habit);
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-primary/20">
      <h2 className="text-2xl font-bold mb-6">
        {initialHabit ? 'Edit Habit' : 'New Habit'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold mb-2">Habit Name *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Morning Workout"
            className="w-full px-4 py-3 bg-input rounded-xl border-2 border-primary/20 focus:border-primary focus:outline-none transition-colors"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this habit about?"
            className="w-full px-4 py-3 bg-input rounded-xl border-2 border-primary/20 focus:border-primary focus:outline-none transition-colors resize-none"
            rows={3}
          />
        </div>

        {/* XP Reward */}
        <div>
          <label className="block text-sm font-semibold mb-2">XP Reward: {xpReward}</label>
          <input
            type="range"
            min="5"
            max="100"
            step="5"
            value={xpReward}
            onChange={(e) => setXpReward(parseInt(e.target.value))}
            className="w-full accent-secondary"
          />
          <p className="text-xs text-foreground/60 mt-1">Higher rewards for harder habits</p>
        </div>

        {/* Priority / Star */}
        <div>
          <label className="block text-sm font-semibold mb-2">Priority</label>
          <button
            type="button"
            onClick={() => setIsStarred(!isStarred)}
            className={`flex items-center gap-2 py-2 px-3 rounded-xl font-semibold transition-colors ${
              isStarred ? 'bg-primary/20 text-primary' : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            {isStarred ? <span className="text-lg">★</span> : <span className="text-lg">☆</span>}
            {isStarred ? 'Top priority' : 'Mark as priority'}
          </button>
        </div>

        {/* Reminder & Due date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Reminder (optional)</label>
            <input
              type="datetime-local"
              value={reminderAt}
              onChange={(e) => setReminderAt(e.target.value)}
              className="w-full px-4 py-3 bg-input rounded-xl border-2 border-primary/20 focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Due date (optional)</label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-3 bg-input rounded-xl border-2 border-primary/20 focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Recurrence */}
        <div>
          <label className="block text-sm font-semibold mb-3">Recurrence</label>
          <div className="flex gap-3">
            {(['daily', 'weekly', 'custom'] as Recurrence[]).map(rec => (
              <button
                key={rec}
                type="button"
                onClick={() => setRecurrence(rec)}
                className={`flex-1 py-2 px-3 rounded-xl font-semibold transition-colors capitalize ${
                  recurrence === rec
                    ? 'bg-secondary text-white'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {rec}
              </button>
            ))}
          </div>
          {recurrence === 'custom' && (
            <div className="mt-3 space-y-3">
              <p className="text-xs text-foreground/60">When should this repeat?</p>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => setCustomPreset('today')} className="py-2 px-3 rounded-xl text-sm font-semibold bg-muted hover:bg-muted/80">Today</button>
                <button type="button" onClick={() => setCustomPreset('tomorrow')} className="py-2 px-3 rounded-xl text-sm font-semibold bg-muted hover:bg-muted/80">Tomorrow</button>
                <button type="button" onClick={() => setCustomPreset('next_week')} className="py-2 px-3 rounded-xl text-sm font-semibold bg-muted hover:bg-muted/80">Next week</button>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Date & time</label>
                <input
                  type="datetime-local"
                  value={customDueDateTime}
                  onChange={(e) => setCustomDueDateTime(e.target.value)}
                  className="w-full px-4 py-3 bg-input rounded-xl border-2 border-primary/20 focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}
        </div>

        {/* Icon Selection */}
        <div>
          <label className="block text-sm font-semibold mb-3">Icon</label>
          <div className="grid grid-cols-4 gap-3">
            {ICON_OPTIONS.map(opt => {
              const icons: Record<string, string> = {
                running: '🏃',
                meditation: '🧘',
                reading: '📚',
                water: '💧',
                sleep: '😴',
                exercise: '💪',
                coding: '💻',
                cooking: '🍳',
              };
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setIcon(opt)}
                  className={`p-3 rounded-xl text-2xl transition-all ${
                    icon === opt
                      ? 'bg-primary scale-110'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  {icons[opt]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Selection */}
        <div>
          <label className="block text-sm font-semibold mb-3">Color Theme</label>
          <div className="flex gap-2">
            {COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full transition-all border-2 ${
                  color === c ? 'border-foreground scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-xl font-semibold bg-muted text-foreground hover:bg-muted/80 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-3 px-4 rounded-xl font-semibold bg-secondary text-white hover:bg-secondary/90 transition-colors"
          >
            {initialHabit ? 'Update' : 'Create'} Habit
          </button>
        </div>
      </form>
    </div>
  );
}
