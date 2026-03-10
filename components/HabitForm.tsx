'use client';

import { Habit, Recurrence } from '@/lib/types';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

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
    <Card className="rounded-3xl p-6 shadow-md border-2 border-primary/20 bg-card">
      <h2 className="text-2xl font-bold mb-6">
        {initialHabit ? 'Edit Habit' : 'New Habit'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="habit-title" className="text-sm font-semibold mb-2 block">Habit Name *</Label>
          <Input
            id="habit-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Morning Workout"
            className="rounded-xl h-auto py-3 px-4"
            required
          />
        </div>

        <div>
          <Label htmlFor="habit-desc" className="text-sm font-semibold mb-2 block">Description</Label>
          <Textarea
            id="habit-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What's this habit about?"
            className="rounded-xl min-h-0 resize-none py-3 px-4"
            rows={3}
          />
        </div>

        <div>
          <Label className="text-sm font-semibold mb-2 block">XP Reward: {xpReward}</Label>
          <input
            type="range"
            min="5"
            max="100"
            step="5"
            value={xpReward}
            onChange={(e) => setXpReward(parseInt(e.target.value))}
            className="w-full accent-secondary"
          />
          <p className="text-xs text-muted-foreground mt-1">Higher rewards for harder habits</p>
        </div>

        <div>
          <Label className="text-sm font-semibold mb-2 block">Priority</Label>
          <Button
            type="button"
            variant={isStarred ? 'default' : 'outline'}
            onClick={() => setIsStarred(!isStarred)}
            className="rounded-xl font-semibold transition-all active:scale-[0.98]"
          >
            {isStarred ? <span className="text-lg">★</span> : <span className="text-lg">☆</span>}
            <span className="ml-2">{isStarred ? 'Top priority' : 'Mark as priority'}</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="habit-reminder" className="text-sm font-semibold mb-2 block">Reminder (optional)</Label>
            <Input
              id="habit-reminder"
              type="datetime-local"
              value={reminderAt}
              onChange={(e) => setReminderAt(e.target.value)}
              className="rounded-xl h-auto py-3 px-4"
            />
          </div>
          <div>
            <Label htmlFor="habit-due" className="text-sm font-semibold mb-2 block">Due date (optional)</Label>
            <Input
              id="habit-due"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="rounded-xl h-auto py-3 px-4"
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-semibold mb-3 block">Recurrence</Label>
          <div className="flex gap-3">
            {(['daily', 'weekly', 'custom'] as Recurrence[]).map(rec => (
              <Button
                key={rec}
                type="button"
                variant={recurrence === rec ? 'secondary' : 'outline'}
                onClick={() => setRecurrence(rec)}
                className="flex-1 rounded-xl font-semibold capitalize transition-all active:scale-[0.98]"
              >
                {rec}
              </Button>
            ))}
          </div>
          {recurrence === 'custom' && (
            <div className="mt-3 space-y-3">
              <p className="text-xs text-muted-foreground">When should this repeat?</p>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setCustomPreset('today')} className="rounded-xl font-semibold transition-all active:scale-[0.98]">Today</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setCustomPreset('tomorrow')} className="rounded-xl font-semibold transition-all active:scale-[0.98]">Tomorrow</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setCustomPreset('next_week')} className="rounded-xl font-semibold transition-all active:scale-[0.98]">Next week</Button>
              </div>
              <div>
                <Label htmlFor="habit-custom-due" className="text-xs font-semibold mb-1 block">Date & time</Label>
                <Input
                  id="habit-custom-due"
                  type="datetime-local"
                  value={customDueDateTime}
                  onChange={(e) => setCustomDueDateTime(e.target.value)}
                  className="rounded-xl h-auto py-3 px-4"
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <Label className="text-sm font-semibold mb-3 block">Icon</Label>
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
                <Button
                  key={opt}
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setIcon(opt)}
                  className={`p-3 rounded-xl text-2xl h-auto transition-all active:scale-95 ${
                    icon === opt ? 'bg-primary' : ''
                  }`}
                >
                  {icons[opt]}
                </Button>
              );
            })}
          </div>
        </div>

        <div>
          <Label className="text-sm font-semibold mb-3 block">Color Theme</Label>
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
                aria-label={`Color ${c}`}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 rounded-xl font-semibold transition-all active:scale-[0.98]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="secondary"
            className="flex-1 rounded-xl font-semibold transition-all active:scale-[0.98]"
          >
            {initialHabit ? 'Update' : 'Create'} Habit
          </Button>
        </div>
      </form>
    </Card>
  );
}
