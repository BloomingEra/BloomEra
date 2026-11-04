import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  DollarSign,
  Heart,
  Target,
  BookOpen,
  StickyNote,
  Bell,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Search,
  Pin,
  ExternalLink,
  Flame,
  Droplets,
  Moon,
  ChevronRight,
  Wallet,
  IndianRupee,
  Building,
  Smartphone,
  Banknote,
  ArrowLeftRight,
  Download,
  Filter,
  Check,
  Edit2,
  Calendar,
  AlertCircle,
  PiggyBank,
  CheckSquare,
  ShieldCheck,
  Lock,
  Unlock,
  Dumbbell,
  Wind,
  ShoppingBag,
  ListOrdered,
  Eye,
  EyeOff,
  History,
  Award,
  Sprout,
  Package,
  Film,
  Tv,
  Star,
  Layers,
  Sliders,
} from 'lucide-react';
import { useBloom } from '../context/BloomContext';
import {
  LifePillar,
  HabitItem,
  FinanceItem,
  DebtItem,
  GoalItem,
  NoteItem,
  InventoryItem,
  GoalScope,
  GoalCategory,
  EntertainmentItem,
  EntertainmentType,
} from '../types/bloom';
import { getHabitIcon, getFinanceCategoryIcon, getAccountTypeIcon } from '../utils/iconMap';
import { TransactionModal, DebtModal, HabitModal } from '../components/FinanceModals';
import { GoalModal, NoteModal, InventoryModal } from '../components/ModuleModals';
import { EntertainmentModal } from '../components/EntertainmentModal';
import { ManageModulesModal } from '../components/ManageModulesModal';
import { CollectionCustomizerModal } from '../components/CollectionCustomizerModal';
import { ThemeCardCorner, EmptyStateThemeDoodle } from '../components/ThemeDecorations';
import { ModuleIcon } from '../components/ModuleIcon';

type ActiveModule = 'habits' | 'finances' | 'wellness' | 'goals' | 'entertainment' | 'learning' | 'notes' | 'inventory';

interface ModulesScreenProps {
  onOpenQuickAction: () => void;
  initialModule?: string;
}

