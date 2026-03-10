import { UserStats } from './types';
import { Achievement } from '@/components/AchievementToast';

export function checkAchievements(
  previousStats: UserStats,
  currentStats: UserStats
): Achievement[] {
  const achievements: Achievement[] = [];

  // First completion of the day
  if (previousStats.lastCompletionDate === null && currentStats.lastCompletionDate !== null) {
    achievements.push({
      id: 'first-completion',
      title: 'First Step',
      description: 'Completed your first habit today',
      icon: '👣',
      xpBonus: 10,
    });
  }

  // Current streak milestones
  const streakMilestones = [1, 3, 7, 14, 30, 60, 100];
  streakMilestones.forEach(milestone => {
    if (previousStats.currentStreak < milestone && currentStats.currentStreak >= milestone) {
      achievements.push({
        id: `streak-${milestone}`,
        title: `${milestone}-Day Streak`,
        description: `Maintained a ${milestone}-day completion streak`,
        icon: '🔥',
        xpBonus: 50 * Math.min(milestone / 7, 3),
      });
    }
  });

  // Total XP milestones
  const xpMilestones = [50, 100, 250, 500, 1000];
  xpMilestones.forEach(milestone => {
    if (previousStats.totalXP < milestone && currentStats.totalXP >= milestone) {
      achievements.push({
        id: `xp-${milestone}`,
        title: `${milestone} XP Collected`,
        description: `Earned ${milestone} total XP`,
        icon: '⭐',
        xpBonus: 25,
      });
    }
  });

  // League promotions
  const leagueIcons: Record<string, string> = {
    bronze: '🥉',
    silver: '🥈',
    gold: '🥇',
    diamond: '💎',
  };

  const leagueNames: Record<string, string> = {
    bronze: 'Bronze',
    silver: 'Silver',
    gold: 'Gold',
    diamond: 'Diamond',
  };

  const leagueOrder = ['bronze', 'silver', 'gold', 'diamond'];
  const prevIndex = leagueOrder.indexOf(previousStats.league);
  const currIndex = leagueOrder.indexOf(currentStats.league);

  if (currIndex > prevIndex) {
    const league = currentStats.league;
    achievements.push({
      id: `league-${league}`,
      title: `Promoted to ${leagueNames[league]}`,
      description: `You've reached ${leagueNames[league]} League`,
      icon: leagueIcons[league],
      xpBonus: 100,
    });
  }

  // All habits completed in a day
  if (previousStats.habitCount > 0 && previousStats.habitCount === currentStats.habitCount) {
    // This would need habit completion data to verify, so we'll skip for now
  }

  return achievements;
}
