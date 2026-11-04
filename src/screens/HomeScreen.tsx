import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Circle,
  Plus,
  Droplets,
  Heart,
  Wind,
  Flame,
  ArrowRight,
  Clock,
  DollarSign,
  Wallet,
  Calendar,
  SlidersHorizontal,
  BellRing,
  BookOpen,
  ArrowUpRight,
  ArrowDownLeft,
  Target,
  Quote,
  Sprout,
  Coins,
  ClipboardCheck,
  Film,
  Tv,
  Star,
  StickyNote,
  Moon,
} from 'lucide-react';
import { useBloom } from '../context/BloomContext';
import { MoodType } from '../types/bloom';
import { getHabitIcon } from '../utils/iconMap';
import { DashboardCustomizerModal } from '../components/DashboardCustomizerModal';
import { ThemeCardCorner, ThemeDivider } from '../components/ThemeDecorations';
import { ModuleIcon } from '../components/ModuleIcon';

interface HomeScreenProps {
  onOpenQuickAction: () => void;
  onNavigateToTab: (tab: 'planner' | 'insights' | 'modules', targetModule?: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onOpenQuickAction, onNavigateToTab }) => {
  const {
    state,
    currentTheme,
    bloomScore,
    completedHabitsToday,
    totalHabitsToday,
    todayStr,
    currency,
    toggleHabit,
    toggleTask,
    logWater,
    setMood,
    updateSleep,
    playSound,
    addMindfulMinutes,
    totalAccountBalance,
    totalMonthlyExpense,
    totalLentOutstanding,
    totalBorrowedOutstanding,
  } = useBloom();

  const palette = state.darkMode ? currentTheme.dark : currentTheme.light;
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathCount, setBreathCount] = useState(60);
  const [customizerOpen, setCustomizerOpen] = useState(false);

  // Time-of-day greeting
  const timeGreeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 21) return 'Good evening';
    return 'Peaceful night';
  }, []);

  // Today's formatted date
  const dateFormatted = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  // Filter tasks for today
  const todayTasks = state.tasks.filter((t) => t.dueDate === todayStr);
  const upcomingTasks = state.tasks.filter((t) => t.dueDate > todayStr).slice(0, 3);
  const pendingReminders = state.reminders.filter((r) => r.dueDate >= todayStr).slice(0, 3);

  // Filter active modules configured to show as home shortcuts
  const homeShortcuts = useMemo(() => {
    return (state.modulesConfig || [])
      .filter((m) => m.enabled && m.showOnHomeShortcut !== false)
      .sort((a, b) => a.order - b.order);
  }, [state.modulesConfig]);

  const moods: { type: MoodType; emoji: string; label: string }[] = [
    { type: 'radiant', emoji: '✨', label: 'Radiant' },
    { type: 'peaceful', emoji: '🌿', label: 'Peaceful' },
    { type: 'reflective', emoji: '☕', label: 'Reflective' },
    { type: 'low-energy', emoji: '☁️', label: 'Restful' },
    { type: 'anxious', emoji: '🌊', label: 'Seeking Calm' },
  ];

  const handleStartBreathing = () => {
    setBreathingActive(true);
    setBreathCount(60);
    playSound('bloom');
    const timer = setInterval(() => {
      setBreathCount((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setBreathingActive(false);
          addMindfulMinutes(1);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Helper map for rendering dashboard cards according to user preference
  const renderCard = (cardId: string) => {
    switch (cardId) {
      // CARD 1: Bloom Progress
      case 'bloom_progress':
        return (
          <div
            key="bloom_progress"
            className={`p-5 ${currentTheme.cardStyle.radius} border ${currentTheme.cardStyle.shadow} transition-colors duration-200 relative overflow-hidden`}
            style={{
              backgroundColor: palette.surface,
              borderColor: palette.cardBorder,
            }}
          >
            <div className="absolute top-4 right-4 pointer-events-none">
              <ThemeCardCorner />
            </div>
            <div className="flex items-center justify-between mb-3 pr-5">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Daily Progress
                </span>
                <h3 className={`text-base font-semibold ${currentTheme.fontFamily.fontClass}`} style={{ color: palette.text }}>
                  Life Harmony Index
                </h3>
              </div>
              <button
                onClick={() => onNavigateToTab('insights')}
                className="text-xs font-medium flex items-center gap-1 hover:underline"
                style={{ color: palette.primary }}
              >
                <span>Insights</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-5">
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="stroke-current opacity-15"
                    style={{ color: palette.primary }}
                    strokeWidth="3.2"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="stroke-current transition-all duration-700 ease-out"
                    style={{ color: palette.primary }}
                    strokeDasharray={`${bloomScore}, 100`}
                    strokeLinecap="round"
                    strokeWidth="3.2"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold tabular-nums" style={{ color: palette.text }}>
                    {bloomScore}%
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-neutral-400">Bloom</span>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-2xl" style={{ backgroundColor: palette.surfaceElevated }}>
                  <span className="text-[11px] text-neutral-400 block mb-0.5">Habits</span>
                  <p className="font-semibold tabular-nums" style={{ color: palette.text }}>
                    {completedHabitsToday} / {totalHabitsToday} done
                  </p>
                </div>
                <div className="p-2.5 rounded-2xl" style={{ backgroundColor: palette.surfaceElevated }}>
                  <span className="text-[11px] text-neutral-400 block mb-0.5">Hydration</span>
                  <p className="font-semibold tabular-nums" style={{ color: palette.text }}>
                    {state.wellness.waterCount} / 8 cups
                  </p>
                </div>
                <div className="p-2.5 rounded-2xl" style={{ backgroundColor: palette.surfaceElevated }}>
                  <span className="text-[11px] text-neutral-400 block mb-0.5">Mindfulness</span>
                  <p className="font-semibold tabular-nums" style={{ color: palette.text }}>
                    {state.wellness.mindfulMinutesToday} mins
                  </p>
                </div>
                <div className="p-2.5 rounded-2xl" style={{ backgroundColor: palette.surfaceElevated }}>
                  <span className="text-[11px] text-neutral-400 block mb-0.5">Tasks Today</span>
                  <p className="font-semibold tabular-nums" style={{ color: palette.text }}>
                    {todayTasks.filter((t) => t.completed).length} / {todayTasks.length} done
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      // CARD 2: Today's Tasks
      case 'today_tasks':
        return (
          <div key="today_tasks" className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold tracking-tight" style={{ color: palette.text }}>
                  Today's Tasks & Focus
                </h3>
              </div>
              <button
                onClick={() => onNavigateToTab('planner')}
                className="text-xs font-medium hover:underline"
                style={{ color: palette.primary }}
              >
                All Tasks
              </button>
            </div>

            <div className="space-y-2">
              {todayTasks.length === 0 ? (
                <div
                  className="p-5 rounded-2xl border text-center text-xs text-neutral-400"
                  style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
                >
                  All tasks complete for today. Take time to relax!
                </div>
              ) : (
                todayTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer group select-none"
                    style={{
                      backgroundColor: palette.surface,
                      borderColor: task.completed ? palette.primaryContainer : palette.cardBorder,
                    }}
                  >
                    <button
                      type="button"
                      className="mt-0.5 w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: task.completed ? palette.primary : palette.surfaceElevated,
                        color: task.completed ? palette.onPrimary : palette.textMuted,
                      }}
                    >
                      {task.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-semibold truncate ${
                            task.completed ? 'line-through opacity-60' : ''
                          }`}
                          style={{ color: palette.text }}
                        >
                          {task.title}
                        </span>
                        <span className="text-[11px] font-mono tabular-nums text-neutral-400 shrink-0 ml-2">
                          {task.dueTime || 'Today'}
                        </span>
                      </div>
                      {task.description && (
                        <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5 font-light">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      // CARD 3: Habit Summary
      case 'habit_summary':
        return (
          <div key="habit_summary" className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-semibold tracking-tight" style={{ color: palette.text }}>
                  Habits & Rituals
                </h3>
              </div>
              <button
                onClick={() => onNavigateToTab('modules')}
                className="text-xs font-medium hover:underline"
                style={{ color: palette.primary }}
              >
                Tracker
              </button>
            </div>

            <div className="space-y-2">
              {state.habits.slice(0, 4).map((habit) => {
                const isCompleted = habit.completedDates.includes(todayStr);
                const HabitIcon = getHabitIcon(habit.iconName);

                return (
                  <div
                    key={habit.id}
                    onClick={() => toggleHabit(habit.id)}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer select-none group"
                    style={{
                      backgroundColor: palette.surface,
                      borderColor: isCompleted ? palette.primaryContainer : palette.cardBorder,
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-90"
                        style={{
                          backgroundColor: isCompleted ? palette.primary : palette.surfaceElevated,
                          color: isCompleted ? palette.onPrimary : palette.textMuted,
                        }}
                      >
                        <HabitIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`text-xs font-semibold truncate ${
                            isCompleted ? 'line-through opacity-60' : ''
                          }`}
                          style={{ color: palette.text }}
                        >
                          {habit.title}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                          <span className="capitalize">{habit.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-0.5 text-amber-500 font-medium">
                            <Flame className="w-3 h-3 fill-amber-500" />
                            <span className="tabular-nums">{habit.streak} streak</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <span
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: palette.surfaceElevated,
                        color: palette.textMuted,
                      }}
                    >
                      {isCompleted ? 'Done' : habit.reminderTime || 'Daily'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );

      // CARD 4: Finance & Account Balances Glance
      case 'finance_glance':
        return (
          <div
            key="finance_glance"
            className="p-5 rounded-3xl border shadow-xs space-y-3"
            style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold" style={{ color: palette.text }}>
                  Finance & Accounts ({currency})
                </h3>
              </div>
              <button
                onClick={() => onNavigateToTab('modules')}
                className="text-xs font-medium hover:underline"
                style={{ color: palette.primary }}
              >
                Ledger
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-2xl" style={{ backgroundColor: palette.surfaceElevated }}>
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">Total Balance</span>
                <p className="text-base font-bold font-mono tabular-nums text-emerald-500 mt-0.5">
                  {currency}{totalAccountBalance.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-2xl" style={{ backgroundColor: palette.surfaceElevated }}>
                <span className="text-[10px] text-neutral-400 uppercase font-semibold">Spent this Month</span>
                <p className="text-base font-bold font-mono tabular-nums text-rose-400 mt-0.5">
                  {currency}{totalMonthlyExpense.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Micro Accounts strip */}
            <div className="flex items-center gap-2 overflow-x-auto pt-1">
              {state.accounts.map((acc) => (
                <div
                  key={acc.id}
                  className="px-2.5 py-1.5 rounded-xl border text-[11px] shrink-0"
                  style={{ borderColor: palette.outline, backgroundColor: palette.surfaceElevated }}
                >
                  <span className="text-neutral-400 mr-1.5">{acc.name.split(' ')[0]}:</span>
                  <span className="font-semibold font-mono tabular-nums" style={{ color: palette.text }}>
                    {currency}{acc.balance.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      // CARD 5: Lending and Borrowing Ledger
      case 'debts_ledger':
        return (
          <div
            key="debts_ledger"
            className="p-5 rounded-3xl border shadow-xs space-y-3"
            style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold" style={{ color: palette.text }}>
                Lending & Borrowing Ledger
              </h3>
              <button
                onClick={() => onNavigateToTab('modules')}
                className="text-xs font-medium hover:underline"
                style={{ color: palette.primary }}
              >
                Manage
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 block">
                  Who Owes Me
                </span>
                <span className="text-sm font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                  {currency}{totalLentOutstanding.toLocaleString()}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 block">
                  Whom I Owe
                </span>
                <span className="text-sm font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400">
                  {currency}{totalBorrowedOutstanding.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        );

      // CARD 6: Hydration & Mindful Pulse
      case 'wellness_summary':
        return (
          <div key="wellness_summary" className="space-y-3">
            <div
              className="p-4 rounded-3xl border transition-colors duration-200"
              style={{
                backgroundColor: palette.surface,
                borderColor: palette.cardBorder,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold tracking-tight" style={{ color: palette.text }}>
                  Mindful Pulse
                </span>
                <span className="text-xs text-neutral-400">
                  {state.wellness.moodToday ? `Energy: ${state.wellness.moodToday}` : 'Check in today'}
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {moods.map((m) => {
                  const isSelected = state.wellness.moodToday === m.type;
                  return (
                    <button
                      key={m.type}
                      onClick={() => setMood(m.type)}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl border transition-all ${
                        isSelected
                          ? 'scale-105 shadow-xs font-semibold'
                          : 'opacity-75 hover:opacity-100 hover:scale-102'
                      }`}
                      style={{
                        backgroundColor: isSelected ? palette.primaryContainer : palette.surfaceElevated,
                        borderColor: isSelected ? palette.primary : palette.outline,
                      }}
                    >
                      <span className="text-xl mb-1">{m.emoji}</span>
                      <span
                        className="text-[10px] tracking-tight truncate w-full text-center"
                        style={{
                          color: isSelected ? palette.onPrimaryContainer : palette.textMuted,
                        }}
                      >
                        {m.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Water and Mindful Pod */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className="p-4 rounded-3xl border flex flex-col justify-between"
                style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold" style={{ color: palette.text }}>
                      Water Intake
                    </span>
                    <Droplets className="w-4 h-4 text-sky-400" />
                  </div>
                  <p className="text-[11px] text-neutral-400">Goal: 8 cups</p>
                </div>
                <div className="my-2 flex items-center gap-1 justify-center">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2.5 h-4 rounded-xs transition-all ${
                        i < state.wellness.waterCount ? 'bg-sky-400' : 'bg-neutral-200 dark:bg-neutral-800'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => logWater(-1)}
                    className="flex-1 py-1 rounded-lg border text-xs"
                    style={{ borderColor: palette.outline }}
                  >
                    -1
                  </button>
                  <button
                    onClick={() => logWater(1)}
                    className="flex-1 py-1 rounded-lg text-xs font-semibold text-white bg-sky-500 shadow-xs"
                  >
                    +1 Cup
                  </button>
                </div>
              </div>

              <div
                className="p-4 rounded-3xl border flex flex-col justify-between"
                style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold" style={{ color: palette.text }}>
                      Calm Breath
                    </span>
                    <Wind className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-[11px] text-neutral-400">60s box cadence</p>
                </div>
                <div className="my-2 flex items-center justify-center">
                  {breathingActive ? (
                    <span className="text-xs font-mono font-bold text-emerald-500">{breathCount}s remaining</span>
                  ) : (
                    <span className="text-[11px] text-neutral-400 italic">"Find stillness"</span>
                  )}
                </div>
                <button
                  onClick={handleStartBreathing}
                  disabled={breathingActive}
                  className="w-full py-1.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 disabled:opacity-50"
                >
                  {breathingActive ? 'Breathe...' : 'Start 1m'}
                </button>
              </div>
            </div>
          </div>
        );

      // CARD 7: Active Goals
      case 'active_goals':
        return (
          <div
            key="active_goals"
            className="p-5 rounded-3xl border shadow-xs space-y-3"
            style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-semibold" style={{ color: palette.text }}>
                  Active Goals & Vision
                </h3>
              </div>
              <button
                onClick={() => onNavigateToTab('modules')}
                className="text-xs font-medium hover:underline"
                style={{ color: palette.primary }}
              >
                Vision Board
              </button>
            </div>

            <div className="space-y-2.5">
              {state.goals.slice(0, 2).map((goal) => (
                <div key={goal.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold truncate" style={{ color: palette.text }}>
                      {goal.title}
                    </span>
                    <span className="text-xs font-mono font-bold tabular-nums" style={{ color: palette.primary }}>
                      {goal.progressPercent}%
                    </span>
                  </div>
                  <div
                    className="w-full h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: palette.surfaceElevated }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${goal.progressPercent}%`, backgroundColor: palette.primary }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      // CARD 8: Upcoming Events
      case 'upcoming_events':
        return (
          <div
            key="upcoming_events"
            className="p-5 rounded-3xl border shadow-xs space-y-3"
            style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold" style={{ color: palette.text }}>
                  Upcoming Schedule & Events
                </h3>
              </div>
              <button
                onClick={() => onNavigateToTab('planner')}
                className="text-xs font-medium hover:underline"
                style={{ color: palette.primary }}
              >
                Planner
              </button>
            </div>

            <div className="space-y-2">
              {upcomingTasks.length === 0 ? (
                <p className="text-xs text-neutral-400 italic">No upcoming events this week.</p>
              ) : (
                upcomingTasks.map((ev) => (
                  <div
                    key={ev.id}
                    className="flex items-center justify-between text-xs py-1 border-b last:border-0 border-neutral-100 dark:border-neutral-800"
                  >
                    <div className="truncate mr-2">
                      <p className="font-medium truncate" style={{ color: palette.text }}>
                        {ev.title}
                      </p>
                      <p className="text-[10px] text-neutral-400">{ev.category} · {ev.dueDate}</p>
                    </div>
                    <span className="text-[11px] font-mono tabular-nums text-neutral-400 shrink-0">
                      {ev.dueTime || 'All Day'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      // CARD 9: Pending Reminders
      case 'pending_reminders':
        return (
          <div
            key="pending_reminders"
            className="p-5 rounded-3xl border shadow-xs space-y-3"
            style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BellRing className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold" style={{ color: palette.text }}>
                  Pending Reminders & Vault
                </h3>
              </div>
              <button
                onClick={() => onNavigateToTab('modules')}
                className="text-xs font-medium hover:underline"
                style={{ color: palette.primary }}
              >
                Vault
              </button>
            </div>

            <div className="space-y-2">
              {pendingReminders.map((rem) => (
                <div
                  key={rem.id}
                  className="p-2.5 rounded-xl text-xs flex items-center justify-between"
                  style={{ backgroundColor: palette.surfaceElevated }}
                >
                  <span className="font-medium truncate" style={{ color: palette.text }}>
                    {rem.title}
                  </span>
                  <span className="text-[11px] text-neutral-400 font-mono tabular-nums shrink-0 ml-2">
                    Due {rem.dueDate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );

      // CARD 10: Motivational Message
      case 'motivational_quote':
        return (
          <div
            key="motivational_quote"
            className={`p-5 ${currentTheme.cardStyle.radius} border ${currentTheme.cardStyle.shadow} space-y-2 relative overflow-hidden`}
            style={{
              backgroundColor: palette.surfaceElevated,
              borderColor: palette.cardBorder,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: palette.primary }}>
                <span className="text-sm">{currentTheme.decorations.quoteSymbol}</span>
                <span>Daily Floral Reflection</span>
              </div>
              <ThemeCardCorner />
            </div>
            <p className={`text-xs leading-relaxed italic font-normal ${currentTheme.fontFamily.fontClass}`} style={{ color: palette.text }}>
              "Live gently, create courageously, and let your intentions bloom in their own quiet season."
            </p>
          </div>
        );

      // CARD 11: Entertainment & Media Tracker
      case 'entertainment_tracker': {
        const inProgressItems = (state.entertainment || []).filter(
          (e) => e.status === 'reading' || e.status === 'watching'
        );
        const displayItems = inProgressItems.length > 0 ? inProgressItems.slice(0, 3) : (state.entertainment || []).slice(0, 2);

        return (
          <div
            key="entertainment_tracker"
            className="p-5 rounded-3xl border shadow-xs space-y-3"
            style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-semibold" style={{ color: palette.text }}>
                  Entertainment & Media Pulse
                </h3>
              </div>
              <button
                onClick={() => onNavigateToTab('modules')}
                className="text-xs font-medium hover:underline flex items-center gap-1"
                style={{ color: palette.primary }}
              >
                <span>Tracker</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2">
              {displayItems.length === 0 ? (
                <p className="text-xs text-neutral-400 italic">No media entries yet. Start logging your books and movies!</p>
              ) : (
                displayItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-2xl flex items-center justify-between gap-2.5 border"
                    style={{ backgroundColor: palette.surfaceElevated, borderColor: palette.outline }}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 text-xs font-bold"
                        style={{ backgroundColor: item.coverColor || palette.primary }}
                      >
                        {item.type === 'book' ? <BookOpen className="w-3.5 h-3.5" /> : item.type === 'movie' ? <Film className="w-3.5 h-3.5" /> : <Tv className="w-3.5 h-3.5" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate" style={{ color: palette.text }}>
                          {item.title}
                        </p>
                        <p className="text-[10px] text-neutral-400 truncate">
                          {item.type === 'book' ? `by ${item.author || 'Author'}` : item.type === 'tv' ? `S${item.currentSeason || 1}:E${item.currentEpisode || 1}` : item.genre || 'Movie'}
                        </p>
                      </div>
                    </div>

                    <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-rose-500/10 text-rose-500 shrink-0">
                      {item.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      }

      // CARD 12: Sleep & Recovery Summary
      case 'sleep_summary':
        return (
          <div
            key="sleep_summary"
            className="p-5 rounded-3xl border shadow-xs space-y-2.5"
            style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold" style={{ color: palette.text }}>
                  Sleep & Recovery
                </h3>
              </div>
              <button
                onClick={() => onNavigateToTab('modules')}
                className="text-xs font-medium hover:underline"
                style={{ color: palette.primary }}
              >
                Wellness
              </button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
              <div>
                <p className="text-xs font-bold text-indigo-400">
                  {state.wellness.sleepHours} Hours Logged
                </p>
                <p className="text-[10px] text-neutral-400 capitalize">
                  Quality: {state.wellness.sleepQuality || 'Restful'}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {[5, 6, 7, 8, 9].map((hrs) => (
                  <button
                    key={hrs}
                    onClick={() => updateSleep(hrs, hrs >= 7 ? 'restful' : 'average')}
                    className={`w-6 h-6 rounded-lg text-[10px] font-bold transition-all ${
                      state.wellness.sleepHours === hrs
                        ? 'bg-indigo-500 text-white shadow-xs'
                        : 'bg-white/10 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {hrs}h
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      // CARD 13: Mood Check-in
      case 'mood_tracker':
        return (
          <div
            key="mood_tracker"
            className="p-5 rounded-3xl border shadow-xs space-y-3"
            style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-400" />
                <h3 className="text-sm font-semibold" style={{ color: palette.text }}>
                  Daily Mood Check-in
                </h3>
              </div>
              {state.wellness.moodToday && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-500 font-bold capitalize">
                  {state.wellness.moodToday}
                </span>
              )}
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {moods.map((m) => (
                <button
                  key={m.type}
                  onClick={() => setMood(m.type)}
                  className={`p-2 rounded-2xl border text-center transition-all ${
                    state.wellness.moodToday === m.type
                      ? 'border-pink-500 bg-pink-500/15 scale-105 shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                  }`}
                >
                  <span className="text-xl block">{m.emoji}</span>
                  <span className="text-[9px] font-semibold text-neutral-400 block mt-1 truncate">
                    {m.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        );

      // CARD 14: Quick Notes
      case 'quick_notes': {
        const displayNotes = state.notes.slice(0, 2);
        return (
          <div
            key="quick_notes"
            className="p-5 rounded-3xl border shadow-xs space-y-3"
            style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StickyNote className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold" style={{ color: palette.text }}>
                  Quick Notes & Checklists
                </h3>
              </div>
              <button
                onClick={() => onNavigateToTab('modules')}
                className="text-xs font-medium hover:underline"
                style={{ color: palette.primary }}
              >
                All Notes
              </button>
            </div>
            <div className="space-y-2">
              {displayNotes.length === 0 ? (
                <p className="text-xs text-neutral-400 italic">No quick notes yet.</p>
              ) : (
                displayNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 rounded-2xl border"
                    style={{ backgroundColor: palette.surfaceElevated, borderColor: palette.outline }}
                  >
                    <p className="text-xs font-bold" style={{ color: palette.text }}>
                      {note.title}
                    </p>
                    <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                      {note.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="flex-1 pb-24 space-y-5">
      {/* 1. Header Banner & Dynamic Greeting based on time of day */}
      <div className="relative overflow-hidden rounded-b-3xl">
        <div className="relative h-44 w-full overflow-hidden">
          <img
            src="/src/assets/images/bloom_floral_banner_1793594986468.jpg"
            alt="Botanical Header"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10 flex flex-col justify-end p-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-rose-200/90 font-medium">
                <span>{dateFormatted}</span>
                <span aria-hidden="true">·</span>
                <span>{timeGreeting}</span>
              </div>
              <button
                onClick={() => setCustomizerOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-[11px] font-medium transition-colors"
                title="Customize Dashboard Cards"
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>Customize</span>
              </button>
            </div>
            <h2 className={`text-2xl italic font-normal text-white mt-1 tracking-tight ${currentTheme.fontFamily.fontClass}`}>
              {timeGreeting}, {state.user.name.split(' ')[0]}
            </h2>
            <p className="text-xs text-white/85 line-clamp-1 mt-0.5 font-light">
              "Your life, beautifully organised."
            </p>
          </div>
        </div>
      </div>

      {/* Quick Module Shortcuts Strip */}
      {homeShortcuts.length > 0 && (
        <div className="px-4">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              Quick Shortcuts
            </span>
            <button
              onClick={() => {
                playSound('tap');
                onNavigateToTab('modules');
              }}
              className="text-[11px] font-semibold flex items-center gap-1 hover:underline transition-colors"
              style={{ color: palette.primary }}
            >
              <span>All Modules</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {homeShortcuts.map((mod) => (
              <button
                key={mod.id}
                onClick={() => {
                  playSound('tap');
                  onNavigateToTab('modules', mod.id);
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-2xl border shrink-0 shadow-2xs hover:scale-102 active:scale-95 transition-all text-left"
                style={{
                  backgroundColor: palette.surface,
                  borderColor: palette.cardBorder,
                  color: palette.text,
                }}
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: `${palette.primary}18`,
                    color: palette.primary,
                  }}
                >
                  <ModuleIcon name={mod.iconName} className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-semibold whitespace-nowrap">
                  {mod.name.replace(/ Tracker| Manager| & Growth| & Entertainment| & Lists/g, '')}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 2. Dynamically rendered, reorderable, customizable cards */}
      <div className="px-4 space-y-4">
        {state.dashboardCards
          .filter((card) => card.visible)
          .map((card) => {
            const rendered = renderCard(card.id);
            if (!rendered) return null;
            return (
              <div key={card.id}>
                {rendered}
              </div>
            );
          })}

        {/* Dedicated Personalise Dashboard Action */}
        <div className="pt-2">
          <button
            onClick={() => {
              playSound('tap');
              setCustomizerOpen(true);
            }}
            className="w-full py-3.5 rounded-3xl border border-dashed flex items-center justify-center gap-2 text-xs font-semibold hover:border-rose-400 hover:text-rose-400 transition-colors"
            style={{
              borderColor: palette.cardBorder,
              color: palette.textMuted,
              backgroundColor: `${palette.surface}60`,
            }}
          >
            <SlidersHorizontal className="w-4 h-4 text-rose-400" />
            <span>Personalise Home Dashboard</span>
          </button>
        </div>
      </div>

      {/* Dashboard Customizer Drawer */}
      <DashboardCustomizerModal
        isOpen={customizerOpen}
        onClose={() => setCustomizerOpen(false)}
      />

      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-20 right-6 sm:right-8 z-30">
        <button
          onClick={onOpenQuickAction}
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl active:scale-95 transition-transform hover:shadow-2xl focus:outline-none"
          style={{
            backgroundColor: palette.primary,
            color: palette.onPrimary,
          }}
          title="Add New Life Item"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
