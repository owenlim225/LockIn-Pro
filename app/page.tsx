'use client';

import { useEffect, useState } from 'react';
import { Habit, AppData, HabitCompletion } from '@/lib/types';
import { StorageManager } from '@/lib/storage';
import { TaskCard } from '@/components/TaskCard';
import { QuestNode } from '@/components/QuestNode';
import { LeagueCard } from '@/components/LeagueCard';
import { LeagueStatusBar } from '@/components/LeagueStatusBar';
import { HabitForm } from '@/components/HabitForm';
import { HabitCalendar } from '@/components/HabitCalendar';
import { v4 as uuidv4 } from 'uuid';
import { AchievementToast, Achievement } from '@/components/AchievementToast';
import { checkAchievements } from '@/lib/achievements';
import { exportToCsv, downloadCsv, getExportFilename } from '@/lib/export';
import { isOverdue as isHabitOverdue, showReminderClock } from '@/lib/utils';
import {
  requestNotificationPermission,
  hasAskedNotificationPermission,
  startNotificationScheduler,
} from '@/lib/notificationScheduler';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableTaskCard } from '@/components/SortableTaskCard';

type View = 'dashboard' | 'quest' | 'calendar' | 'stats' | 'manage';

export default function Home() {
  const [appData, setAppData] = useState<AppData | null>(null);
  const [view, setView] = useState<View>('dashboard');
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [showSleepModal, setShowSleepModal] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [filterHideAccomplished, setFilterHideAccomplished] = useState(false);
  const [filterPriorityOrder, setFilterPriorityOrder] = useState(false);
  const [filterMissedOnly, setFilterMissedOnly] = useState(false);
  const [showBadHabitsOnly, setShowBadHabitsOnly] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    const data = StorageManager.getData();
    StorageManager.runBadHabitSettlement(data);
    setAppData(StorageManager.getData());
    setIsLoading(false);
  }, []);

  // Notification permission and scheduler when dashboard is active
  useEffect(() => {
    if (view !== 'dashboard' || !appData) return;

    const hasReminderOrDue = appData.habits.some(
      (h) => h.reminderAt || h.dueDate || (h.recurrence === 'custom' && h.customDueDateTime)
    );
    if (
      hasReminderOrDue &&
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'default' &&
      !hasAskedNotificationPermission()
    ) {
      requestNotificationPermission();
    }

    const stop = startNotificationScheduler();
    return stop;
  }, [view, appData]);

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

  const handleCompleteHabit = (habitId: string, notes: string, proofImageUrl?: string) => {
    const habit = appData.habits.find(h => h.id === habitId);
    if (!habit) return;

    const previousStats = { ...appData.stats };

    const completion: HabitCompletion = {
      id: uuidv4(),
      habitId,
      completedAt: new Date(),
      notes,
      xpEarned: habit.xpReward,
      ...(proofImageUrl && { proofImageUrl }),
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

  const handleToggleStar = (habitId: string) => {
    const habit = appData.habits.find(h => h.id === habitId);
    if (!habit) return;
    StorageManager.updateHabit(habitId, { isStarred: !habit.isStarred });
    setAppData(StorageManager.getData());
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
      <div className={`min-h-screen pb-[calc(6rem+env(safe-area-inset-bottom,0px))] ${showBadHabitsOnly ? 'bg-neutral-900 text-neutral-100' : 'bg-background'}`}>
        <AchievementToast 
          achievement={currentAchievement}
          onComplete={() => setCurrentAchievement(null)}
        />
        {/* Header: title + compact status bar */}
        <div className="sticky top-0 z-40 bg-gradient-to-b from-background to-background/80 backdrop-blur-sm p-4">
          <div className="max-w-2xl mx-auto min-w-0 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-3xl font-black text-foreground">LockIn Pro</h1>
              <p className="text-sm text-foreground/60 mt-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
            </div>
            <LeagueStatusBar stats={appData.stats} />
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          {/* Wake UP / Sleep buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const now = new Date();
                StorageManager.setWakeTime(now, now);
                setAppData(StorageManager.getData());
                setFeedbackMessage('Wake time recorded');
                setTimeout(() => setFeedbackMessage(null), 3000);
              }}
              className="py-4 px-4 rounded-3xl border-2 border-primary/30 h-auto flex flex-col items-center gap-1 font-bold transition-all active:scale-[0.98]"
            >
              <span className="text-2xl">☀️</span>
              Wake UP
              {(() => {
                const rec = StorageManager.getWakeSleepForDate(new Date());
                if (rec.wakeTime) {
                  return (
                    <span className="text-xs font-normal text-muted-foreground">
                      {new Date(rec.wakeTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </span>
                  );
                }
                return null;
              })()}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const now = new Date();
                StorageManager.setSleepTime(now, now);
                setAppData(StorageManager.getData());
                setShowSleepModal(true);
              }}
              className="py-4 px-4 rounded-3xl border-2 border-primary/30 h-auto flex flex-col items-center gap-1 font-bold transition-all active:scale-[0.98]"
            >
              <span className="text-2xl">🌙</span>
              Sleep
              {(() => {
                const rec = StorageManager.getWakeSleepForDate(new Date());
                if (rec.sleepTime) {
                  return (
                    <span className="text-xs font-normal text-muted-foreground">
                      {new Date(rec.sleepTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </span>
                  );
                }
                return null;
              })()}
            </Button>
          </div>
          {feedbackMessage && (
            <p className="text-sm text-secondary font-medium text-center animate-in fade-in" role="status">
              {feedbackMessage}
            </p>
          )}

          {/* Bad habit toggle + Filter */}
          {appData.habits.length > 0 && (
            <div className="flex items-center justify-between gap-2">
              <Button
                type="button"
                variant={showBadHabitsOnly ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowBadHabitsOnly((v) => !v)}
                className="rounded-xl border-2 border-primary/20 font-semibold transition-all active:scale-[0.98]"
                aria-pressed={showBadHabitsOnly}
                aria-label={showBadHabitsOnly ? 'Show good habits' : 'Show bad habits'}
              >
                Bad habits
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    aria-label="Dashboard filters"
                    className="relative p-2.5 rounded-xl border-2 border-primary/20 bg-white shadow-sm text-foreground hover:bg-primary/5 transition-colors flex items-center justify-center"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      aria-hidden
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3 7C3 6.44772 3.44772 6 4 6H20C20.5523 6 21 6.44772 21 7C21 7.55228 20.5523 8 20 8H4C3.44772 8 3 7.55228 3 7ZM6 12C6 11.4477 6.44772 11 7 11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H7C6.44772 13 6 12.5523 6 12ZM9 17C9 16.4477 9.44772 16 10 16H14C14.5523 16 15 16.4477 15 17C15 17.5523 14.5523 18 14 18H10C9.44772 18 9 17.5523 9 17Z"
                        fill="currentColor"
                      />
                    </svg>
                    {(filterHideAccomplished || filterPriorityOrder || filterMissedOnly) && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary/20 text-[10px] font-medium text-foreground">
                        {[filterHideAccomplished, filterPriorityOrder, filterMissedOnly].filter(Boolean).length}
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-72 max-w-[calc(100vw-2rem)]" align="end">
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">Dashboard filters</h4>
                  <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="filter-hide-done" className="text-sm cursor-pointer flex-1">
                      Hide accomplished
                    </Label>
                    <Switch
                      id="filter-hide-done"
                      checked={filterHideAccomplished}
                      onCheckedChange={setFilterHideAccomplished}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="filter-priority" className="text-sm cursor-pointer flex-1">
                      Priority order (starred first)
                    </Label>
                    <Switch
                      id="filter-priority"
                      checked={filterPriorityOrder}
                      onCheckedChange={setFilterPriorityOrder}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <Label htmlFor="filter-missed" className="text-sm cursor-pointer flex-1">
                      Missed deadlines only
                    </Label>
                    <Switch
                      id="filter-missed"
                      checked={filterMissedOnly}
                      onCheckedChange={setFilterMissedOnly}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            </div>
          )}

          {/* Tasks */}
          {(showBadHabitsOnly ? appData.habits.filter((h) => h.isBadHabit) : appData.habits.filter((h) => !h.isBadHabit)).length === 0 ? (
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl p-8 text-center border-2 border-dashed border-primary/30">
              {showBadHabitsOnly ? (
                <>
                  <div className="text-6xl mb-4">🌙</div>
                  <h2 className="text-2xl font-bold mb-2">No bad habits yet</h2>
                  <p className="text-foreground/60 mb-6 max-w-sm mx-auto">
                    Add habits you want to avoid. Don&apos;t complete them by end of day to earn XP.
                  </p>
                  <Button
                    onClick={() => setShowAddHabit(true)}
                    variant="secondary"
                    className="px-6 py-3 rounded-full w-full sm:w-auto font-bold transition-all active:scale-[0.98]"
                  >
                    Add bad habit
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4 animate-bounce">🚀</div>
                  <h2 className="text-2xl font-bold mb-2">Welcome to LockIn Pro</h2>
                  <p className="text-foreground/60 mb-6 max-w-sm mx-auto">
                    Your personal habit tracking adventure awaits. Create your first habit to begin earning XP and climbing the leagues!
                  </p>
                  <Button
                    onClick={() => setShowAddHabit(true)}
                    variant="secondary"
                    className="px-6 py-3 rounded-full w-full sm:w-auto font-bold transition-all active:scale-[0.98]"
                  >
                    Create First Habit
                  </Button>
                  <p className="text-xs text-muted-foreground mt-3">Tip: Higher XP values are great for challenging habits!</p>
                </>
              )}
            </div>
          ) : (() => {
              let list = appData.habits.filter((h) => (showBadHabitsOnly ? h.isBadHabit : !h.isBadHabit));
              const order = appData.habitOrder?.length
                ? appData.habitOrder
                : appData.habits.map((h) => h.id);
              list.sort((a, b) => {
                const ia = order.indexOf(a.id);
                const ib = order.indexOf(b.id);
                if (ia === -1 && ib === -1) return 0;
                if (ia === -1) return 1;
                if (ib === -1) return -1;
                return ia - ib;
              });
              if (filterHideAccomplished) {
                list = list.filter((h) => !getTodayCompletion(h));
              }
              if (filterMissedOnly) {
                list = list.filter((h) =>
                  isHabitOverdue(h, { todayCompletion: getTodayCompletion(h) })
                );
              }
              if (!appData.habitOrder?.length) {
                if (filterPriorityOrder) {
                  list.sort((a, b) => (b.isStarred ? 1 : 0) - (a.isStarred ? 1 : 0));
                } else {
                  list.sort(
                    (a, b) =>
                      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                  );
                }
              }
              const visibleIds = list.map((h) => h.id);
              function handleDragEnd(event: DragEndEvent) {
                const { active, over } = event;
                if (!over || active.id === over.id || !appData) return;
                const oldIds = visibleIds;
                const oldIndex = oldIds.indexOf(active.id as string);
                const newIndex = oldIds.indexOf(over.id as string);
                if (oldIndex === -1 || newIndex === -1) return;
                const newOrder = arrayMove(oldIds, oldIndex, newIndex);
                const fullOrder = appData.habitOrder ?? appData.habits.map((h) => h.id);
                const rest = fullOrder.filter((id) => !oldIds.includes(id));
                const newFullOrder = [...newOrder, ...rest];
                const next = { ...appData, habitOrder: newFullOrder };
                setAppData(next);
                StorageManager.saveData(next);
              }
              return (
                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                  <SortableContext
                    items={visibleIds}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      {list.map((habit) => {
                        const todayCompletion = getTodayCompletion(habit);
                        return (
                          <SortableTaskCard
                            key={habit.id}
                            habit={habit}
                            todayCompletion={todayCompletion}
                            onComplete={handleCompleteHabit}
                            onShowDetails={() => {
                              setSelectedHabit(habit);
                              setView('calendar');
                            }}
                            onToggleStar={handleToggleStar}
                            onRequestComplete={() => {}}
                            isOverdue={isHabitOverdue(habit, { todayCompletion })}
                            showReminderClock={showReminderClock(habit, {
                              todayCompletion,
                            })}
                          />
                        );
                      })}
                    </div>
                  </SortableContext>
                </DndContext>
              );
            })()}

          {(showBadHabitsOnly ? appData.habits.some((h) => h.isBadHabit) : appData.habits.some((h) => !h.isBadHabit)) && (
            <Button
              variant="outline"
              onClick={() => setShowAddHabit(true)}
              className="w-full py-4 rounded-3xl border-2 border-dashed border-primary h-auto font-bold transition-all active:scale-[0.98]"
            >
              + Add {showBadHabitsOnly ? 'Bad' : 'New'} Habit
            </Button>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg pb-[env(safe-area-inset-bottom)]">
          <div className="max-w-2xl mx-auto flex gap-1 p-2">
            {[
              { id: 'dashboard', label: 'Daily', icon: '📋' },
              { id: 'quest', label: 'Quest', icon: '🗺️' },
              { id: 'calendar', label: 'Calendar', icon: '📅' },
              { id: 'stats', label: 'Stats', icon: '📊' },
              { id: 'manage', label: 'Manage', icon: '⚙️' },
            ].map(tab => (
              <Button
                key={tab.id}
                variant={view === tab.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView(tab.id as View)}
                className="flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl h-auto text-xs font-bold transition-all active:scale-95"
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Ready for bed modal (after Sleep) */}
        <Dialog open={showSleepModal} onOpenChange={setShowSleepModal}>
          <DialogContent className="sm:max-w-sm rounded-3xl border-2 border-primary/20">
            <DialogHeader>
              <DialogTitle className="sr-only">Sleep recorded</DialogTitle>
            </DialogHeader>
            <p className="text-center text-foreground font-medium">
              Sleep time recorded. You can now lock or power off your phone.
            </p>
            <Button
              onClick={() => setShowSleepModal(false)}
              className="w-full"
            >
              OK
            </Button>
          </DialogContent>
        </Dialog>

        {/* Add Habit Modal */}
        <Dialog open={showAddHabit && !selectedHabit} onOpenChange={(open) => !open && setShowAddHabit(false)}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border-2 border-primary/20">
            <DialogHeader>
              <DialogTitle className="sr-only">Add habit</DialogTitle>
            </DialogHeader>
            <HabitForm
              onSubmit={handleAddHabit}
              onCancel={() => setShowAddHabit(false)}
              defaultBadHabit={showBadHabitsOnly}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Quest Path View
  if (view === 'quest') {
    return (
      <div className="min-h-screen bg-background pb-[calc(6rem+env(safe-area-inset-bottom,0px))]">
        <div className="sticky top-0 z-40 bg-gradient-to-b from-background to-background/80 backdrop-blur-sm p-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-black text-foreground">Quest Path</h1>
            <p className="text-sm text-foreground/60 mt-1">Complete your daily habits</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8 animate-in fade-in duration-300">
          {appData.habits.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No habits yet. Create some habits to get started!</p>
              <Button
                variant="secondary"
                onClick={() => setShowAddHabit(true)}
                className="mt-4 rounded-full font-bold transition-all active:scale-[0.98]"
              >
                Add Habit
              </Button>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-300">
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

        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg pb-[env(safe-area-inset-bottom)]">
          <div className="max-w-2xl mx-auto flex gap-1 p-2">
            {[
              { id: 'dashboard', label: 'Daily', icon: '📋' },
              { id: 'quest', label: 'Quest', icon: '🗺️' },
              { id: 'calendar', label: 'Calendar', icon: '📅' },
              { id: 'stats', label: 'Stats', icon: '📊' },
              { id: 'manage', label: 'Manage', icon: '⚙️' },
            ].map(tab => (
              <Button
                key={tab.id}
                variant={view === tab.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView(tab.id as View)}
                className="flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl h-auto text-xs font-bold transition-all active:scale-95"
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Calendar View
  if (view === 'calendar') {
    return (
      <div className="min-h-screen bg-background pb-[calc(6rem+env(safe-area-inset-bottom,0px))]">
        <div className="sticky top-0 z-40 bg-gradient-to-b from-background to-background/80 backdrop-blur-sm p-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <h1 className="text-3xl font-black text-foreground">Progress</h1>
            {selectedHabit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedHabit(null)}
                className="rounded-lg"
                aria-label="Clear selection"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            )}
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6 animate-in fade-in duration-300">
          {selectedHabit ? (
            <div className="space-y-6">
              <div className="bg-card rounded-3xl p-6 shadow-sm border-2 border-primary/20 min-w-0">
                <h2 className="text-2xl font-bold break-words line-clamp-2">{selectedHabit.title}</h2>
                {selectedHabit.description && (
                  <p className="text-muted-foreground mt-2 break-words line-clamp-3 min-w-0">{selectedHabit.description}</p>
                )}
              </div>
              <HabitCalendar habit={selectedHabit} />
            </div>
          ) : (
            <div className="space-y-4">
              {appData.habits.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">No habits to view</p>
              ) : (
                appData.habits.map(habit => (
                  <Button
                    key={habit.id}
                    variant="outline"
                    onClick={() => setSelectedHabit(habit)}
                    className="w-full justify-start h-auto py-4 rounded-3xl border-2 border-primary/20 hover:border-primary/50 transition-all active:scale-[0.98]"
                  >
                    <div className="text-left w-full min-w-0">
                      <h3 className="font-bold text-lg break-words line-clamp-2">{habit.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {habit.completions.length} completions
                      </p>
                    </div>
                  </Button>
                ))
              )}
            </div>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg pb-[env(safe-area-inset-bottom)]">
          <div className="max-w-2xl mx-auto flex gap-1 p-2">
            {[
              { id: 'dashboard', label: 'Daily', icon: '📋' },
              { id: 'quest', label: 'Quest', icon: '🗺️' },
              { id: 'calendar', label: 'Calendar', icon: '📅' },
              { id: 'stats', label: 'Stats', icon: '📊' },
              { id: 'manage', label: 'Manage', icon: '⚙️' },
            ].map(tab => (
              <Button
                key={tab.id}
                variant={view === tab.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView(tab.id as View)}
                className="flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl h-auto text-xs font-bold transition-all active:scale-95"
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Stats View
  if (view === 'stats') {
    return (
      <div className="min-h-screen bg-background pb-[calc(6rem+env(safe-area-inset-bottom,0px))]">
        <div className="sticky top-0 z-40 bg-gradient-to-b from-background to-background/80 backdrop-blur-sm p-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-black text-foreground">Statistics</h1>
            <p className="text-sm text-foreground/60 mt-1">Your achievement stats</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4 animate-in fade-in duration-300">
          <LeagueCard stats={appData.stats} />

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card rounded-3xl p-6 shadow-sm border-2 border-primary/20 text-center">
              <p className="text-4xl font-black text-primary">{appData.stats.totalXP}</p>
              <p className="text-sm text-muted-foreground mt-2">Total XP</p>
            </div>
            <div className="bg-card rounded-3xl p-6 shadow-sm border-2 border-secondary/20 text-center">
              <p className="text-4xl font-black text-secondary">{appData.stats.currentStreak}</p>
              <p className="text-sm text-muted-foreground mt-2">Current Streak</p>
            </div>
          </div>

          <div className="bg-card rounded-3xl p-6 shadow-sm border-2 border-border">
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
                    <div className="flex justify-between mb-1 gap-2 min-w-0">
                      <span className="font-semibold break-words line-clamp-1 min-w-0">{habit.title}</span>
                      <span className="text-sm text-foreground/60 shrink-0">{completion}%</span>
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

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const data = StorageManager.getData();
              const csv = exportToCsv(data);
              downloadCsv(csv, getExportFilename());
              setExportSuccess(true);
              setTimeout(() => setExportSuccess(false), 3000);
            }}
            className="w-full py-4 rounded-3xl border-2 border-primary/30 h-auto font-bold transition-all active:scale-[0.98]"
          >
            Export to Excel (CSV)
          </Button>
          {exportSuccess && (
            <p className="text-sm text-secondary font-medium text-center" role="status">
              Export downloaded
            </p>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg pb-[env(safe-area-inset-bottom)]">
          <div className="max-w-2xl mx-auto flex gap-1 p-2">
            {[
              { id: 'dashboard', label: 'Daily', icon: '📋' },
              { id: 'quest', label: 'Quest', icon: '🗺️' },
              { id: 'calendar', label: 'Calendar', icon: '📅' },
              { id: 'stats', label: 'Stats', icon: '📊' },
              { id: 'manage', label: 'Manage', icon: '⚙️' },
            ].map(tab => (
              <Button
                key={tab.id}
                variant={view === tab.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView(tab.id as View)}
                className="flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl h-auto text-xs font-bold transition-all active:scale-95"
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Manage Habits View
  if (view === 'manage') {
    return (
      <div className="min-h-screen bg-background pb-[calc(6rem+env(safe-area-inset-bottom,0px))]">
        <div className="sticky top-0 z-40 bg-gradient-to-b from-background to-background/80 backdrop-blur-sm p-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-black text-foreground">Manage Habits</h1>
            <p className="text-sm text-foreground/60 mt-1">Edit or remove habits</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4 animate-in fade-in duration-300">
          {appData.habits.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No habits yet</p>
              <Button
                variant="secondary"
                onClick={() => setShowAddHabit(true)}
                className="mt-4 rounded-full font-bold transition-all active:scale-[0.98]"
              >
                Add Habit
              </Button>
            </div>
          ) : (
            appData.habits.map(habit => (
              <div key={habit.id} className="bg-card rounded-3xl p-4 shadow-sm border-2 border-primary/20 transition-shadow hover:shadow-md min-w-0">
                <div className="flex items-start justify-between mb-3 gap-2 min-w-0">
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg break-words line-clamp-2">{habit.title}</h3>
                    {habit.description && (
                      <p className="text-sm text-muted-foreground break-words line-clamp-2 min-w-0">{habit.description}</p>
                    )}
                  </div>
                  <span className="text-2xl shrink-0">+{habit.xpReward} XP</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setSelectedHabit(habit);
                      setShowAddHabit(true);
                    }}
                    className="flex-1 rounded-xl font-semibold text-sm transition-all active:scale-[0.98]"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (confirm('Delete this habit? All completions will be removed.')) {
                        handleDeleteHabit(habit.id);
                      }
                    }}
                    className="flex-1 rounded-xl font-semibold text-sm bg-destructive/20 text-destructive hover:bg-destructive/30 border-0 transition-all active:scale-[0.98]"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              const data = StorageManager.getData();
              const csv = exportToCsv(data);
              downloadCsv(csv, getExportFilename());
              setExportSuccess(true);
              setTimeout(() => setExportSuccess(false), 3000);
            }}
            className="w-full py-4 rounded-3xl border-2 border-primary/30 h-auto font-bold transition-all active:scale-[0.98]"
          >
            Export to Excel (CSV)
          </Button>
          {exportSuccess && (
            <p className="text-sm text-secondary font-medium text-center" role="status">
              Export downloaded
            </p>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={() => setShowResetModal(true)}
            className="w-full py-4 rounded-3xl border-2 border-destructive/50 h-auto font-bold text-destructive hover:bg-destructive/10 transition-all active:scale-[0.98]"
          >
            Reset all progress
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setShowDeleteAllModal(true)}
            className="w-full py-4 rounded-3xl border-2 border-destructive/50 h-auto font-bold text-destructive hover:bg-destructive/10 transition-all active:scale-[0.98]"
          >
            Delete all habits
          </Button>
        </div>

        {/* Reset progress confirmation modal */}
        <AlertDialog open={showResetModal} onOpenChange={setShowResetModal}>
          <AlertDialogContent className="rounded-3xl border-2 border-destructive/20">
            <AlertDialogHeader>
              <AlertDialogTitle>Reset all progress?</AlertDialogTitle>
              <AlertDialogDescription>
                This will clear all completions, XP, streaks, and league. Your habits will remain. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex gap-3 sm:gap-2">
              <AlertDialogCancel className="flex-1 rounded-xl">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  StorageManager.resetAllProgress();
                  setAppData(StorageManager.getData());
                }}
                className="flex-1 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete all habits confirmation modal */}
        <AlertDialog open={showDeleteAllModal} onOpenChange={setShowDeleteAllModal}>
          <AlertDialogContent className="rounded-3xl border-2 border-destructive/20">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete all habits?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove every habit and all their completions. Your XP, streaks, and league will be reset. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex gap-3 sm:gap-2">
              <AlertDialogCancel className="flex-1 rounded-xl">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  StorageManager.deleteAllHabits();
                  setAppData(StorageManager.getData());
                  setSelectedHabit(null);
                }}
                className="flex-1 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete all
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Edit Habit Modal */}
        <Dialog open={!!(showAddHabit && selectedHabit)} onOpenChange={(open) => { if (!open) { setShowAddHabit(false); setSelectedHabit(null); } }}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border-2 border-primary/20">
            <DialogHeader>
              <DialogTitle className="sr-only">Edit habit</DialogTitle>
            </DialogHeader>
            {selectedHabit && (
              <HabitForm
                initialHabit={selectedHabit}
                onSubmit={handleUpdateHabit}
                onCancel={() => {
                  setShowAddHabit(false);
                  setSelectedHabit(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg pb-[env(safe-area-inset-bottom)]">
          <div className="max-w-2xl mx-auto flex gap-1 p-2">
            {[
              { id: 'dashboard', label: 'Daily', icon: '📋' },
              { id: 'quest', label: 'Quest', icon: '🗺️' },
              { id: 'calendar', label: 'Calendar', icon: '📅' },
              { id: 'stats', label: 'Stats', icon: '📊' },
              { id: 'manage', label: 'Manage', icon: '⚙️' },
            ].map(tab => (
              <Button
                key={tab.id}
                variant={view === tab.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setView(tab.id as View)}
                className="flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl h-auto text-xs font-bold transition-all active:scale-95"
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
