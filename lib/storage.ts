import { AppData, Habit, HabitCompletion, UserStats, League, WakeSleepRecord } from './types';

const STORAGE_KEY = 'lockin-pro-data';
const LEGACY_STORAGE_KEY = 'quest-tracker-data';

const DEFAULT_STATS: UserStats = {
  totalXP: 0,
  currentStreak: 0,
  longestStreak: 0,
  habitCount: 0,
  league: 'bronze',
  lastCompletionDate: null,
};

const DEFAULT_DATA: AppData = {
  habits: [],
  stats: DEFAULT_STATS,
  lastUpdated: new Date(),
  wakeSleepLog: [],
};

export class StorageManager {
  static getData(): AppData {
    if (typeof window === 'undefined') return DEFAULT_DATA;
    try {
      let data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
        if (legacy) {
          localStorage.setItem(STORAGE_KEY, legacy);
          localStorage.removeItem(LEGACY_STORAGE_KEY);
          data = legacy;
        }
      }
      if (!data) return DEFAULT_DATA;
      
      const parsed = JSON.parse(data);
      const wakeSleepLog: WakeSleepRecord[] = (parsed.wakeSleepLog ?? []).map((r: any) => ({
        date: r.date,
        wakeTime: r.wakeTime ? new Date(r.wakeTime) : null,
        sleepTime: r.sleepTime ? new Date(r.sleepTime) : null,
      }));
      return {
        ...parsed,
        habits: parsed.habits.map((h: any) => ({
          ...h,
          createdAt: new Date(h.createdAt),
          reminderAt: h.reminderAt ? new Date(h.reminderAt) : null,
          dueDate: h.dueDate ? new Date(h.dueDate) : null,
          customDueDateTime: h.customDueDateTime ? new Date(h.customDueDateTime) : null,
          completions: (h.completions ?? []).map((c: any) => ({
            ...c,
            completedAt: new Date(c.completedAt),
          })),
        })),
        stats: {
          ...parsed.stats,
          lastCompletionDate: parsed.stats.lastCompletionDate ? new Date(parsed.stats.lastCompletionDate) : null,
        },
        lastUpdated: new Date(parsed.lastUpdated),
        wakeSleepLog,
      };
    } catch {
      return DEFAULT_DATA;
    }
  }

  static saveData(data: AppData): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  static addHabit(habit: Habit): void {
    const data = this.getData();
    data.habits.push(habit);
    data.stats.habitCount = data.habits.length;
    data.lastUpdated = new Date();
    this.saveData(data);
  }

  static updateHabit(habitId: string, updates: Partial<Habit>): void {
    const data = this.getData();
    const habit = data.habits.find(h => h.id === habitId);
    if (habit) {
      Object.assign(habit, updates);
      data.lastUpdated = new Date();
      this.saveData(data);
    }
  }

  static deleteHabit(habitId: string): void {
    const data = this.getData();
    data.habits = data.habits.filter(h => h.id !== habitId);
    data.stats.habitCount = data.habits.length;
    data.lastUpdated = new Date();
    this.saveData(data);
  }

  static resetAllProgress(): void {
    if (typeof window === 'undefined') return;
    const data = this.getData();
    data.habits.forEach((h) => {
      h.completions = [];
    });
    data.stats = { ...DEFAULT_STATS, habitCount: data.habits.length };
    data.wakeSleepLog = [];
    data.lastUpdated = new Date();
    this.saveData(data);
  }

  static deleteAllHabits(): void {
    if (typeof window === 'undefined') return;
    const data = this.getData();
    data.habits = [];
    data.stats = { ...DEFAULT_STATS, habitCount: 0 };
    data.lastUpdated = new Date();
    this.saveData(data);
  }

  static addCompletion(habitId: string, completion: HabitCompletion): void {
    const data = this.getData();
    const habit = data.habits.find(h => h.id === habitId);
    if (habit) {
      habit.completions.push(completion);
      data.stats.totalXP += completion.xpEarned;
      data.stats.lastCompletionDate = completion.completedAt;
      
      // Update league based on XP
      data.stats.league = this.calculateLeague(data.stats.totalXP);
      
      // Update streak
      this.updateStreak(data);
      
      data.lastUpdated = new Date();
      this.saveData(data);
    }
  }

  static toDateKey(date: Date): string {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
  }

  static getWakeSleepForDate(date: Date): WakeSleepRecord {
    const data = this.getData();
    const key = this.toDateKey(date);
    const existing = data.wakeSleepLog.find((r) => r.date === key);
    if (existing) return existing;
    return { date: key, wakeTime: null, sleepTime: null };
  }

  static setWakeTime(date: Date, time: Date): void {
    const data = this.getData();
    const key = this.toDateKey(date);
    let record = data.wakeSleepLog.find((r) => r.date === key);
    if (!record) {
      record = { date: key, wakeTime: null, sleepTime: null };
      data.wakeSleepLog.push(record);
    }
    record.wakeTime = time;
    data.lastUpdated = new Date();
    this.saveData(data);
  }

  static setSleepTime(date: Date, time: Date): void {
    const data = this.getData();
    const key = this.toDateKey(date);
    let record = data.wakeSleepLog.find((r) => r.date === key);
    if (!record) {
      record = { date: key, wakeTime: null, sleepTime: null };
      data.wakeSleepLog.push(record);
    }
    record.sleepTime = time;
    data.lastUpdated = new Date();
    this.saveData(data);
  }

  static getHabitCompletion(habitId: string): HabitCompletion | null {
    const data = this.getData();
    const habit = data.habits.find(h => h.id === habitId);
    if (!habit) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return habit.completions.find(c => {
      const completedDate = new Date(c.completedAt);
      completedDate.setHours(0, 0, 0, 0);
      return completedDate.getTime() === today.getTime();
    }) || null;
  }

  private static calculateLeague(totalXP: number): League {
    if (totalXP >= 1000) return 'diamond';
    if (totalXP >= 500) return 'gold';
    if (totalXP >= 200) return 'silver';
    return 'bronze';
  }

  private static updateStreak(data: AppData): void {
    let maxStreak = 0;
    let currentStreak = 0;
    let lastDate: Date | null = null;

    data.habits.forEach(habit => {
      const sortedCompletions = [...habit.completions].sort(
        (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      );

      sortedCompletions.forEach(completion => {
        const completedDate = new Date(completion.completedAt);
        completedDate.setHours(0, 0, 0, 0);

        if (lastDate === null) {
          lastDate = completedDate;
          currentStreak = 1;
        } else {
          const daysDiff = (lastDate.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24);
          if (Math.abs(daysDiff - 1) < 0.1) {
            currentStreak++;
          } else if (daysDiff > 1) {
            maxStreak = Math.max(maxStreak, currentStreak);
            currentStreak = 1;
          }
          lastDate = completedDate;
        }
      });
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (data.stats.lastCompletionDate) {
      const lastCompDate = new Date(data.stats.lastCompletionDate);
      lastCompDate.setHours(0, 0, 0, 0);
      const daysDiff = (today.getTime() - lastCompDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysDiff > 1) {
        currentStreak = 0;
      }
    }

    maxStreak = Math.max(maxStreak, currentStreak);
    data.stats.currentStreak = currentStreak;
    data.stats.longestStreak = maxStreak;
  }
}
