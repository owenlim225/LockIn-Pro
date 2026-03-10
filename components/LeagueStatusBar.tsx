'use client';

import { UserStats, League } from '@/lib/types';

interface LeagueStatusBarProps {
  stats: UserStats;
}

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

export function LeagueStatusBar({ stats }: LeagueStatusBarProps) {
  const currentRange = leagueXP[stats.league];
  const nextLeague = stats.league === 'diamond' ? null :
    (stats.league === 'bronze' ? 'silver' :
     stats.league === 'silver' ? 'gold' : 'diamond');
  const nextRange = nextLeague ? leagueXP[nextLeague] : null;
  const progressPercent = nextRange
    ? ((stats.totalXP - currentRange.min) / (nextRange.min - currentRange.min)) * 100
    : 100;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-xl" aria-hidden>{leagueIcons[stats.league]}</span>
        <span className="font-bold text-foreground text-sm whitespace-nowrap">
          {leagueNames[stats.league]}
        </span>
        <span className="text-xs text-foreground/60 whitespace-nowrap">
          {stats.totalXP.toLocaleString()}/{nextRange ? nextRange.min.toLocaleString() : '∞'} XP
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-accent font-bold text-sm" aria-label="Current streak">
          {stats.currentStreak} 🔥
        </span>
        {nextLeague && (
          <div className="hidden sm:block flex-1 min-w-[60px] max-w-[100px]">
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
