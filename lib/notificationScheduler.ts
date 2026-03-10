import { StorageManager } from './storage';
import { completionOnDate } from './utils';

const NOTIFICATION_PERMISSION_KEY = 'lockin-pro-notification-permission-asked';
const CHECK_INTERVAL_MS = 60_000; // every minute

/** Keys we've already sent a notification for this session (habitId-dateType). */
const notifiedKeys = new Set<string>();

function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function maybeNotifyReminder(habitId: string, habitTitle: string, reminderAt: Date, now: Date): void {
  if (now.getTime() < reminderAt.getTime()) return;
  const key = `${habitId}-${dateKey(reminderAt)}-reminder`;
  if (notifiedKeys.has(key)) return;
  try {
    new Notification(`Reminder: ${habitTitle}`, {
      body: `Time to do "${habitTitle}".`,
      icon: '/icon.svg',
    });
    notifiedKeys.add(key);
  } catch {
    // Notification API may throw if permission revoked
  }
}

function maybeNotifyDeadline(habitId: string, habitTitle: string, due: Date, now: Date, completedOnDueDate: boolean): void {
  if (now.getTime() <= due.getTime() || completedOnDueDate) return;
  const key = `${habitId}-${dateKey(due)}-deadline`;
  if (notifiedKeys.has(key)) return;
  try {
    new Notification(`Deadline: ${habitTitle}`, {
      body: `"${habitTitle}" was due and is now overdue.`,
      icon: '/icon.svg',
    });
    notifiedKeys.add(key);
  } catch {
    // ignore
  }
}

function checkAndNotify(): void {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;

  const data = StorageManager.getData();
  const now = new Date();

  for (const habit of data.habits) {
    if (habit.reminderAt) {
      const rem = new Date(habit.reminderAt);
      if (dateKey(rem) === dateKey(now)) {
        const completedToday = completionOnDate(habit, now);
        if (!completedToday) maybeNotifyReminder(habit.id, habit.title, rem, now);
      }
    }

    const effectiveDue = habit.dueDate ?? (habit.recurrence === 'custom' ? habit.customDueDateTime : null);
    if (effectiveDue) {
      const due = new Date(effectiveDue);
      const completedOnDue = completionOnDate(habit, due);
      maybeNotifyDeadline(habit.id, habit.title, due, now, completedOnDue);
    }
  }
}

/**
 * Request notification permission. Persists that we asked so callers can avoid re-prompting.
 * Returns current permission state.
 */
export function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return Promise.resolve('denied');
  }
  if (Notification.permission === 'granted') return Promise.resolve('granted');
  if (Notification.permission === 'denied') return Promise.resolve('denied');

  try {
    localStorage.setItem(NOTIFICATION_PERMISSION_KEY, 'true');
  } catch {
    // ignore
  }
  return Notification.requestPermission();
}

export function hasAskedNotificationPermission(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(NOTIFICATION_PERMISSION_KEY) === 'true';
}

/**
 * Start the notification scheduler (runs every CHECK_INTERVAL_MS).
 * Returns a stop function to clear the interval.
 */
export function startNotificationScheduler(): () => void {
  checkAndNotify();
  const id = setInterval(checkAndNotify, CHECK_INTERVAL_MS);
  return () => clearInterval(id);
}
