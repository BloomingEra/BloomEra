import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Sparkles,
  Heart,
  Droplets,
  Wallet,
  BookOpen,
  Calendar,
  Flame,
  Award,
  CheckCircle2,
  PieChart,
  Moon,
  Clock,
  Target,
  ArrowUpRight,
  ShieldCheck,
  Crown,
  FileText,
  Zap,
} from 'lucide-react';
import { useBloom } from '../context/BloomContext';
import { ThemeCardCorner } from '../components/ThemeDecorations';

type ProductivityTimeframe = 'daily' | 'weekly' | 'monthly';

export const InsightsScreen: React.FC = () => {
  const {
    state,
    currentTheme,
    todayStr,
    currency,
    bloomScore,
    completedHabitsToday,
    totalHabitsToday,
    totalMonthlyExpense,
    totalMonthlyIncome,
    netWorth,
    isPremium,
    openUpgradeModal,
    exportProductivityReport,
  } = useBloom();

  const palette = state.darkMode ? currentTheme.dark : currentTheme.light;
  const [timeframe, setTimeframe] = useState<ProductivityTimeframe>('weekly');

  // 1. Life Dimensions
  const dimensions = [
    {
      name: 'Body & Vitality',
      score: Math.min(100, Math.round((state.wellness.waterCount / 8) * 50 + (state.wellness.sleepHours / 8) * 50)),
      color: '#38BDF8',
      desc: 'Sleep hygiene & daily hydration',
    },
    {
      name: 'Mind & Stillness',
      score: Math.min(100, Math.round((state.wellness.mindfulMinutesToday / 15) * 60 + (state.wellness.moodToday ? 40 : 10))),
      color: '#F472B6',
      desc: 'Breathwork & gratitude reflections',
    },
    {
      name: 'Focus & Rituals',
      score: totalHabitsToday > 0 ? Math.round((completedHabitsToday / totalHabitsToday) * 100) : 80,
      color: '#A78BFA',
      desc: 'Morning flow & routine consistency',
    },
    {
      name: 'Wealth Harmony',
      score: 82,
      color: '#34D399',
      desc: 'Budget adherence & savings cushion',
    },
    {
      name: 'Wisdom & Growth',
      score: 88,
      color: '#FBBF24',
      desc: 'Reading units & active milestones',
    },
  ];

  // 2. 28-day habit heatmap
  const heatmapDays = useMemo(() => {
    return Array.from({ length: 28 }).map((_, idx) => {
      const intensity = (idx * 3 + 2) % 4;
      return { day: idx + 1, level: intensity };
    });
  }, []);

  // 3. Category Expenses Breakdown
  const categoryExpenses = useMemo(() => {
    const map: Record<string, number> = {};
    state.finances
      .filter((f) => f.type === 'expense')
      .forEach((f) => {
        map[f.category] = (map[f.category] || 0) + f.amount;
      });
    return Object.entries(map).map(([category, amount]) => ({
      category,
      amount,
      percent: totalMonthlyExpense > 0 ? Math.round((amount / totalMonthlyExpense) * 100) : 0,
    }));
  }, [state.finances, totalMonthlyExpense]);

  // 4. Task Completion metrics
  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter((t) => t.completed).length;
  const overdueTasks = state.tasks.filter((t) => !t.completed && t.dueDate < todayStr).length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 5. Goals progress
  const totalGoals = state.goals.length;
  const finishedGoals = state.goals.filter((g) => g.completed).length;
  const avgGoalProgress = totalGoals > 0
    ? Math.round(state.goals.reduce((sum, g) => sum + g.progressPercent, 0) / totalGoals)
    : 0;

  // 6. Savings Progress
  const savingsPercent = Math.min(100, Math.round((state.currentSavings / state.savingsGoal) * 100));

  // 7. 7-Day Sleep & Hydration Trend simulation
  const wellnessTrend = [
    { day: 'Mon', sleep: 7.2, water: 6 },
    { day: 'Tue', sleep: 7.5, water: 7 },
    { day: 'Wed', sleep: 6.8, water: 5 },
    { day: 'Thu', sleep: 8.0, water: 8 },
    { day: 'Fri', sleep: 7.4, water: 7 },
    { day: 'Sat', sleep: 8.2, water: 8 },
    { day: 'Sun', sleep: 7.8, water: state.wellness.waterCount },
  ];

  return (
    <div className="flex-1 pb-24 p-4 space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Analytics & Reports
          </span>
          <h2
            className={`text-xl font-medium tracking-tight flex items-center gap-2 ${currentTheme.fontFamily.fontClass}`}
            style={{ color: palette.text }}
          >
            Insights & Analytics
            <ThemeCardCorner className="w-4 h-4 text-rose-400" />
          </h2>
        </div>

        {/* Timeframe switch: Daily, Weekly, Monthly */}
        <div
          className="flex items-center p-1 rounded-xl text-xs"
          style={{ backgroundColor: palette.surfaceElevated }}
        >
          {(['daily', 'weekly', 'monthly'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-2.5 py-1 rounded-lg capitalize font-semibold transition-all ${
                timeframe === t ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 1. PRODUCTIVITY REPORT (DAILY / WEEKLY / MONTHLY) */}
      <div
        className="p-5 rounded-3xl border shadow-xs space-y-4"
        style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-semibold capitalize" style={{ color: palette.text }}>
              {timeframe} Productivity & Harmony
            </h3>
          </div>
          <span className="text-sm font-bold font-mono tabular-nums" style={{ color: palette.primary }}>
            {bloomScore} / 100 Score
          </span>
        </div>

        {/* Dimension bars */}
        <div className="space-y-2.5">
          {dimensions.map((dim) => (
            <div key={dim.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium" style={{ color: palette.text }}>
                  {dim.name}
                </span>
                <span className="text-neutral-400 font-mono tabular-nums">{dim.score}%</span>
              </div>
              <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: palette.surfaceElevated }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${dim.score}%`, backgroundColor: dim.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. TASK & HABIT CONSISTENCY METRICS */}
      <div className="grid grid-cols-2 gap-3">
        {/* Task Completion */}
        <div
          className="p-4 rounded-3xl border flex flex-col justify-between"
          style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold" style={{ color: palette.text }}>
                Task Completion
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold font-mono tabular-nums mt-1" style={{ color: palette.primary }}>
              {taskCompletionRate}%
            </p>
          </div>
          <div className="text-[11px] text-neutral-400 space-y-0.5 mt-2">
            <p>{completedTasks} completed · {totalTasks} total</p>
            {overdueTasks > 0 && <p className="text-rose-500 font-medium">{overdueTasks} overdue</p>}
          </div>
        </div>

        {/* Goal Milestone Velocity */}
        <div
          className="p-4 rounded-3xl border flex flex-col justify-between"
          style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold" style={{ color: palette.text }}>
                Goals Velocity
              </span>
              <Target className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-2xl font-bold font-mono tabular-nums mt-1 text-rose-500">
              {avgGoalProgress}%
            </p>
          </div>
          <div className="text-[11px] text-neutral-400 mt-2">
            <p>{finishedGoals} finished · {totalGoals - finishedGoals} in progress</p>
          </div>
        </div>
      </div>

      {/* 3. 28-DAY HABIT CONSISTENCY MATRIX */}
      <div
        className="p-5 rounded-3xl border shadow-xs space-y-3"
        style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-semibold" style={{ color: palette.text }}>
              28-Day Habit Consistency
            </h3>
          </div>
          <span className="text-xs font-mono font-bold tabular-nums text-amber-500">
            94% Active Rate
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 pt-1">
          {heatmapDays.map((d) => {
            const opacities = ['opacity-20', 'opacity-40', 'opacity-70', 'opacity-100'];
            return (
              <div
                key={d.day}
                title={`Day ${d.day}`}
                className={`h-7 rounded-lg flex items-center justify-center text-[10px] font-mono transition-transform hover:scale-110 cursor-pointer ${opacities[d.level]}`}
                style={{
                  backgroundColor: palette.primary,
                  color: palette.onPrimary,
                }}
              >
                {d.day}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1">
          <span>Consecutive tracking</span>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm opacity-20" style={{ backgroundColor: palette.primary }} />
            <div className="w-2.5 h-2.5 rounded-sm opacity-40" style={{ backgroundColor: palette.primary }} />
            <div className="w-2.5 h-2.5 rounded-sm opacity-70" style={{ backgroundColor: palette.primary }} />
            <div className="w-2.5 h-2.5 rounded-sm opacity-100" style={{ backgroundColor: palette.primary }} />
          </div>
          <span>Peak ritual</span>
        </div>
      </div>

      {/* 4. FINANCE BREAKDOWN & SAVINGS PROGRESS */}
      <div
        className="p-5 rounded-3xl border shadow-xs space-y-4"
        style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold" style={{ color: palette.text }}>
              Spending & Savings Breakdown ({currency})
            </h3>
          </div>
          <span className="text-xs font-semibold tabular-nums" style={{ color: palette.primary }}>
            {currency}{totalMonthlyExpense.toLocaleString()} spent
          </span>
        </div>

        {/* Savings Goal Bar */}
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              Freedom Cushion Progress
            </span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
              {currency}{state.currentSavings.toLocaleString()} / {currency}{state.savingsGoal.toLocaleString()}
            </span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden bg-emerald-500/20">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${savingsPercent}%` }} />
          </div>
          <p className="text-[10px] text-neutral-400">{savingsPercent}% completed towards ₹3,00,000 freedom goal.</p>
        </div>

        {/* Category distribution */}
        <div className="space-y-2 pt-1">
          <span className="text-xs font-semibold text-neutral-400">Category Breakdown</span>
          {categoryExpenses.map((cat) => (
            <div key={cat.category} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span style={{ color: palette.text }}>{cat.category}</span>
                <span className="font-mono tabular-nums text-neutral-400">
                  {currency}{cat.amount.toLocaleString()} ({cat.percent}%)
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: palette.surfaceElevated }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${cat.percent}%`, backgroundColor: palette.primary }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. WELLNESS TRENDS (SLEEP & WATER 7-DAY CURVE) */}
      <div
        className="p-5 rounded-3xl border shadow-xs space-y-3"
        style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-semibold" style={{ color: palette.text }}>
              7-Day Sleep & Hydration Curve
            </h3>
          </div>
          <span className="text-xs text-neutral-400">Avg 7.6h rest</span>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-2">
          {wellnessTrend.map((wt) => (
            <div key={wt.day} className="flex flex-col items-center gap-1.5">
              <div className="h-24 w-full flex items-end justify-center gap-1">
                {/* Sleep Bar */}
                <div
                  className="w-2.5 rounded-t-sm bg-indigo-400"
                  style={{ height: `${(wt.sleep / 9) * 100}%` }}
                  title={`${wt.sleep} hrs sleep`}
                />
                {/* Water Bar */}
                <div
                  className="w-2.5 rounded-t-sm bg-sky-400"
                  style={{ height: `${(wt.water / 8) * 100}%` }}
                  title={`${wt.water} cups water`}
                />
              </div>
              <span className="text-[10px] text-neutral-400">{wt.day}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 text-[10px] text-neutral-400 pt-1">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-indigo-400" />
            <span>Sleep Hours</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-sky-400" />
            <span>Hydration (Cups)</span>
          </div>
        </div>
      </div>

      {/* 6. ADVANCED ANALYTICS & EXECUTIVE INTELLIGENCE (Bloom Club Pro Exclusive) */}
      <div
        className={`p-5 rounded-3xl border shadow-xs space-y-4 relative overflow-hidden transition-all`}
        style={{
          backgroundColor: isPremium ? (state.darkMode ? '#1A1813' : '#FFFDF7') : palette.surface,
          borderColor: isPremium ? '#D4AF37' : palette.cardBorder,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`p-1.5 rounded-xl ${
                isPremium ? 'bg-amber-500/20 text-amber-500' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
              }`}
            >
              <Crown className={`w-4 h-4 ${isPremium ? 'fill-amber-500' : ''}`} />
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Executive Intelligence
              </span>
              <h3 className="text-sm font-bold" style={{ color: palette.text }}>
                Advanced Correlations & Velocity
              </h3>
            </div>
          </div>

          <button
            onClick={exportProductivityReport}
            className={`text-xs font-semibold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all shadow-xs ${
              isPremium
                ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600'
                : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export Report</span>
            {!isPremium && <Crown className="w-3 h-3 text-amber-500" />}
          </button>
        </div>

        {/* Longevity & Velocity Stats Grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div
            className="p-3 rounded-2xl border border-black/5 dark:border-white/5"
            style={{ backgroundColor: palette.surfaceElevated }}
          >
            <span className="text-[9px] uppercase font-bold text-neutral-400 block">Avg Streak</span>
            <span className="text-base font-extrabold text-amber-500">
              {state.habits.length > 0
                ? Math.round(state.habits.reduce((acc, h) => acc + h.streak, 0) / state.habits.length)
                : 0}d
            </span>
          </div>

          <div
            className="p-3 rounded-2xl border border-black/5 dark:border-white/5"
            style={{ backgroundColor: palette.surfaceElevated }}
          >
            <span className="text-[9px] uppercase font-bold text-neutral-400 block">Peak Ritual</span>
            <span className="text-base font-extrabold text-rose-400">
              {state.habits.length > 0 ? Math.max(...state.habits.map((h) => h.bestStreak)) : 0}d
            </span>
          </div>

          <div
            className="p-3 rounded-2xl border border-black/5 dark:border-white/5"
            style={{ backgroundColor: palette.surfaceElevated }}
          >
            <span className="text-[9px] uppercase font-bold text-neutral-400 block">Velocity</span>
            <span className="text-base font-extrabold text-emerald-500">+18%</span>
          </div>
        </div>

        {/* Budget Category Deviation Analysis */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-400">Budget Adherence & Variance</span>
            <span className="text-[10px] text-neutral-400">Actual vs Monthly Cap</span>
          </div>

          <div className="space-y-1.5">
            {state.categoryBudgets.slice(0, 3).map((cb) => {
              const spent = categoryExpenses.find((c) => c.category === cb.category)?.amount || 0;
              const isOver = spent > cb.limit;
              const percent = Math.min(100, Math.round((spent / (cb.limit || 1)) * 100));

              return (
                <div
                  key={cb.category}
                  className="p-2.5 rounded-xl border border-black/5 dark:border-white/5 space-y-1"
                  style={{ backgroundColor: palette.surfaceElevated }}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-medium" style={{ color: palette.text }}>
                      {cb.category}
                    </span>
                    <span className={`font-mono font-semibold ${isOver ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {currency}{spent.toLocaleString()} / {currency}{cb.limit.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                    <div
                      className={`h-full rounded-full transition-all ${isOver ? 'bg-rose-500' : 'bg-emerald-500'}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mood vs Productivity Correlation Matrix */}
        <div
          className="p-3.5 rounded-2xl border border-black/5 dark:border-white/5 space-y-2 text-xs"
          style={{ backgroundColor: palette.surfaceElevated }}
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold" style={{ color: palette.text }}>
              Mindset & Routine Correlation
            </span>
            <span className="text-[10px] font-bold text-amber-500 uppercase">Strong Alignment</span>
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Data shows that on days logged as <strong>Radiant</strong> or <strong>Peaceful</strong>, your habit completion reaches <strong>92%</strong> compared to 54% on low-energy days.
          </p>
        </div>

        {!isPremium && (
          <div className="pt-1">
            <button
              onClick={() => openUpgradeModal('Unlock advanced budget variance, habit velocity, and exportable executive reports with Bloom Club.')}
              className="w-full py-2.5 rounded-xl font-bold text-xs text-white shadow-xs flex items-center justify-center gap-2 transition-transform active:scale-98 bg-amber-500 hover:bg-amber-600"
            >
              <Crown className="w-4 h-4 fill-white" />
              <span>Unlock Full Executive Intelligence (Bloom Club)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
