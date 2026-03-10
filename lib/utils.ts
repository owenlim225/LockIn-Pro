import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Habit, HabitCompletion } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** True if habit has a completion on the given calendar day (date at midnight). */
export function completionOnDate(habit: Habit, date: Date): boolean {
  const dayStart = new Date(date)
  dayStart.setHours(0, 0, 0, 0)
  const dayEnd = new Date(dayStart)
  dayEnd.setDate(dayEnd.getDate() + 1)
  return habit.completions.some((c) => {
    const t = new Date(c.completedAt).getTime()
    return t >= dayStart.getTime() && t < dayEnd.getTime()
  })
}

export interface OverdueOptions {
  todayCompletion: HabitCompletion | null
  now?: Date
}

/**
 * True if the habit is overdue:
 * - With explicit due: now is past due and not completed on the due date.
 * - Daily with no due: we're past midnight and it wasn't completed yesterday.
 */
export function isOverdue(habit: Habit, options: OverdueOptions): boolean {
  const { todayCompletion, now = new Date() } = options
  const effectiveDue = habit.dueDate ?? (habit.recurrence === 'custom' ? habit.customDueDateTime : null)

  if (effectiveDue) {
    if (now.getTime() < new Date(effectiveDue).getTime()) return false
    const dueDate = new Date(effectiveDue)
    dueDate.setHours(0, 0, 0, 0)
    return !completionOnDate(habit, dueDate)
  }

  // Daily (or weekly) with no explicit due: overdue if past midnight and not completed yesterday
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  return !completionOnDate(habit, yesterday)
}

export interface ShowReminderClockOptions {
  todayCompletion: HabitCompletion | null
  now?: Date
}

/** True when habit has a reminder for today and is not completed for today (reminder still relevant). */
export function showReminderClock(habit: Habit, options: ShowReminderClockOptions): boolean {
  const { todayCompletion, now = new Date() } = options
  if (!habit.reminderAt || todayCompletion) return false
  const rem = new Date(habit.reminderAt)
  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  rem.setHours(0, 0, 0, 0)
  return rem.getTime() === today.getTime()
}
