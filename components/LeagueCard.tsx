'use client';

import { UserStats, League } from '@/lib/types';
import { StreakCounter } from './StreakCounter';

interface LeagueCardProps {
  stats: UserStats;
}

export function LeagueCard({ stats }: LeagueCardProps) {
  const leagueIcons: Record<League, string> = {
    bronze: '🥉',
    silver: '🥈',
    gold: '🥇',
    diamond: '💎',
  };

  const leagueNames: Record<League, string> = {
    bronze: 'Bronze',
    silver: 'Silver',
    gold: 'Gold',
    diamond: 'Diamond',
  };

  const leagueXP: Record<League, { min: number; max: number }> = {
    bronze: { min: 0, max: 199 },
    silver: { min: 200, max: 499 },
    gold: { min: 500, max: 999 },
    diamond: { min: 1000, max: Infinity },
  };

  const currentRange = leagueXP[stats.league];
  const nextLeague = stats.league === 'diamond' ? null : 
    (stats.league === 'bronze' ? 'silver' : 
     stats.league === 'silver' ? 'gold' : 'diamond');
  
  const nextRange = nextLeague ? leagueXP[nextLeague] : null;
  
  const progressPercent = nextRange
    ? ((stats.totalXP - currentRange.min) / (nextRange.min - currentRange.min)) * 100
    : 100;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-primary/20">
      <div className="text-center mb-6">
        <div className="text-6xl mb-3">{leagueIcons[stats.league]}</div>
        <h2 className="text-2xl font-bold text-foreground">
          {leagueNames[stats.league]} League
        </h2>
        <p className="text-sm text-foreground/60 mt-1">
          {stats.totalXP.toLocaleString()} / {nextRange ? nextRange.min.toLocaleString() : '∞'} XP
        </p>
      </div>

      {/* Streak Counter */}
      <div className="mb-6 flex justify-center">
        <StreakCounter 
          currentStreak={stats.currentStreak} 
          longestStreak={stats.longestStreak}
        />
      </div>

      {/* Progress bar */}
      {nextLeague && (
        <div className="mb-6">
          <div className="w-full h-4 bg-muted rounded-full overflow-hidden border-2 border-primary/30">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
          <p className="text-xs text-foreground/60 mt-2 text-center">
            {(nextRange.min - stats.totalXP).toLocaleString()} XP to {leagueNames[nextLeague]}
          </p>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-primary/10 rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold text-primary">{stats.totalXP.toLocaleString()}</p>
          <p className="text-xs text-foreground/60 mt-1">Total XP</p>
        </div>
        <div className="bg-accent/10 rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold text-accent">{stats.habitCount}</p>
          <p className="text-xs text-foreground/60 mt-1">Habits</p>
        </div>
      </div>
    </div>
  );
}