export const ModulesScreen: React.FC<ModulesScreenProps> = ({ onOpenQuickAction, initialModule }) => {
  const {
    state,
    currentTheme,
    todayStr,
    currency,
    setCurrency,
    toggleHabit,
    deleteHabit,
    deleteFinance,
    settleDebt,
    deleteDebt,
    toggleMilestone,
    toggleGoalCompleted,
    deleteGoal,
    addGratitude,
    logWater,
    logExercise,
    updateSleep,
    toggleRoutineItem,
    toggleCycleTracking,
    toggleWellnessPrivacy,
    updateLearningProgress,
    deleteEntertainment,
    editEntertainment,
    updateEntertainmentCollectionConfig,
    togglePinNote,
    deleteNote,
    toggleNoteListItem,
    deleteInventoryItem,
    exportFinanceCsv,
    totalAccountBalance,
    totalMonthlyExpense,
    totalMonthlyIncome,
    totalLentOutstanding,
    totalBorrowedOutstanding,
    playSound,
  } = useBloom();

  const palette = state.darkMode ? currentTheme.dark : currentTheme.light;
  const [activeModule, setActiveModule] = useState<ActiveModule>(
    (initialModule as ActiveModule) || 'habits'
  );

  useEffect(() => {
    if (initialModule) {
      setActiveModule(initialModule as ActiveModule);
    }
  }, [initialModule]);

  // Modals
  const [manageModulesModalOpen, setManageModulesModalOpen] = useState(false);
  const [collectionCustomizerOpen, setCollectionCustomizerOpen] = useState(false);
  const [entertainmentModalOpen, setEntertainmentModalOpen] = useState(false);
  const [editingEntertainmentItem, setEditingEntertainmentItem] = useState<EntertainmentItem | null>(null);
  const [entertainmentTypeFilter, setEntertainmentTypeFilter] = useState<EntertainmentType>('book');
  const [entertainmentStatusFilter, setEntertainmentStatusFilter] = useState<string>('all');
  const [entertainmentSearch, setEntertainmentSearch] = useState('');

  // Visible collections
  const visibleCollections = useMemo(() => {
    const all = state.entertainmentCollections && state.entertainmentCollections.length > 0
      ? state.entertainmentCollections
      : [
          { id: 'book', type: 'book', name: 'Books', iconName: 'BookOpen', enabled: true },
          { id: 'movie', type: 'movie', name: 'Movies', iconName: 'Film', enabled: true },
          { id: 'tv', type: 'tv', name: 'TV Shows & Series', iconName: 'Tv', enabled: true },
        ];
    const filtered = all.filter((c) => c.enabled !== false);
    return filtered.length > 0 ? filtered : all;
  }, [state.entertainmentCollections]);

  // Ensure selected tab is valid
  useEffect(() => {
    const isCurrentVisible = visibleCollections.some(
      (c) => (c.type || c.id) === entertainmentTypeFilter
    );
    if (!isCurrentVisible && visibleCollections.length > 0) {
      setEntertainmentTypeFilter((visibleCollections[0].type || visibleCollections[0].id) as EntertainmentType);
    }
  }, [visibleCollections, entertainmentTypeFilter]);

  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [debtModalOpen, setDebtModalOpen] = useState(false);
  const [habitModalOpen, setHabitModalOpen] = useState(false);
  const [habitToEdit, setHabitToEdit] = useState<HabitItem | null>(null);
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [inventoryModalOpen, setInventoryModalOpen] = useState(false);

  // Goals Tab state (Active vs History)
  const [goalsTab, setGoalsTab] = useState<'active' | 'completed'>('active');
  const [goalsScopeFilter, setGoalsScopeFilter] = useState<'all' | 'short-term' | 'long-term'>('all');

  // Notes Tab state
  const [noteTypeFilter, setNoteTypeFilter] = useState<'all' | 'note' | 'shopping' | 'checklist' | 'tobuy'>('all');
  const [notesSearch, setNotesSearch] = useState('');

  // Inventory filter
  const [inventoryCategory, setInventoryCategory] = useState<'all' | 'document' | 'subscription' | 'belonging' | 'warranty'>('all');

  // Finance filters
  const [financeSearch, setFinanceSearch] = useState('');
  const [financeTypeFilter, setFinanceTypeFilter] = useState<'all' | 'expense' | 'income' | 'transfer'>('all');

  // Gratitude input
  const [gratitudeInput, setGratitudeInput] = useState('');

  // Dynamically enabled and ordered module tabs
  const activeModuleTabs = useMemo(() => {
    const list = state.modulesConfig && state.modulesConfig.length > 0
      ? state.modulesConfig.filter((m) => m.enabled).sort((a, b) => a.order - b.order)
      : [
          { id: 'habits', name: 'Habit Tracker', iconName: 'Sprout' },
          { id: 'finances', name: 'Finance Manager', iconName: 'Coins' },
          { id: 'wellness', name: 'Wellness Tracker', iconName: 'Heart' },
          { id: 'goals', name: 'Goals & Growth', iconName: 'Target' },
          { id: 'entertainment', name: 'Entertainment', iconName: 'BookOpen' },
          { id: 'notes', name: 'Notes & Lists', iconName: 'StickyNote' },
          { id: 'inventory', name: 'Personal Inventory', iconName: 'Package' },
        ];

    return list.map((m) => ({
      id: (m.id === 'entertainment' ? 'entertainment' : m.id) as ActiveModule,
      label: m.name,
      iconName: m.iconName,
    }));
  }, [state.modulesConfig]);

  // History days for habits
  const historyDays = useMemo(() => {
    const list = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      const dayLetter = d.toLocaleDateString('en-US', { weekday: 'narrow' });
      const dayNum = d.getDate();
      list.push({ iso, dayLetter, dayNum });
    }
    return list;
  }, []);

  // Filtered finances
  const filteredFinances = useMemo(() => {
    return state.finances
      .filter((f) => {
        const matchesSearch =
          f.category.toLowerCase().includes(financeSearch.toLowerCase()) ||
          f.note.toLowerCase().includes(financeSearch.toLowerCase());
        const matchesType = financeTypeFilter === 'all' || f.type === financeTypeFilter;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [state.finances, financeSearch, financeTypeFilter]);

  // Filtered goals
  const filteredGoals = useMemo(() => {
    return state.goals
      .filter((g) => (goalsTab === 'active' ? !g.completed : g.completed))
      .filter((g) => goalsScopeFilter === 'all' || g.scope === goalsScopeFilter);
  }, [state.goals, goalsTab, goalsScopeFilter]);

  // Filtered notes
  const filteredNotes = useMemo(() => {
    return state.notes
      .filter((n) => noteTypeFilter === 'all' || n.type === noteTypeFilter)
      .filter(
        (n) =>
          n.title.toLowerCase().includes(notesSearch.toLowerCase()) ||
          n.content.toLowerCase().includes(notesSearch.toLowerCase())
      );
  }, [state.notes, noteTypeFilter, notesSearch]);

  return (
    <div className="flex-1 pb-24 p-4 space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Life Management Modules
          </span>
          <h2
            className={`text-xl font-medium tracking-tight flex items-center gap-2 ${currentTheme.fontFamily.fontClass}`}
            style={{ color: palette.text }}
          >
            Pillars & Records
            <ThemeCardCorner className="w-4 h-4 text-rose-400" />
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Manage Modules button */}
          <button
            onClick={() => {
              playSound('tap');
              setManageModulesModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all text-neutral-300 hover:text-white bg-neutral-800/60 border-neutral-700/60"
            title="Manage My Modules (Enable, disable, reorder)"
          >
            <Layers className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Modules</span>
          </button>

          {/* Currency selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-800/10 dark:bg-neutral-800/40 text-xs">
            <span className="text-[10px] text-neutral-400 pl-1.5 font-medium">Currency:</span>
            {['₹', '$', '€', '£'].map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-2 py-0.5 rounded-lg font-bold transition-all ${
                  currency === c ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Horizontal Module Selector Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {activeModuleTabs.map((tab) => {
          const isSelected = activeModule === tab.id || (activeModule === 'learning' && tab.id === 'entertainment');

          return (
            <button
              key={tab.id}
              onClick={() => {
                playSound('tap');
                setActiveModule(tab.id);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-medium whitespace-nowrap border transition-all ${
                isSelected ? 'font-semibold shadow-xs scale-102' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: isSelected ? palette.primary : palette.surface,
                borderColor: isSelected ? palette.primary : palette.cardBorder,
                color: isSelected ? palette.onPrimary : palette.text,
              }}
            >
              <ModuleIcon name={tab.iconName} className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* MODULE 1: HABIT TRACKER (SECTION 6) */}
      {/* ========================================================================= */}
      {activeModule === 'habits' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400 font-medium">
              {state.habits.length} Active Habits & Schedules
            </span>
            <button
              onClick={() => {
                setHabitToEdit(null);
                setHabitModalOpen(true);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl font-semibold text-white shadow-xs"
              style={{ backgroundColor: palette.primary }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Habit</span>
            </button>
          </div>

          {state.habits.length === 0 ? (
            <div
              className="p-8 rounded-3xl border text-center space-y-3"
              style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
            >
              <div
                className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-emerald-500"
                style={{ backgroundColor: palette.surfaceElevated }}
              >
                <Sprout className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold" style={{ color: palette.text }}>
                  No habits planted yet
                </h4>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                  Cultivate daily and weekly rituals. Track streaks and celebrate intentional milestones.
                </p>
              </div>
              <button
                onClick={() => {
                  setHabitToEdit(null);
                  setHabitModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white inline-flex items-center gap-1.5 shadow-xs"
                style={{ backgroundColor: palette.primary }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Plant First Habit</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {state.habits.map((habit) => {
                const isDoneToday = habit.completedDates.includes(todayStr);
                const HabitIcon = getHabitIcon(habit.iconName);
                const totalDaysTracked = 14;
                const completedInWindow = historyDays.filter((d) => habit.completedDates.includes(d.iso)).length;
                const ratePercent = Math.round((completedInWindow / totalDaysTracked) * 100);

              return (
                <div
                  key={habit.id}
                  className="p-4 rounded-3xl border space-y-3 transition-all group"
                  style={{
                    backgroundColor: palette.surface,
                    borderColor: isDoneToday ? palette.primaryContainer : palette.cardBorder,
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        onClick={() => toggleHabit(habit.id)}
                        className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 cursor-pointer transition-transform active:scale-90"
                        style={{
                          backgroundColor: isDoneToday ? palette.primary : palette.surfaceElevated,
                          color: isDoneToday ? palette.onPrimary : palette.textMuted,
                        }}
                        title="Click to check in today"
                      >
                        <HabitIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4
                            className={`text-xs font-semibold truncate ${
                              isDoneToday ? 'line-through opacity-70' : ''
                            }`}
                            style={{ color: palette.text }}
                          >
                            {habit.title}
                          </h4>
                          <span
                            className="text-[9px] font-medium px-2 py-0.5 rounded-full capitalize"
                            style={{ backgroundColor: palette.surfaceElevated, color: palette.textMuted }}
                          >
                            {habit.frequency || 'Daily'} · {habit.category}
                          </span>
                        </div>
                        {habit.notes && (
                          <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5 font-light">
                            {habit.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setHabitToEdit(habit);
                          setHabitModalOpen(true);
                        }}
                        className="p-1 text-neutral-400 hover:text-neutral-700"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteHabit(habit.id)}
                        className="p-1 text-neutral-400 hover:text-rose-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Habit Metrics Strip */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl" style={{ backgroundColor: palette.surfaceElevated }}>
                      <span className="text-[10px] text-neutral-400 block">Current Streak</span>
                      <span className="font-bold text-amber-500 font-mono tabular-nums flex items-center justify-center gap-0.5 mt-0.5">
                        <Flame className="w-3.5 h-3.5 fill-amber-500" />
                        {habit.streak} days
                      </span>
                    </div>
                    <div className="p-2 rounded-xl" style={{ backgroundColor: palette.surfaceElevated }}>
                      <span className="text-[10px] text-neutral-400 block">Best Streak</span>
                      <span className="font-bold font-mono tabular-nums mt-0.5" style={{ color: palette.text }}>
                        {habit.bestStreak} days
                      </span>
                    </div>
                    <div className="p-2 rounded-xl" style={{ backgroundColor: palette.surfaceElevated }}>
                      <span className="text-[10px] text-neutral-400 block">14-Day Rate</span>
                      <span className="font-bold font-mono tabular-nums mt-0.5" style={{ color: palette.primary }}>
                        {ratePercent}%
                      </span>
                    </div>
                  </div>

                  {/* 14-day completion calendar */}
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1.5 px-0.5">
                      <span>Interactive Completion History (Click any day to toggle/reset)</span>
                      <span>{completedInWindow} of 14 done</span>
                    </div>
                    <div className="grid grid-cols-14 gap-1">
                      {historyDays.map((d) => {
                        const isDone = habit.completedDates.includes(d.iso);
                        const isToday = d.iso === todayStr;

                        return (
                          <button
                            key={d.iso}
                            type="button"
                            onClick={() => toggleHabit(habit.id, d.iso)}
                            title={`${d.iso}: ${isDone ? 'Completed (click to reset)' : 'Missed (click to mark done)'}`}
                            className={`py-1.5 rounded-lg flex flex-col items-center justify-center transition-all ${
                              isDone
                                ? 'bg-emerald-500 text-white font-bold'
                                : 'bg-neutral-200/60 dark:bg-neutral-800 text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-700'
                            } ${isToday ? 'ring-1 ring-rose-400' : ''}`}
                          >
                            <span className="text-[8px] uppercase">{d.dayLetter}</span>
                            <span className="text-[9px] tabular-nums font-mono">{d.dayNum}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    )}

      {/* ========================================================================= */}
      {/* MODULE 2: PERSONAL FINANCE MANAGER (SECTION 7) */}
      {/* ========================================================================= */}
      {activeModule === 'finances' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => setTransactionModalOpen(true)}
              className="flex-1 py-2 px-3 rounded-2xl text-xs font-semibold text-white shadow-xs flex items-center justify-center gap-1.5"
              style={{ backgroundColor: palette.primary }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Transaction</span>
            </button>
            <button
              onClick={() => setDebtModalOpen(true)}
              className="py-2 px-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-1.5"
              style={{ borderColor: palette.outline, color: palette.text }}
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-400" />
              <span>Lending / Borrowing</span>
            </button>
            <button
              onClick={exportFinanceCsv}
              className="p-2 rounded-2xl border text-xs"
              style={{ borderColor: palette.outline, color: palette.text }}
              title="Export CSV"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>

          {/* Account Balances */}
          <div
            className="p-5 rounded-3xl border shadow-xs space-y-3"
            style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Accounts Breakdown
              </span>
              <span className="text-xs font-bold font-mono tabular-nums text-emerald-500">
                Net: {currency}{totalAccountBalance.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {state.accounts.map((acc) => {
                const AccIcon = getAccountTypeIcon(acc.type);
                return (
                  <div
                    key={acc.id}
                    className="p-3.5 rounded-2xl border flex items-center justify-between"
                    style={{ backgroundColor: palette.surfaceElevated, borderColor: palette.outline }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: palette.surface }}>
                        <AccIcon className="w-4 h-4" style={{ color: acc.color || palette.primary }} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold" style={{ color: palette.text }}>{acc.name}</p>
                        <p className="text-[10px] text-neutral-400">{acc.accountNumberOrUpi}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold font-mono tabular-nums" style={{ color: palette.text }}>
                      {currency}{acc.balance.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lending and Borrowing */}
          <div
            className="p-5 rounded-3xl border shadow-xs space-y-3"
            style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold" style={{ color: palette.text }}>
                Lending & Borrowing Ledger
              </h3>
              <button
                onClick={() => setDebtModalOpen(true)}
                className="text-xs font-medium hover:underline"
                style={{ color: palette.primary }}
              >
                + Add Loan
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">
                  Who Owes Me
                </span>
                <p className="text-base font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {currency}{totalLentOutstanding.toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 block">
                  Whom I Owe
                </span>
                <p className="text-base font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400 mt-0.5">
                  {currency}{totalBorrowedOutstanding.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              {state.debts.length === 0 ? (
                <div
                  className="p-4 rounded-2xl border text-center text-xs text-neutral-400"
                  style={{ backgroundColor: palette.surfaceElevated, borderColor: palette.outline }}
                >
                  Zero outstanding loans or borrowings. All ledgers are settled.
                </div>
              ) : (
                state.debts.map((debt) => (
                  <div
                    key={debt.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${debt.settled ? 'opacity-50' : ''}`}
                    style={{ backgroundColor: palette.surfaceElevated, borderColor: palette.outline }}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold" style={{ color: palette.text }}>
                          {debt.counterpartyName}
                        </span>
                        <span
                          className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md ${
                            debt.type === 'lent' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300' : 'bg-amber-500/20 text-amber-600 dark:text-amber-300'
                          }`}
                        >
                          {debt.type === 'lent' ? 'Owes You' : 'You Owe'}
                        </span>
                        {debt.settled && <span className="text-[9px] text-neutral-400 font-semibold">Settled</span>}
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        {debt.notes} · Due: {debt.dueDate || 'Flexible'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono tabular-nums" style={{ color: palette.text }}>
                        {currency}{debt.amount.toLocaleString()}
                      </span>
                      {!debt.settled ? (
                        <button
                          onClick={() => settleDebt(debt.id)}
                          className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-emerald-600 text-white"
                        >
                          Settle
                        </button>
                      ) : (
                        <button onClick={() => deleteDebt(debt.id)} className="p-1 text-neutral-400 hover:text-rose-500">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Transaction History & Ledger */}
          <div
            className="p-5 rounded-3xl border shadow-xs space-y-3.5"
            style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold" style={{ color: palette.text }}>
                  Transaction History & Ledger
                </h3>
                <p className="text-[10px] text-neutral-400">
                  {filteredFinances.length} entries recorded
                </p>
              </div>
              <button
                onClick={() => setTransactionModalOpen(true)}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-xl text-white shadow-xs flex items-center gap-1"
                style={{ backgroundColor: palette.primary }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log</span>
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div
                className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs"
                style={{ backgroundColor: palette.surfaceElevated, borderColor: palette.outline }}
              >
                <Search className="w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search category, notes..."
                  value={financeSearch}
                  onChange={(e) => setFinanceSearch(e.target.value)}
                  className="w-full bg-transparent outline-none"
                  style={{ color: palette.text }}
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
                {(['all', 'expense', 'income', 'transfer'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFinanceTypeFilter(type)}
                    className={`px-2.5 py-1 rounded-xl border capitalize whitespace-nowrap transition-all ${
                      financeTypeFilter === type ? 'font-bold shadow-2xs' : 'opacity-60'
                    }`}
                    style={{
                      backgroundColor: financeTypeFilter === type ? palette.primary : palette.surfaceElevated,
                      borderColor: palette.outline,
                      color: financeTypeFilter === type ? palette.onPrimary : palette.text,
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            {filteredFinances.length === 0 ? (
              <div
                className="p-6 rounded-2xl border text-center text-xs text-neutral-400"
                style={{ borderColor: palette.outline }}
              >
                No transactions match your search or filter.
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                {filteredFinances.map((item) => {
                  const CatIcon = getFinanceCategoryIcon(item.category);
                  const isExpense = item.type === 'expense';
                  const isIncome = item.type === 'income';

                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-2xl border flex items-center justify-between gap-3 group"
                      style={{ backgroundColor: palette.surfaceElevated, borderColor: palette.outline }}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: palette.surface }}
                        >
                          <CatIcon className="w-4 h-4 text-neutral-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold truncate" style={{ color: palette.text }}>
                            {item.note || item.category}
                          </p>
                          <p className="text-[10px] text-neutral-400">
                            {item.date} · {item.category}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-xs font-bold font-mono tabular-nums ${
                            isIncome ? 'text-emerald-500' : isExpense ? 'text-rose-500' : 'text-sky-500'
                          }`}
                        >
                          {isIncome ? '+' : isExpense ? '-' : ''}
                          {currency}
                          {item.amount.toLocaleString()}
                        </span>
                        <button
                          onClick={() => deleteFinance(item.id)}
                          className="p-1 text-neutral-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 3: WELLNESS TRACKER (SECTION 10) */}
      {/* ========================================================================= */}
      {activeModule === 'wellness' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-semibold" style={{ color: palette.text }}>
                Holistic Health & Daily Wellness
              </h3>
            </div>
            <button
              onClick={toggleWellnessPrivacy}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] text-neutral-400 hover:text-neutral-200"
              style={{ borderColor: palette.outline }}
              title="Keep wellness tracking private"
            >
              {state.wellness.wellnessPrivacyLocked ? <Lock className="w-3 h-3 text-rose-400" /> : <Unlock className="w-3 h-3" />}
              <span>{state.wellness.wellnessPrivacyLocked ? 'Private Mode' : 'Unlocked'}</span>
            </button>
          </div>

          {state.wellness.wellnessPrivacyLocked ? (
            <div
              className="p-8 rounded-3xl border text-center space-y-2"
              style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
            >
              <Lock className="w-8 h-8 mx-auto text-neutral-400 opacity-60" />
              <h4 className="text-sm font-semibold" style={{ color: palette.text }}>
                Wellness Log is Private
              </h4>
              <p className="text-xs text-neutral-400">
                Your cycle, rest, and health entries are protected for discreet viewing.
              </p>
              <button
                onClick={toggleWellnessPrivacy}
                className="mt-2 px-4 py-1.5 rounded-xl text-xs font-semibold text-white"
                style={{ backgroundColor: palette.primary }}
              >
                Unlock Wellness View
              </button>
            </div>
          ) : (
            <>
              {/* Movement & Exercise Pod */}
              <div
                className="p-5 rounded-3xl border shadow-xs space-y-3"
                style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="w-4 h-4 text-rose-400" />
                    <span className="text-xs font-semibold" style={{ color: palette.text }}>
                      Movement & Exercise
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold tabular-nums text-rose-500">
                    {state.wellness.exerciseMinutesToday} mins today
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400">
                    Active: {state.wellness.exerciseTypeToday || 'Yoga & Stretching'}
                  </span>
                  <div className="flex items-center gap-1.5 ml-auto">
                    {[
                      { type: 'Yoga Flow', mins: 20 },
                      { type: 'Pilates', mins: 30 },
                      { type: 'Brisk Walk', mins: 45 },
                    ].map((w) => (
                      <button
                        key={w.type}
                        onClick={() => logExercise(w.mins, w.type)}
                        className="px-2.5 py-1 rounded-xl border text-[10px] font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800"
                        style={{ borderColor: palette.outline, color: palette.text }}
                      >
                        +{w.mins}m {w.type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sleep & Rest Log */}
              <div
                className="p-5 rounded-3xl border shadow-xs space-y-2"
                style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-semibold" style={{ color: palette.text }}>
                      Sleep Hygiene
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold tabular-nums text-indigo-400">
                    {state.wellness.sleepHours}h ({state.wellness.sleepQuality || 'restful'})
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>Bedtime: {state.wellness.sleepBedtime || '23:15'} · Wake: {state.wellness.sleepWakeTime || '07:05'}</span>
                  <div className="flex items-center gap-1">
                    {(['restful', 'average', 'poor'] as const).map((q) => (
                      <button
                        key={q}
                        onClick={() => updateSleep(state.wellness.sleepHours, q)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] capitalize ${
                          state.wellness.sleepQuality === q ? 'bg-indigo-500 text-white font-bold' : 'text-neutral-400'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Daily Routines Checklist */}
              <div
                className="p-5 rounded-3xl border shadow-xs space-y-3"
                style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
              >
                <h4 className="text-xs font-semibold" style={{ color: palette.text }}>
                  Daily Wellness Routines
                </h4>
                <div className="space-y-1.5">
                  {state.wellness.dailyRoutines.map((routine) => (
                    <div
                      key={routine.id}
                      onClick={() => toggleRoutineItem(routine.id)}
                      className="p-2.5 rounded-xl border flex items-center justify-between cursor-pointer select-none"
                      style={{ backgroundColor: palette.surfaceElevated, borderColor: palette.outline }}
                    >
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="w-4 h-4 rounded flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: routine.completed ? palette.primary : 'transparent',
                            color: routine.completed ? palette.onPrimary : 'transparent',
                          }}
                        >
                          {routine.completed && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>
                        <span
                          className={`text-xs ${routine.completed ? 'line-through opacity-60' : ''}`}
                          style={{ color: palette.text }}
                        >
                          {routine.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-neutral-400 capitalize">{routine.timeOfDay}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional Menstrual Cycle Tracking */}
              <div
                className="p-5 rounded-3xl border shadow-xs space-y-3"
                style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <div>
                      <h4 className="text-xs font-semibold" style={{ color: palette.text }}>
                        Menstrual Cycle Tracking (Optional & Private)
                      </h4>
                      <p className="text-[10px] text-neutral-400">
                        {state.wellness.cycleTrackingEnabled ? 'Enabled · Private' : 'Disabled'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggleCycleTracking}
                    className="px-3 py-1 rounded-xl text-xs font-semibold border"
                    style={{
                      backgroundColor: state.wellness.cycleTrackingEnabled ? palette.primary : palette.surfaceElevated,
                      borderColor: palette.outline,
                      color: state.wellness.cycleTrackingEnabled ? palette.onPrimary : palette.text,
                    }}
                  >
                    {state.wellness.cycleTrackingEnabled ? 'Active' : 'Turn On'}
                  </button>
                </div>

                {state.wellness.cycleTrackingEnabled && (
                  <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-rose-500">Current Phase: Luteal Phase</span>
                      <span className="font-mono tabular-nums text-rose-400">Cycle Day 21 / 28</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      Optimal phase for gentle restorative movement, magnesium-rich nourishment, and restful sleep.
                    </p>
                  </div>
                )}
              </div>

              {/* Gratitude Journal */}
              <div
                className="p-5 rounded-3xl border shadow-xs space-y-3"
                style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
              >
                <h4 className="text-xs font-semibold" style={{ color: palette.text }}>
                  Gratitude Reflections
                </h4>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addGratitude(gratitudeInput);
                    setGratitudeInput('');
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    placeholder="Note a moment of calm..."
                    value={gratitudeInput}
                    onChange={(e) => setGratitudeInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl border text-xs outline-none"
                    style={{ backgroundColor: palette.surfaceElevated, borderColor: palette.outline, color: palette.text }}
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white"
                    style={{ backgroundColor: palette.primary }}
                  >
                    Log
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 4: GOALS AND PERSONAL GROWTH (SECTION 9) */}
      {/* ========================================================================= */}
      {activeModule === 'goals' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-800/10 dark:bg-neutral-800/40 text-xs">
              <button
                onClick={() => setGoalsTab('active')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  goalsTab === 'active' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-400'
                }`}
              >
                Active Goals ({state.goals.filter((g) => !g.completed).length})
              </button>
              <button
                onClick={() => setGoalsTab('completed')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  goalsTab === 'completed' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-400'
                }`}
              >
                History ({state.goals.filter((g) => g.completed).length})
              </button>
            </div>

            <button
              onClick={() => setGoalModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-white shadow-xs"
              style={{ backgroundColor: palette.primary }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Goal</span>
            </button>
          </div>

          {/* Scope filter */}
          <div className="flex items-center gap-1.5 text-xs">
            {(['all', 'short-term', 'long-term'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setGoalsScopeFilter(s)}
                className={`px-2.5 py-1 rounded-xl border capitalize ${
                  goalsScopeFilter === s ? 'font-bold shadow-2xs' : 'opacity-60'
                }`}
                style={{
                  backgroundColor: goalsScopeFilter === s ? palette.primary : palette.surface,
                  borderColor: palette.outline,
                  color: goalsScopeFilter === s ? palette.onPrimary : palette.text,
                }}
              >
                {s === 'all' ? 'All Scopes' : s}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredGoals.length === 0 ? (
              <div
                className="p-8 rounded-3xl border text-center space-y-3"
                style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
              >
                <div
                  className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-rose-400"
                  style={{ backgroundColor: palette.surfaceElevated }}
                >
                  <Target className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold" style={{ color: palette.text }}>
                    {goalsTab === 'active' ? 'No active goals' : 'No completed goals yet'}
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                    {goalsTab === 'active'
                      ? 'Set meaningful milestones across career, learning, and wellness.'
                      : 'Accomplished goals will appear here as your intentional journey unfolds.'}
                  </p>
                </div>
                {goalsTab === 'active' && (
                  <button
                    onClick={() => setGoalModalOpen(true)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white inline-flex items-center gap-1.5 shadow-xs"
                    style={{ backgroundColor: palette.primary }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Goal</span>
                  </button>
                )}
              </div>
            ) : (
              filteredGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="p-5 rounded-3xl border shadow-xs space-y-3"
                  style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold text-neutral-400 uppercase">
                          {goal.category} · {goal.scope}
                        </span>
                        {goal.completed && (
                          <span className="text-[9px] font-bold text-emerald-500 uppercase px-1.5 py-0.5 rounded bg-emerald-500/10">
                            Completed
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-semibold mt-0.5" style={{ color: palette.text }}>
                        {goal.title}
                      </h4>
                      <p className="text-[10px] text-neutral-400">Target Deadline: {goal.targetDate}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold font-mono tabular-nums" style={{ color: palette.primary }}>
                        {goal.progressPercent}%
                      </span>
                      <button
                        onClick={() => toggleGoalCompleted(goal.id)}
                        className={`p-1.5 rounded-xl border text-xs ${
                          goal.completed ? 'text-emerald-500 border-emerald-500/30' : 'text-neutral-400'
                        }`}
                        title={goal.completed ? 'Reopen goal' : 'Mark goal complete'}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteGoal(goal.id)} className="p-1 text-neutral-400 hover:text-rose-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: palette.surfaceElevated }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${goal.progressPercent}%`, backgroundColor: palette.primary }}
                    />
                  </div>

                  {/* Milestones list */}
                  <div className="space-y-1.5 pt-1">
                    {goal.milestones.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => toggleMilestone(goal.id, m.id)}
                        className="flex items-center gap-2 text-xs cursor-pointer select-none"
                      >
                        <button
                          type="button"
                          className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                            m.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-neutral-300 dark:border-neutral-700'
                          }`}
                        >
                          {m.completed && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>
                        <span className={`truncate ${m.completed ? 'line-through opacity-60' : ''}`} style={{ color: palette.text }}>
                          {m.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 5: NOTES AND LISTS (SECTION 11) */}
      {/* ========================================================================= */}
      {activeModule === 'notes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 mr-2">
              <div
                className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs"
                style={{ backgroundColor: palette.surface, borderColor: palette.outline }}
              >
                <Search className="w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search notes, checklists..."
                  value={notesSearch}
                  onChange={(e) => setNotesSearch(e.target.value)}
                  className="w-full bg-transparent outline-none"
                  style={{ color: palette.text }}
                />
              </div>
            </div>
            <button
              onClick={() => setNoteModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-white shadow-xs"
              style={{ backgroundColor: palette.primary }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New List / Note</span>
            </button>
          </div>

          {/* Type filters */}
          <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'All Notes' },
              { id: 'shopping', label: 'Shopping Lists' },
              { id: 'checklist', label: 'Checklists' },
              { id: 'tobuy', label: 'To-Buy Lists' },
              { id: 'note', label: 'Freeform Notes' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setNoteTypeFilter(t.id as any)}
                className={`px-3 py-1 rounded-xl border whitespace-nowrap ${
                  noteTypeFilter === t.id ? 'font-bold shadow-2xs' : 'opacity-60'
                }`}
                style={{
                  backgroundColor: noteTypeFilter === t.id ? palette.primary : palette.surface,
                  borderColor: palette.outline,
                  color: noteTypeFilter === t.id ? palette.onPrimary : palette.text,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredNotes.length === 0 ? (
              <div
                className="p-8 rounded-3xl border text-center space-y-3"
                style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
              >
                <div
                  className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-purple-400"
                  style={{ backgroundColor: palette.surfaceElevated }}
                >
                  <StickyNote className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold" style={{ color: palette.text }}>
                    No notes or lists found
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                    Capture quick thoughts, shopping items, checklists, or personal reminders.
                  </p>
                </div>
                <button
                  onClick={() => setNoteModalOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white inline-flex items-center gap-1.5 shadow-xs"
                  style={{ backgroundColor: palette.primary }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Note / Checklist</span>
                </button>
              </div>
            ) : (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-5 rounded-3xl border shadow-xs space-y-3 group"
                  style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          {note.type === 'tobuy' ? 'To-Buy' : note.type}
                        </span>
                        {note.pinned && <Pin className="w-3 h-3 text-rose-500 fill-rose-500" />}
                      </div>
                      <h4 className="text-sm font-semibold mt-0.5" style={{ color: palette.text }}>
                        {note.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1">
                      <button onClick={() => togglePinNote(note.id)} className="p-1 text-neutral-400 hover:text-neutral-700">
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteNote(note.id)} className="p-1 text-neutral-400 hover:text-rose-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Interactive Checklist / Shopping list items */}
                  {note.listItems && note.listItems.length > 0 ? (
                    <div className="space-y-1.5 pt-1">
                      {note.listItems.map((li) => (
                        <div
                          key={li.id}
                          onClick={() => toggleNoteListItem(note.id, li.id)}
                          className="flex items-center justify-between text-xs py-1 px-2 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <button
                              type="button"
                              className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                                li.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-neutral-300 dark:border-neutral-700'
                              }`}
                            >
                              {li.done && <Check className="w-3 h-3 stroke-[3]" />}
                            </button>
                            <span className={`truncate ${li.done ? 'line-through opacity-50' : ''}`} style={{ color: palette.text }}>
                              {li.text}
                            </span>
                          </div>
                          {li.price && (
                            <span className="text-[11px] font-mono tabular-nums text-neutral-400 ml-2">
                              {currency}{li.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs leading-relaxed whitespace-pre-line font-light" style={{ color: palette.text }}>
                      {note.content}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[10px] text-neutral-400">
                    <span>{note.updatedAt}</span>
                    <div className="flex items-center gap-1">
                      {note.tags.map((t) => (
                        <span key={t}>#{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 6: PERSONAL INVENTORY & VAULT (SECTION 12) */}
      {/* ========================================================================= */}
      {activeModule === 'inventory' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold" style={{ color: palette.text }}>
                Personal Vault & Belongings
              </h3>
              <p className="text-[11px] text-neutral-400">
                Documents, expiry alerts, subscriptions & warranties (No unencrypted secrets)
              </p>
            </div>
            <button
              onClick={() => setInventoryModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-white shadow-xs"
              style={{ backgroundColor: palette.primary }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Vault</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {state.inventory.length === 0 ? (
              <div
                className="p-8 rounded-3xl border text-center space-y-3"
                style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
              >
                <div
                  className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-amber-500"
                  style={{ backgroundColor: palette.surfaceElevated }}
                >
                  <Package className="w-6 h-6 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold" style={{ color: palette.text }}>
                    Personal vault is empty
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                    Keep track of subscription renewals, warranties, document expiries, and precious belongings.
                  </p>
                </div>
                <button
                  onClick={() => setInventoryModalOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white inline-flex items-center gap-1.5 shadow-xs"
                  style={{ backgroundColor: palette.primary }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Vault</span>
                </button>
              </div>
            ) : (
              state.inventory.map((item) => {
              const isExpired = item.status === 'expired' || item.expiryOrRenewalDate < todayStr;
              const isExpiringSoon = item.status === 'expiring_soon';

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-3xl border shadow-xs space-y-2 group"
                  style={{
                    backgroundColor: palette.surface,
                    borderColor: isExpired ? '#FCA5A5' : isExpiringSoon ? '#FCD34D' : palette.cardBorder,
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                          {item.category}
                        </span>
                        {isExpired ? (
                          <span className="text-[9px] font-bold text-rose-500 uppercase px-1.5 py-0.5 rounded bg-rose-500/10">
                            Expired
                          </span>
                        ) : isExpiringSoon ? (
                          <span className="text-[9px] font-bold text-amber-500 uppercase px-1.5 py-0.5 rounded bg-amber-500/10">
                            Expiring Soon
                          </span>
                        ) : (
                          <span className="text-[9px] font-semibold text-emerald-500 uppercase px-1.5 py-0.5 rounded bg-emerald-500/10">
                            Valid / Active
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-semibold mt-0.5" style={{ color: palette.text }}>
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-neutral-400">
                        {item.providerOrBrand} · Expiry/Renewal: {item.expiryOrRenewalDate}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.costOrValue && (
                        <span className="text-xs font-mono font-bold tabular-nums" style={{ color: palette.text }}>
                          {currency}{item.costOrValue.toLocaleString()}
                        </span>
                      )}
                      <button onClick={() => deleteInventoryItem(item.id)} className="p-1 text-neutral-400 hover:text-rose-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {item.maskedRefNumber && (
                    <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 text-[11px] font-mono flex items-center justify-between">
                      <span className="text-neutral-400">Masked Reference:</span>
                      <span className="font-bold text-neutral-700 dark:text-neutral-200">{item.maskedRefNumber}</span>
                    </div>
                  )}

                  {item.notes && (
                    <p className="text-[11px] text-neutral-400 line-clamp-1 italic">
                      "{item.notes}"
                    </p>
                  )}
                </div>
              );
            }))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODULE 7: BOOKS & ENTERTAINMENT TRACKER */}
      {/* ========================================================================= */}
      {(activeModule === 'entertainment' || activeModule === 'learning') && (
        <div className="space-y-4">
          {/* Header & Add Button */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: palette.text }}>
                <span>Entertainment & Media</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 font-bold">
                  {(state.entertainment || []).length} Recorded
                </span>
              </h3>
              <p className="text-[11px] text-neutral-400">
                Track your reading journeys, cinema watches & TV series
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  playSound('tap');
                  setCollectionCustomizerOpen(true);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold hover:opacity-85 transition-all"
                style={{
                  backgroundColor: palette.surfaceElevated,
                  borderColor: palette.outline,
                  color: palette.text,
                }}
                title="Customise media collections"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Customise</span>
              </button>
              <button
                onClick={() => {
                  setEditingEntertainmentItem(null);
                  setEntertainmentModalOpen(true);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-white shadow-xs active:scale-95 transition-all"
                style={{ backgroundColor: palette.primary }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Media</span>
              </button>
            </div>
          </div>

          {/* Collection Switcher Pills */}
          <div className="flex items-center gap-2">
            <div
              className="flex-1 grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${Math.max(1, visibleCollections.length)}, minmax(0, 1fr))`,
              }}
            >
              {visibleCollections.map((coll) => {
                const collType = (coll.type || coll.id) as EntertainmentType;
                const count = (state.entertainment || []).filter((e) => e.type === collType).length;
                const isSelected = entertainmentTypeFilter === collType;
                return (
                  <button
                    key={collType}
                    type="button"
                    onClick={() => {
                      playSound('tap');
                      setEntertainmentTypeFilter(collType);
                      setEntertainmentStatusFilter('all');
                    }}
                    className={`p-2.5 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'border-rose-400/80 shadow-xs'
                        : 'border-neutral-200 dark:border-neutral-800 opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: isSelected ? palette.surfaceElevated : palette.surface,
                    }}
                  >
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold" style={{ color: palette.text }}>
                      <ModuleIcon
                        name={coll.iconName || (collType === 'book' ? 'BookOpen' : collType === 'movie' ? 'Film' : 'Tv')}
                        className="w-3.5 h-3.5"
                      />
                      <span className="truncate">{coll.name}</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 font-medium">
                      {count} {count === 1 ? 'entry' : 'entries'}
                    </span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => {
                playSound('tap');
                setCollectionCustomizerOpen(true);
              }}
              className="p-3 rounded-2xl border flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
              style={{
                backgroundColor: palette.surface,
                borderColor: palette.cardBorder,
              }}
              title="Customise Collections"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>

          {/* Search & Status Filters */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
              <input
                type="text"
                placeholder={`Search ${entertainmentTypeFilter === 'book' ? 'books or authors' : 'titles or genres'}...`}
                value={entertainmentSearch}
                onChange={(e) => setEntertainmentSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-hidden"
                style={{
                  backgroundColor: palette.surface,
                  borderColor: palette.outline,
                  color: palette.text,
                }}
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              {['all', 'in_progress', 'completed', 'want', 'on_hold'].map((stKey) => {
                let label = 'All';
                if (stKey === 'in_progress') label = entertainmentTypeFilter === 'book' ? 'Reading' : 'Watching';
                if (stKey === 'completed') label = entertainmentTypeFilter === 'movie' ? 'Watched' : 'Completed';
                if (stKey === 'want') label = entertainmentTypeFilter === 'book' ? 'Want to Read' : 'Want to Watch';
                if (stKey === 'on_hold') label = 'On Hold';

                const isSelected = entertainmentStatusFilter === stKey;
                return (
                  <button
                    key={stKey}
                    onClick={() => setEntertainmentStatusFilter(stKey)}
                    className={`px-2.5 py-1 rounded-lg border font-medium whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-rose-500/15 border-rose-500 text-rose-400 font-semibold'
                        : 'border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Media Items List */}
          <div className="space-y-3">
            {(() => {
              const filtered = (state.entertainment || [])
                .filter((e) => e.type === entertainmentTypeFilter)
                .filter((e) => {
                  if (entertainmentStatusFilter === 'all') return true;
                  if (entertainmentStatusFilter === 'in_progress') return e.status === 'reading' || e.status === 'watching';
                  if (entertainmentStatusFilter === 'completed') return e.status === 'completed' || e.status === 'watched';
                  if (entertainmentStatusFilter === 'want') return e.status === 'want_to_read' || e.status === 'want_to_watch';
                  if (entertainmentStatusFilter === 'on_hold') return e.status === 'on_hold';
                  return true;
                })
                .filter((e) => {
                  if (!entertainmentSearch.trim()) return true;
                  const q = entertainmentSearch.toLowerCase();
                  return (
                    e.title.toLowerCase().includes(q) ||
                    (e.author && e.author.toLowerCase().includes(q)) ||
                    (e.genre && e.genre.toLowerCase().includes(q)) ||
                    (e.notes && e.notes.toLowerCase().includes(q))
                  );
                });

              if (filtered.length === 0) {
                return (
                  <div
                    className="p-8 rounded-3xl border text-center space-y-3"
                    style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
                  >
                    <EmptyStateThemeDoodle className="w-14 h-14" />
                    <div>
                      <h4 className="text-sm font-semibold" style={{ color: palette.text }}>
                        No {entertainmentTypeFilter === 'book' ? 'books' : entertainmentTypeFilter === 'movie' ? 'movies' : 'TV shows'} found
                      </h4>
                      <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                        Keep track of stories, cinema masterpieces, and binge-worthy series in your personal collection.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingEntertainmentItem(null);
                        setEntertainmentModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-white inline-flex items-center gap-1.5 shadow-xs"
                      style={{ backgroundColor: palette.primary }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Entry</span>
                    </button>
                  </div>
                );
              }

              return filtered.map((item) => {
                const isFinished = item.status === 'completed' || item.status === 'watched';
                const isInProgress = item.status === 'reading' || item.status === 'watching';

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-3xl border shadow-xs space-y-2.5 transition-all relative overflow-hidden"
                    style={{
                      backgroundColor: palette.surface,
                      borderColor: palette.cardBorder,
                    }}
                  >
                    {/* Left Pastel Spine Accent */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1.5"
                      style={{ backgroundColor: item.coverColor || palette.primary }}
                    />

                    <div className="flex items-start justify-between gap-3 pl-1">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span
                            className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              isFinished
                                ? 'bg-emerald-500/15 text-emerald-500'
                                : isInProgress
                                ? 'bg-amber-500/15 text-amber-500'
                                : 'bg-neutral-500/15 text-neutral-400'
                            }`}
                          >
                            {item.status.replace(/_/g, ' ')}
                          </span>
                          {item.genre && (
                            <span className="text-[10px] text-neutral-400 uppercase tracking-wider">
                              · {item.genre}
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold tracking-tight" style={{ color: palette.text }}>
                          {item.title}
                        </h4>

                        {item.author && (
                          <p className="text-[11px] text-neutral-400 font-medium">by {item.author}</p>
                        )}

                        {item.type === 'tv' && item.currentSeason && (
                          <div className="flex items-center gap-2 text-[11px] text-purple-400 font-semibold mt-1">
                            <span>
                              Season {item.currentSeason} · Ep {item.currentEpisode || 1}
                            </span>
                            {item.totalSeasons && (
                              <span className="text-[10px] text-neutral-400 font-normal">
                                (of {item.totalSeasons} seasons)
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                editEntertainment(item.id, {
                                  currentEpisode: (item.currentEpisode || 1) + 1,
                                });
                              }}
                              className="px-2 py-0.5 rounded-md bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-[10px] active:scale-95"
                              title="Quick +1 Episode"
                            >
                              +1 Ep
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Right: Rating & Edit/Delete actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.rating && item.rating > 0 && (
                          <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-lg bg-amber-400/10 text-amber-400 text-xs font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{item.rating}</span>
                          </div>
                        )}
                        <button
                          onClick={() => {
                            setEditingEntertainmentItem(item);
                            setEntertainmentModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
                          title="Edit Media"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteEntertainment(item.id)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-rose-500/10"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Dates Logged */}
                    {(item.startDate || item.completionDate) && (
                      <div className="flex items-center gap-3 text-[10px] text-neutral-400 pl-1">
                        {item.startDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-neutral-500" />
                            <span>Started: {item.startDate}</span>
                          </span>
                        )}
                        {item.completionDate && (
                          <span>· Completed: {item.completionDate}</span>
                        )}
                      </div>
                    )}

                    {/* Notes block */}
                    {item.notes && (
                      <blockquote
                        className="p-2.5 rounded-2xl text-[11px] italic font-serif-bloom text-neutral-300 border-l-2 ml-1"
                        style={{
                          backgroundColor: palette.surfaceElevated,
                          borderColor: item.coverColor || palette.primary,
                        }}
                      >
                        "{item.notes}"
                      </blockquote>
                    )}
                  </div>
                );
              });
            })()}
          </div>
        </div>
      )}

      {/* Modals */}
      <TransactionModal
        isOpen={transactionModalOpen}
        onClose={() => setTransactionModalOpen(false)}
      />
      <DebtModal
        isOpen={debtModalOpen}
        onClose={() => setDebtModalOpen(false)}
      />
      <HabitModal
        isOpen={habitModalOpen}
        habitToEdit={habitToEdit}
        onClose={() => setHabitModalOpen(false)}
      />
      <GoalModal
        isOpen={goalModalOpen}
        onClose={() => setGoalModalOpen(false)}
      />
      <NoteModal
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
      />
      <InventoryModal
        isOpen={inventoryModalOpen}
        onClose={() => setInventoryModalOpen(false)}
      />
      <EntertainmentModal
        isOpen={entertainmentModalOpen}
        defaultType={entertainmentTypeFilter}
        editingItem={editingEntertainmentItem}
        onClose={() => {
          setEntertainmentModalOpen(false);
          setEditingEntertainmentItem(null);
        }}
      />
      <ManageModulesModal
        isOpen={manageModulesModalOpen}
        onClose={() => setManageModulesModalOpen(false)}
      />
      <CollectionCustomizerModal
        isOpen={collectionCustomizerOpen}
        onClose={() => setCollectionCustomizerOpen(false)}
      />
    </div>
  );
};
