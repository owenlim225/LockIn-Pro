import { AppData, Habit, HabitCompletion, UserStats, League } from './types';

const STORAGE_KEY = 'quest-tracker-data';

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
};

export class StorageManager {
  static getData(): AppData {
    if (typeof window === 'undefined') return DEFAULT_DATA;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return DEFAULT_DATA;
      
      const parsed = JSON.parse(data);
      return {
        ...parsed,
        habits: parsed.habits.map((h: any) => ({
          ...h,
          createdAt: new Date(h.createdAt),
          completions: h.completions.map((c: any) => ({
            ...c,
            completedAt: new Date(c.completedAt),
          })),
        })),
        stats: {
          ...parsed.stats,
          lastCompletionDate: parsed.stats.lastCompletionDate ? new Date(parsed.stats.lastCompletionDate) : null,
        },
        lastUpdated: new Date(parsed.lastUpdated),
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
