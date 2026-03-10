'use client';

import { useEffect, useState } from 'react';
import { Habit, AppData, HabitCompletion } from '@/lib/types';
import { StorageManager } from '@/lib/storage';
import { TaskCard } from '@/components/TaskCard';
import { QuestNode } from '@/components/QuestNode';
import { LeagueCard } from '@/components/LeagueCard';
import { HabitForm } from '@/components/HabitForm';
import { HabitCalendar } from '@/components/HabitCalendar';
import { v4 as uuidv4 } from 'uuid';
import { AchievementToast, Achievement } from '@/components/AchievementToast';
import { checkAchievements } from '@/lib/achievements';

type View = 'dashboard' | 'quest' | 'calendar' | 'stats' | 'manage';

export default function Home() {
  const [appData, setAppData] = useState<AppData | null>(null);
  const [view, setView] = useState<View>('dashboard');
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    // Load data on mount
    const data = StorageManager.getData();
    setAppData(data);
    setIsLoading(false);
  }, []);

  if (isLoading || !appData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-5xl mb-4">⭐</div>
          <h1 className="text-2xl font-bold">LockIn Pro</h1>
          <p className="text-foreground/60 mt-2">Loading your adventure...</p>
        </div>
      </div>
    );
  }

  const getTodayCompletion = (habit: Habit) => {
    return StorageManager.getHabitCompletion(habit.id);
  };

  const handleCompleteHabit = (habitId: string, notes: string) => {
    const habit = appData.habits.find(h => h.id === habitId);
    if (!habit) return;

    const previousStats = { ...appData.stats };

    const completion: HabitCompletion = {
      id: uuidv4(),
      habitId,
      completedAt: new Date(),
      notes,
      xpEarned: habit.xpReward,
    };

    StorageManager.addCompletion(habitId, completion);
    const updatedData = StorageManager.getData();
    setAppData(updatedData);

    // Check for achievements
    const achievements = checkAchievements(previousStats, updatedData.stats);
    if (achievements.length > 0) {
      setCurrentAchievement(achievements[0]);
    }
  };

  const handleAddHabit = (habit: Habit) => {
    StorageManager.addHabit(habit);
    const updatedData = StorageManager.getData();
    setAppData(updatedData);
    setShowAddHabit(false);
  };

  const handleDeleteHabit = (habitId: string) => {
    StorageManager.deleteHabit(habitId);
    const updatedData = StorageManager.getData();
    setAppData(updatedData);
    setSelectedHabit(null);
  };

  const handleUpdateHabit = (habit: Habit) => {
    StorageManager.updateHabit(habit.id, habit);
    const updatedData = StorageManager.getData();
    setAppData(updatedData);
    setShowAddHabit(false);
  };

  // Dashboard View
  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-background pb-24">
        <AchievementToast 
          achievement={currentAchievement}
          onComplete={() => setCurrentAchievement(null)}
        />
        {/* Header */}
        <div className="sticky top-0 z-40 bg-gradient-to-b from-background to-background/80 backdrop-blur-sm p-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-black text-foreground">LockIn Pro</h1>
            <p className="text-sm text-foreground/60 mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          {/* League Card */}
          <LeagueCard stats={appData.stats} />

          {/* Tasks */}
          {appData.habits.length === 0 ? (
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-8 text-center border-2 border-dashed border-primary/30">
              <div className="text-6xl mb-4 animate-bounce">🚀</div>
              <h2 className="text-2xl font-bold mb-2">Welcome to LockIn Pro</h2>
              <p className="text-foreground/60 mb-6 max-w-sm mx-auto">
                Your personal habit tracking adventure awaits. Create your first habit to begin earning XP and climbing the leagues!
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setShowAddHabit(true)}
                  className="px-6 py-3 rounded-full bg-secondary text-white font-bold hover:bg-secondary/90 transition-colors w-full sm:w-auto"
                >
                  Create First Habit
                </button>
                <p className="text-xs text-foreground/50">Tip: Higher XP values are great for challenging habits!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {appData.habits.map(habit => (
                <TaskCard
                  key={habit.id}
                  habit={habit}
                  todayCompletion={getTodayCompletion(habit)}
                  onComplete={handleCompleteHabit}
                  onShowDetails={() => {
                    setSelectedHabit(habit);
                    setView('calendar');
                  }}
                />
              ))}
            </div>
          )}

          {appData.habits.length > 0 && (
            <button
              onClick={() => setShowAddHabit(true)}
              className="w-full py-4 rounded-3xl border-2 border-dashed border-primary font-bold text-foreground hover:bg-primary/5 transition-colors"
            >
              + Add New Habit
            </button>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg">
          <div className="max-w-2xl mx-auto flex gap-1 p-2">
            {[
              { id: 'dashboard', label: 'Daily', icon: '📋' },
              { id: 'quest', label: 'Quest', icon: '🗺️' },
              { id: 'calendar', label: 'Calendar', icon: '📅' },
              { id: 'stats', label: 'Stats', icon: '📊' },
              { id: 'manage', label: 'Manage', icon: '⚙️' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id as View)}
                className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                  view === tab.id
                    ? 'bg-primary text-foreground'
                    : 'text-foreground/60 hover:bg-muted'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Add Habit Modal */}
        {showAddHabit && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
            <div className="bg-background rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">New Habit</h2>
                <button
                  onClick={() => setShowAddHabit(false)}
                  className="p-2 hover:bg-muted rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <HabitForm
                  onSubmit={handleAddHabit}
                  onCancel={() => setShowAddHabit(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Quest Path View
  if (view === 'quest') {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="sticky top-0 z-40 bg-gradient-to-b from-background to-background/80 backdrop-blur-sm p-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-black text-foreground">Quest Path</h1>
            <p className="text-sm text-foreground/60 mt-1">Complete your daily habits</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8">
          {appData.habits.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-foreground/60">No habits yet. Create some habits to get started!</p>
              <button
                onClick={() => {
                  setShowAddHabit(true);
                }}
                className="mt-4 px-6 py-2 rounded-full bg-secondary text-white font-bold"
              >
                Add Habit
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {appData.habits.map((habit, index) => (
                <QuestNode
                  key={habit.id}
                  habit={habit}
                  todayCompletion={getTodayCompletion(habit)}
                  onSelect={() => {
                    setSelectedHabit(habit);
                    setView('dashboard');
                  }}
                  isCompleted={!!getTodayCompletion(habit)}
                  nodeIndex={index}
                />
              ))}
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg">
          <div className="max-w-2xl mx-auto flex gap-1 p-2">
            {[
              { id: 'dashboard', label: 'Daily', icon: '📋' },
              { id: 'quest', label: 'Quest', icon: '🗺️' },
              { id: 'calendar', label: 'Calendar', icon: '📅' },
              { id: 'stats', label: 'Stats', icon: '📊' },
              { id: 'manage', label: 'Manage', icon: '⚙️' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id as View)}
                className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                  view === tab.id
                    ? 'bg-primary text-foreground'
                    : 'text-foreground/60 hover:bg-muted'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Calendar View
  if (view === 'calendar') {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="sticky top-0 z-40 bg-gradient-to-b from-background to-background/80 backdrop-blur-sm p-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <h1 className="text-3xl font-black text-foreground">Progress</h1>
            {selectedHabit && (
              <button
                onClick={() => setSelectedHabit(null)}
                className="p-2 hover:bg-muted rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6">
          {selectedHabit ? (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-primary/20">
                <h2 className="text-2xl font-bold">{selectedHabit.title}</h2>
                {selectedHabit.description && (
                  <p className="text-foreground/60 mt-2">{selectedHabit.description}</p>
                )}
              </div>
              <HabitCalendar habit={selectedHabit} />
            </div>
          ) : (
            <div className="space-y-4">
              {appData.habits.length === 0 ? (
                <p className="text-center text-foreground/60 py-12">No habits to view</p>
              ) : (
                appData.habits.map(habit => (
                  <button
                    key={habit.id}
                    onClick={() => setSelectedHabit(habit)}
                    className="w-full text-left bg-white rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow border-2 border-primary/20 hover:border-primary/50"
                  >
                    <h3 className="font-bold text-lg">{habit.title}</h3>
                    <p className="text-sm text-foreground/60">
                      {habit.completions.length} completions
                    </p>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg">
          <div className="max-w-2xl mx-auto flex gap-1 p-2">
            {[
              { id: 'dashboard', label: 'Daily', icon: '📋' },
              { id: 'quest', label: 'Quest', icon: '🗺️' },
              { id: 'calendar', label: 'Calendar', icon: '📅' },
              { id: 'stats', label: 'Stats', icon: '📊' },
              { id: 'manage', label: 'Manage', icon: '⚙️' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id as View)}
                className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                  view === tab.id
                    ? 'bg-primary text-foreground'
                    : 'text-foreground/60 hover:bg-muted'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Stats View
  if (view === 'stats') {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="sticky top-0 z-40 bg-gradient-to-b from-background to-background/80 backdrop-blur-sm p-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-black text-foreground">Statistics</h1>
            <p className="text-sm text-foreground/60 mt-1">Your achievement stats</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          <LeagueCard stats={appData.stats} />

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-primary/20 text-center">
              <p className="text-4xl font-black text-primary">{appData.stats.totalXP}</p>
              <p className="text-sm text-foreground/60 mt-2">Total XP</p>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-secondary/20 text-center">
              <p className="text-4xl font-black text-secondary">{appData.stats.currentStreak}</p>
              <p className="text-sm text-foreground/60 mt-2">Current Streak</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border-2 border-border">
            <h3 className="font-bold text-lg mb-4">Habit Performance</h3>
            <div className="space-y-3">
              {appData.habits.map(habit => {
                const completed = habit.completions.length;
                const daysSinceCreated = Math.floor(
                  (Date.now() - habit.createdAt.getTime()) / (1000 * 60 * 60 * 24)
                ) + 1;
                const completion = Math.round((completed / daysSinceCreated) * 100);
                
                return (
                  <div key={habit.id}>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold">{habit.title}</span>
                      <span className="text-sm text-foreground/60">{completion}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-secondary transition-all"
                        style={{ width: `${completion}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg">
          <div className="max-w-2xl mx-auto flex gap-1 p-2">
            {[
              { id: 'dashboard', label: 'Daily', icon: '📋' },
              { id: 'quest', label: 'Quest', icon: '🗺️' },
              { id: 'calendar', label: 'Calendar', icon: '📅' },
              { id: 'stats', label: 'Stats', icon: '📊' },
              { id: 'manage', label: 'Manage', icon: '⚙️' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id as View)}
                className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                  view === tab.id
                    ? 'bg-primary text-foreground'
                    : 'text-foreground/60 hover:bg-muted'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Manage Habits View
  if (view === 'manage') {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="sticky top-0 z-40 bg-gradient-to-b from-background to-background/80 backdrop-blur-sm p-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-black text-foreground">Manage Habits</h1>
            <p className="text-sm text-foreground/60 mt-1">Edit or remove habits</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          {appData.habits.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-foreground/60">No habits yet</p>
              <button
                onClick={() => setShowAddHabit(true)}
                className="mt-4 px-6 py-2 rounded-full bg-secondary text-white font-bold"
              >
                Add Habit
              </button>
            </div>
          ) : (
            appData.habits.map(habit => (
              <div key={habit.id} className="bg-white rounded-3xl p-4 shadow-sm border-2 border-primary/20">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{habit.title}</h3>
                    {habit.description && (
                      <p className="text-sm text-foreground/60">{habit.description}</p>
                    )}
                  </div>
                  <span className="text-2xl">+{habit.xpReward} XP</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedHabit(habit);
                      setShowAddHabit(true);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-primary text-foreground font-semibold text-sm hover:bg-primary/90"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this habit? All completions will be removed.')) {
                        handleDeleteHabit(habit.id);
                      }
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-destructive/20 text-destructive font-semibold text-sm hover:bg-destructive/30"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Edit Habit Modal */}
        {showAddHabit && selectedHabit && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
            <div className="bg-background rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">Edit Habit</h2>
                <button
                  onClick={() => {
                    setShowAddHabit(false);
                    setSelectedHabit(null);
                  }}
                  className="p-2 hover:bg-muted rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <HabitForm
                  initialHabit={selectedHabit}
                  onSubmit={handleUpdateHabit}
                  onCancel={() => {
                    setShowAddHabit(false);
                    setSelectedHabit(null);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg">
          <div className="max-w-2xl mx-auto flex gap-1 p-2">
            {[
              { id: 'dashboard', label: 'Daily', icon: '📋' },
              { id: 'quest', label: 'Quest', icon: '🗺️' },
              { id: 'calendar', label: 'Calendar', icon: '📅' },
              { id: 'stats', label: 'Stats', icon: '📊' },
              { id: 'manage', label: 'Manage', icon: '⚙️' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id as View)}
                className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                  view === tab.id
                    ? 'bg-primary text-foreground'
                    : 'text-foreground/60 hover:bg-muted'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
