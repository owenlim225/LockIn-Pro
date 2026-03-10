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

export function HabitForm({ onSubmit, onCancel, initialHabit }: HabitFormProps) {
  const [title, setTitle] = useState(initialHabit?.title || '');
  const [description, setDescription] = useState(initialHabit?.description || '');
  const [xpReward, setXpReward] = useState(initialHabit?.xpReward || 10);
  const [recurrence, setRecurrence] = useState<Recurrence>(initialHabit?.recurrence || 'daily');
  const [icon, setIcon] = useState(initialHabit?.icon || 'default');
  const [color, setColor] = useState(initialHabit?.color || COLORS[0]);

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
