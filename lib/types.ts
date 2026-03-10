export type Recurrence = 'daily' | 'weekly' | 'custom';

export interface Habit {
  id: string;
  title: string;
  description: string;
  recurrence: Recurrence;
  xpReward: number;
  color: string;
  icon: string;
  createdAt: Date;
  completions: HabitCompletion[];
  isStarred?: boolean;
  reminderAt?: Date | null;
  dueDate?: Date | null;
  customDueDateTime?: Date | null;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  completedAt: Date;
  notes: string;
  xpEarned: number;
  proofImageUrl?: string;
}

export interface UserStats {
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  habitCount: number;
  league: League;
  lastCompletionDate: Date | null;
}

export type League = 'bronze' | 'silver' | 'gold' | 'diamond';

export interface LeagueInfo {
  name: League;
  minXP: number;
  icon: string;
  color: string;
}

export interface WakeSleepRecord {
  date: string;
  wakeTime: Date | null;
  sleepTime: Date | null;
}

export interface AppData {
  habits: Habit[];
  stats: UserStats;
  lastUpdated: Date;
  wakeSleepLog: WakeSleepRecord[];
}
