import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  AppState,
  ThemeId,
  MoodType,
  HabitItem,
  TaskItem,
  CalendarEventItem,
  FinanceItem,
  FinanceAccount,
  DebtItem,
  CategoryBudget,
  GoalItem,
  GoalScope,
  GoalCategory,
  LearningItem,
  NoteItem,
  NoteType,
  NoteListItem,
  InventoryItem,
  ReminderItem,
  DailyRoutineItem,
  SubscriptionTier,
  SubscriptionInfo,
  LanguageCode,
  UserProfile,
  NotificationPreferences,
  PrivacyPreferences,
  SubscriptionPricingConfig,
  EntertainmentItem,
  EntertainmentType,
  EntertainmentCollectionConfig,
  ModuleConfig,
  DashboardCardConfig,
} from '../types/bloom';
import { INITIAL_APP_STATE } from '../data/seedData';
import { THEMES, ThemeConfig } from '../constants/themes';
import { sound } from '../utils/audio';

const STORAGE_KEY = 'bloomera_app_state_v3';

interface BloomContextType {
  state: AppState;
  currentTheme: ThemeConfig;
  subscription: SubscriptionInfo;
  isPremium: boolean;
  setSubscriptionTier: (tier: SubscriptionTier) => void;
  // Theme & Previewing
  previewThemeId: ThemeId | null;
  previewTheme: (themeId: ThemeId | null) => void;
  applyTheme: (themeId: ThemeId) => void;
  setTheme: (theme: ThemeId) => void;
  // Upgrade Modal
  upgradeModalOpen: boolean;
  upgradeModalReason: string;
  openUpgradeModal: (reason?: string) => void;
  closeUpgradeModal: () => void;
  // Language & User Profile
  setLanguage: (lang: LanguageCode) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  // Account Management
  registerUserAccount: (email: string, phone: string, name?: string) => void;
  deactivateUserAccount: () => void;
  exportMonthlyReportPdf: () => void;
  // Notification & Privacy Preferences
  updateNotificationPreferences: (prefs: Partial<NotificationPreferences>) => void;
  updatePrivacyPreferences: (prefs: Partial<PrivacyPreferences>) => void;
  updatePricingConfig: (config: Partial<SubscriptionPricingConfig>) => void;
  // Metrics
  bloomScore: number;
  completedHabitsToday: number;
  totalHabitsToday: number;
  todayStr: string;
  currency: string;
  setCurrency: (currency: string) => void;
  // Sound
  playSound: (type: 'tap' | 'bloom' | 'drop') => void;
  // View & Mode
  toggleDarkMode: () => void;
  toggleSound: () => void;
  setViewMode: (mode: 'phone' | 'canvas') => void;
  // Dashboard Customization
  reorderDashboardCards: (fromIndex: number, toIndex: number) => void;
  toggleDashboardCardVisibility: (cardId: string) => void;
  setDashboardCardSize: (cardId: string, size: 'compact' | 'full') => void;
  addDashboardWidget: (widgetId: string) => void;
  removeDashboardWidget: (widgetId: string) => void;
  resetDashboardToDefault: () => void;
  // Modular Customization
  toggleModuleEnabled: (moduleId: string) => void;
  toggleModuleHomeShortcut: (moduleId: string) => void;
  reorderModules: (fromIndex: number, toIndex: number) => void;
  resetModulesToDefault: () => void;
  // Entertainment & Media Tracker
  addEntertainment: (item: Omit<EntertainmentItem, 'id'>) => void;
  editEntertainment: (id: string, updates: Partial<EntertainmentItem>) => void;
  deleteEntertainment: (id: string) => void;
  updateEntertainmentCollectionConfig: (type: EntertainmentType, updates: Partial<EntertainmentCollectionConfig>) => void;
  resetEntertainmentCollectionsToDefault: () => void;
  // Habits
  toggleHabit: (habitId: string, targetDate?: string) => void;
  addHabit: (habit: Omit<HabitItem, 'id' | 'streak' | 'bestStreak' | 'completedDates'>) => void;
  editHabit: (habitId: string, updates: Partial<HabitItem>) => void;
  deleteHabit: (habitId: string) => void;
  resetHabitDay: (habitId: string, dateStr: string) => void;
  // Tasks
  toggleTask: (taskId: string) => void;
  addTask: (task: Omit<TaskItem, 'id'>) => void;
  editTask: (taskId: string, updates: Partial<TaskItem>) => void;
  deleteTask: (taskId: string) => void;
  // Calendar Events
  addEvent: (event: Omit<CalendarEventItem, 'id'>) => void;
  deleteEvent: (id: string) => void;
  // Finance
  addFinance: (item: Omit<FinanceItem, 'id'>) => void;
  deleteFinance: (id: string) => void;
  addAccount: (account: Omit<FinanceAccount, 'id'>) => void;
  updateAccountBalance: (accountId: string, newBalance: number) => void;
  addDebt: (debt: Omit<DebtItem, 'id' | 'settled' | 'initialAmount'>) => void;
  settleDebt: (debtId: string, settleAccountId?: string) => void;
  deleteDebt: (debtId: string) => void;
  addCustomCategory: (cat: string) => void;
  updateBudget: (monthly: number, savings: number) => void;
  updateCategoryBudget: (category: string, limit: number) => void;
  exportFinanceCsv: () => void;
  totalAccountBalance: number;
  totalMonthlyExpense: number;
  totalMonthlyIncome: number;
  totalLentOutstanding: number;
  totalBorrowedOutstanding: number;
  netWorth: number;
  // Wellness
  logWater: (delta: number) => void;
  setMood: (mood: MoodType) => void;
  addGratitude: (text: string) => void;
  addMindfulMinutes: (minutes: number) => void;
  logExercise: (minutes: number, workoutType: string) => void;
  updateSleep: (hours: number, quality: 'restful' | 'average' | 'poor') => void;
  toggleRoutineItem: (routineId: string) => void;
  toggleCycleTracking: () => void;
  updateCycleData: (lastPeriodDate: string, cycleLength: number) => void;
  toggleWellnessPrivacy: () => void;
  // Goals
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  toggleGoalCompleted: (goalId: string) => void;
  addGoal: (goal: Omit<GoalItem, 'id' | 'progressPercent' | 'completed'>) => void;
  deleteGoal: (id: string) => void;
  // Learning
  updateLearningProgress: (id: string, currentUnit: number) => void;
  // Notes & Lists
  addNote: (note: Omit<NoteItem, 'id' | 'updatedAt'>) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;
  addNoteListItem: (noteId: string, text: string, price?: number) => void;
  toggleNoteListItem: (noteId: string, itemId: string) => void;
  deleteNoteListItem: (noteId: string, itemId: string) => void;
  // Personal Inventory (Vault)
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  deleteInventoryItem: (id: string) => void;
  // Reminders
  addReminder: (reminder: Omit<ReminderItem, 'id'>) => void;
  deleteReminder: (id: string) => void;
  // Backup & Notifications
  resetData: () => void;
  exportDataJson: () => string;
  exportProductivityReport: () => void;
  importDataJson: (json: string) => boolean;
  activeNotification: { title: string; body: string; time: string } | null;
  triggerNotification: (title: string, body: string) => void;
  dismissNotification: () => void;
}

const BloomContext = createContext<BloomContextType | undefined>(undefined);

export const BloomProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Ensure all initial dashboard cards are represented if missing
          const savedCards = Array.isArray(parsed.dashboardCards) ? parsed.dashboardCards : [];
          const savedCardIds = new Set(savedCards.map((c: any) => c.id));
          const missingCards = INITIAL_APP_STATE.dashboardCards.filter((c) => !savedCardIds.has(c.id));
          const mergedCards = [...savedCards, ...missingCards];

          return {
            ...INITIAL_APP_STATE,
            ...parsed,
            dashboardCards: mergedCards.length > 0 ? mergedCards : INITIAL_APP_STATE.dashboardCards,
            modulesConfig: Array.isArray(parsed.modulesConfig) && parsed.modulesConfig.length > 0
              ? parsed.modulesConfig
              : INITIAL_APP_STATE.modulesConfig,
            entertainmentCollections: Array.isArray(parsed.entertainmentCollections) && parsed.entertainmentCollections.length > 0
              ? parsed.entertainmentCollections
              : INITIAL_APP_STATE.entertainmentCollections,
            entertainment: Array.isArray(parsed.entertainment) && parsed.entertainment.length > 0
              ? parsed.entertainment
              : INITIAL_APP_STATE.entertainment,
            pricingConfig: { ...INITIAL_APP_STATE.pricingConfig, ...(parsed.pricingConfig || {}) },
            notifications: { ...INITIAL_APP_STATE.notifications, ...(parsed.notifications || {}) },
            privacy: { ...INITIAL_APP_STATE.privacy, ...(parsed.privacy || {}) },
            user: { ...INITIAL_APP_STATE.user, ...(parsed.user || {}) },
          };
        }
      } catch (e) {
        console.error('Failed to load local storage state:', e);
      }
    }
    return INITIAL_APP_STATE;
  });

  const [activeNotification, setActiveNotification] = useState<{ title: string; body: string; time: string } | null>(null);
  const [previewThemeId, setPreviewThemeId] = useState<ThemeId | null>(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState<boolean>(false);
  const [upgradeModalReason, setUpgradeModalReason] = useState<string>('');

  const subscription: SubscriptionInfo = useMemo(() => {
    return state.subscription || { tier: 'free', planName: 'Bloom Free' };
  }, [state.subscription]);

  const isPremium = subscription.tier === 'premium';

  const setSubscriptionTier = (tier: SubscriptionTier) => {
    playSound(tier === 'premium' ? 'bloom' : 'tap');
    setState((prev) => ({
      ...prev,
      subscription: {
        tier,
        planName: tier === 'premium' ? 'Bloom Club' : 'Bloom Free',
        activatedAt: new Date().toISOString(),
      },
    }));
  };

  const openUpgradeModal = (reason?: string) => {
    setUpgradeModalReason(
      reason || 'Upgrade to Bloom Club for unlimited habits, all 6 luxury themes, and exportable financial ledgers.'
    );
    setUpgradeModalOpen(true);
    playSound('tap');
  };

  const closeUpgradeModal = () => {
    setUpgradeModalOpen(false);
  };

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to persist state:', e);
    }
  }, [state]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (state.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [state.darkMode]);

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const currency = state.currency || '₹';

  const currentTheme = useMemo(() => {
    const activeThemeId = previewThemeId || state.theme;
    return THEMES[activeThemeId] || THEMES['blush-bow'];
  }, [previewThemeId, state.theme]);

  const previewTheme = (themeId: ThemeId | null) => {
    playSound('tap');
    setPreviewThemeId(themeId);
  };

  const applyTheme = (themeId: ThemeId) => {
    const target = THEMES[themeId];
    if (target?.isPremium && !isPremium) {
      openUpgradeModal(`${target.name} is a luxury theme available with Bloom Club. Upgrade to unlock all 6 themes.`);
      return;
    }
    playSound('bloom');
    setPreviewThemeId(null);
    setState((prev) => ({ ...prev, theme: themeId }));
  };

  const setTheme = (theme: ThemeId) => {
    applyTheme(theme);
  };

  const playSound = (type: 'tap' | 'bloom' | 'drop') => {
    if (!state.soundEnabled) return;
    if (type === 'tap') sound.playTap(true, currentTheme.soundProfile?.tapFreq);
    if (type === 'bloom') sound.playBloom(true, currentTheme.soundProfile?.bloomNotes);
    if (type === 'drop') sound.playDrop(true);
  };

  const triggerNotification = (title: string, body: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setActiveNotification({ title, body, time });
    playSound('bloom');
  };

  const dismissNotification = () => {
    setActiveNotification(null);
  };

  const setCurrency = (curr: string) => {
    playSound('tap');
    setState((prev) => ({ ...prev, currency: curr }));
  };

  const toggleDarkMode = () => {
    playSound('tap');
    setState((prev) => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const toggleSound = () => {
    setState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const setViewMode = (viewMode: 'phone' | 'canvas') => {
    playSound('tap');
    setState((prev) => ({ ...prev, viewMode }));
  };

  // Dashboard Cards
  const reorderDashboardCards = (fromIndex: number, toIndex: number) => {
    playSound('tap');
    setState((prev) => {
      const cards = [...prev.dashboardCards];
      if (fromIndex < 0 || fromIndex >= cards.length || toIndex < 0 || toIndex >= cards.length) {
        return prev;
      }
      const [moved] = cards.splice(fromIndex, 1);
      cards.splice(toIndex, 0, moved);
      return { ...prev, dashboardCards: cards };
    });
  };

  const toggleDashboardCardVisibility = (cardId: string) => {
    playSound('tap');
    setState((prev) => ({
      ...prev,
      dashboardCards: prev.dashboardCards.map((c) =>
        c.id === cardId ? { ...c, visible: !c.visible } : c
      ),
    }));
  };

  const setDashboardCardSize = (cardId: string, size: 'compact' | 'full') => {
    playSound('tap');
    setState((prev) => ({
      ...prev,
      dashboardCards: prev.dashboardCards.map((c) =>
        c.id === cardId ? { ...c, size } : c
      ),
    }));
  };

  const addDashboardWidget = (widgetId: string) => {
    playSound('bloom');
    setState((prev) => {
      const exists = prev.dashboardCards.find((c) => c.id === widgetId);
      if (exists) {
        return {
          ...prev,
          dashboardCards: prev.dashboardCards.map((c) =>
            c.id === widgetId ? { ...c, visible: true } : c
          ),
        };
      }
      const initial = INITIAL_APP_STATE.dashboardCards.find((c) => c.id === widgetId);
      const newCard: DashboardCardConfig = initial || {
        id: widgetId,
        title: widgetId.replace(/_/g, ' '),
        visible: true,
        order: prev.dashboardCards.length,
        size: 'full',
      };
      return {
        ...prev,
        dashboardCards: [...prev.dashboardCards, { ...newCard, visible: true }],
      };
    });
  };

  const removeDashboardWidget = (widgetId: string) => {
    playSound('tap');
    setState((prev) => ({
      ...prev,
      dashboardCards: prev.dashboardCards.map((c) =>
        c.id === widgetId ? { ...c, visible: false } : c
      ),
    }));
  };

  const resetDashboardToDefault = () => {
    playSound('tap');
    setState((prev) => ({
      ...prev,
      dashboardCards: INITIAL_APP_STATE.dashboardCards,
    }));
  };

  // Modular Customization
  const toggleModuleEnabled = (moduleId: string) => {
    playSound('tap');
    setState((prev) => ({
      ...prev,
      modulesConfig: (prev.modulesConfig || INITIAL_APP_STATE.modulesConfig).map((m) =>
        m.id === moduleId ? { ...m, enabled: !m.enabled } : m
      ),
    }));
  };

  const toggleModuleHomeShortcut = (moduleId: string) => {
    playSound('tap');
    setState((prev) => ({
      ...prev,
      modulesConfig: (prev.modulesConfig || INITIAL_APP_STATE.modulesConfig).map((m) =>
        m.id === moduleId ? { ...m, showOnHomeShortcut: !(m.showOnHomeShortcut ?? true) } : m
      ),
    }));
  };

  const reorderModules = (fromIndex: number, toIndex: number) => {
    playSound('tap');
    setState((prev) => {
      const list = [...(prev.modulesConfig || INITIAL_APP_STATE.modulesConfig)];
      if (fromIndex < 0 || fromIndex >= list.length || toIndex < 0 || toIndex >= list.length) {
        return prev;
      }
      const [moved] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, moved);
      return {
        ...prev,
        modulesConfig: list.map((m, idx) => ({ ...m, order: idx })),
      };
    });
  };

  const resetModulesToDefault = () => {
    playSound('tap');
    setState((prev) => ({
      ...prev,
      modulesConfig: INITIAL_APP_STATE.modulesConfig,
    }));
  };

  // Entertainment & Media Tracker
  const addEntertainment = (item: Omit<EntertainmentItem, 'id'>) => {
    playSound('bloom');
    const newItem: EntertainmentItem = {
      ...item,
      id: `ent_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    setState((prev) => ({
      ...prev,
      entertainment: [newItem, ...(prev.entertainment || [])],
    }));
  };

  const editEntertainment = (id: string, updates: Partial<EntertainmentItem>) => {
    playSound('tap');
    setState((prev) => ({
      ...prev,
      entertainment: (prev.entertainment || []).map((ent) =>
        ent.id === id ? { ...ent, ...updates } : ent
      ),
    }));
  };

  const deleteEntertainment = (id: string) => {
    playSound('drop');
    setState((prev) => ({
      ...prev,
      entertainment: (prev.entertainment || []).filter((ent) => ent.id !== id),
    }));
  };

  const updateEntertainmentCollectionConfig = (
    type: EntertainmentType,
    updates: Partial<EntertainmentCollectionConfig>
  ) => {
    playSound('tap');
    setState((prev) => ({
      ...prev,
      entertainmentCollections: (prev.entertainmentCollections || INITIAL_APP_STATE.entertainmentCollections).map((c) =>
        (c.type === type || c.id === type) ? { ...c, ...updates } : c
      ),
    }));
  };

  const resetEntertainmentCollectionsToDefault = () => {
    playSound('tap');
    setState((prev) => ({
      ...prev,
      entertainmentCollections: INITIAL_APP_STATE.entertainmentCollections,
    }));
  };

  // User Account Management
  const registerUserAccount = (email: string, phone: string, name?: string) => {
    playSound('bloom');
    setState((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        email: email.trim(),
        phoneNumber: phone.trim(),
        name: name?.trim() || prev.user.name,
        isRegistered: true,
      },
    }));
    triggerNotification('Account Updated', 'Your BloomEra profile has been securely saved.');
  };

  const deactivateUserAccount = () => {
    playSound('tap');
    setState((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        email: '',
        phoneNumber: '',
        isRegistered: false,
      },
    }));
    triggerNotification('Account Reset', 'Your profile details have been cleared.');
  };

  const exportMonthlyReportPdf = () => {
    playSound('bloom');
    const userName = state.user.name || 'Bloom User';
    const monthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>BloomEra Monthly Report - ${monthYear}</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; line-height: 1.5; padding: 24px; max-width: 800px; margin: 0 auto; }
          .header { border-bottom: 2px solid #f43f5e; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }
          .logo { font-size: 24px; font-weight: 800; color: #be185d; }
          .tagline { font-size: 13px; color: #64748b; margin-top: 4px; }
          .meta { text-align: right; font-size: 13px; color: #64748b; }
          .section { margin-bottom: 24px; padding: 16px; background: #fdf2f8; border-radius: 12px; }
          .section-title { font-size: 16px; font-weight: 700; color: #9d174d; margin-top: 0; margin-bottom: 12px; }
          .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
          .stat-card { background: white; padding: 12px; border-radius: 8px; border: 1px solid #fce7f3; }
          .stat-val { font-size: 20px; font-weight: bold; color: #be185d; }
          .stat-lbl { font-size: 11px; text-transform: uppercase; color: #64748b; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 13px; }
          th, td { text-align: left; padding: 8px; border-bottom: 1px solid #fce7f3; }
          th { color: #9d174d; }
          .footer { text-align: center; font-size: 11px; color: #94a3b8; margin-top: 36px; border-top: 1px solid #e2e8f0; padding-top: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">🌸 BloomEra</div>
            <div class="tagline">Your life, beautifully organised.</div>
          </div>
          <div class="meta">
            <strong>Monthly Life Summary</strong><br>
            ${monthYear}<br>
            Prepared for: ${userName}
          </div>
        </div>

        <div class="section">
          <div class="section-title">✨ Monthly Pulse & Overall Score</div>
          <div class="stat-grid">
            <div class="stat-card">
              <div class="stat-val">${bloomScore} / 100</div>
              <div class="stat-lbl">Bloom Score</div>
            </div>
            <div class="stat-card">
              <div class="stat-val">${completedHabitsToday} / ${totalHabitsToday}</div>
              <div class="stat-lbl">Habits Completed Today</div>
            </div>
            <div class="stat-card">
              <div class="stat-val">${state.tasks.filter(t => t.completed).length} / ${state.tasks.length}</div>
              <div class="stat-lbl">Tasks Done</div>
            </div>
          </div>
        </div>

        <div class="section" style="background: #f0fdf4;">
          <div class="section-title" style="color: #166534;">💰 Financial Summary</div>
          <div class="stat-grid">
            <div class="stat-card" style="border-color: #dcfce7;">
              <div class="stat-val" style="color: #166534;">${currency}${totalMonthlyIncome.toLocaleString()}</div>
              <div class="stat-lbl">Monthly Inflow</div>
            </div>
            <div class="stat-card" style="border-color: #dcfce7;">
              <div class="stat-val" style="color: #991b1b;">${currency}${totalMonthlyExpense.toLocaleString()}</div>
              <div class="stat-lbl">Monthly Outflow</div>
            </div>
            <div class="stat-card" style="border-color: #dcfce7;">
              <div class="stat-val" style="color: #0369a1;">${currency}${netWorth.toLocaleString()}</div>
              <div class="stat-lbl">Net Worth</div>
            </div>
          </div>
        </div>

        <div class="section" style="background: #f8fafc;">
          <div class="section-title" style="color: #334155;">🌱 Personal Growth & Entertainment</div>
          <div class="stat-grid">
            <div class="stat-card">
              <div class="stat-val" style="color: #475569;">${state.goals.filter(g => g.completed).length} / ${state.goals.length}</div>
              <div class="stat-lbl">Goals Achieved</div>
            </div>
            <div class="stat-card">
              <div class="stat-val" style="color: #475569;">${(state.entertainment || []).filter(e => e.status === 'completed' || e.status === 'watched').length}</div>
              <div class="stat-lbl">Media Completed</div>
            </div>
            <div class="stat-card">
              <div class="stat-val" style="color: #475569;">${state.wellness.waterCount} / 8</div>
              <div class="stat-lbl">Hydration Pulse</div>
            </div>
          </div>
        </div>

        <div class="footer">
          Generated privately on your device by BloomEra. All data remains encrypted and local to you.
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 350);
    }
  };

  // Habits
  const toggleHabit = (habitId: string, targetDate: string = todayStr) => {
    setState((prev) => {
      const habits = prev.habits.map((h) => {
        if (h.id !== habitId) return h;
        const isDone = h.completedDates.includes(targetDate);
        let updatedDates: string[];
        let updatedStreak = h.streak;
        if (isDone) {
          updatedDates = h.completedDates.filter((d) => d !== targetDate);
          updatedStreak = Math.max(0, updatedStreak - 1);
        } else {
          updatedDates = [...h.completedDates, targetDate];
          updatedStreak = updatedStreak + 1;
          playSound('bloom');
        }
        const bestStreak = Math.max(h.bestStreak, updatedStreak);
        return {
          ...h,
          completedDates: updatedDates,
          streak: updatedStreak,
          bestStreak,
        };
      });
      return { ...prev, habits };
    });
  };

  const resetHabitDay = (habitId: string, dateStr: string) => {
    playSound('tap');
    setState((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => {
        if (h.id !== habitId) return h;
        return {
          ...h,
          completedDates: h.completedDates.filter((d) => d !== dateStr),
        };
      }),
    }));
  };

  const addHabit = (habitData: Omit<HabitItem, 'id' | 'streak' | 'bestStreak' | 'completedDates'>) => {
    if (!isPremium && state.habits.length >= 5) {
      openUpgradeModal(
        'You have reached the Free plan limit of 5 habits. Upgrade to Bloom Club for unlimited habits, streak tracking, and daily rituals.'
      );
      return;
    }
    const newHabit: HabitItem = {
      ...habitData,
      id: 'h_' + Date.now(),
      streak: 0,
      bestStreak: 0,
      completedDates: [],
    };
    playSound('bloom');
    setState((prev) => ({ ...prev, habits: [...prev.habits, newHabit] }));
  };

  const editHabit = (habitId: string, updates: Partial<HabitItem>) => {
    playSound('tap');
    setState((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => (h.id === habitId ? { ...h, ...updates } : h)),
    }));
  };

  const deleteHabit = (habitId: string) => {
    playSound('tap');
    setState((prev) => ({
      ...prev,
      habits: prev.habits.filter((h) => h.id !== habitId),
    }));
  };

  // Tasks
  const toggleTask = (taskId: string) => {
    setState((prev) => {
      const tasks = prev.tasks.map((t) => {
        if (t.id !== taskId) return t;
        const nextState = !t.completed;
        if (nextState) playSound('bloom');
        else playSound('tap');
        return {
          ...t,
          completed: nextState,
          completedAt: nextState ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
        };
      });
      return { ...prev, tasks };
    });
  };

  const addTask = (taskData: Omit<TaskItem, 'id'>) => {
    const newTask: TaskItem = {
      ...taskData,
      id: 't_' + Date.now(),
    };
    playSound('tap');
    setState((prev) => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
  };

  const editTask = (taskId: string, updates: Partial<TaskItem>) => {
    playSound('tap');
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
    }));
  };

  const deleteTask = (taskId: string) => {
    playSound('tap');
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
  };

  // Calendar Events
  const addEvent = (eventData: Omit<CalendarEventItem, 'id'>) => {
    const newEvent: CalendarEventItem = {
      ...eventData,
      id: 'ev_' + Date.now(),
    };
    playSound('bloom');
    setState((prev) => ({ ...prev, events: [...prev.events, newEvent] }));
  };

  const deleteEvent = (id: string) => {
    playSound('tap');
    setState((prev) => ({
      ...prev,
      events: prev.events.filter((e) => e.id !== id),
    }));
  };

  // Finance
  const addFinance = (item: Omit<FinanceItem, 'id'>) => {
    const newItem: FinanceItem = {
      ...item,
      id: 'f_' + Date.now(),
    };

    setState((prev) => {
      const updatedAccounts = prev.accounts.map((acc) => {
        if (acc.id === item.accountId) {
          if (item.type === 'expense') {
            return { ...acc, balance: acc.balance - item.amount };
          } else if (item.type === 'income') {
            return { ...acc, balance: acc.balance + item.amount };
          } else if (item.type === 'transfer') {
            return { ...acc, balance: acc.balance - item.amount };
          }
        }
        if (item.type === 'transfer' && item.toAccountId && acc.id === item.toAccountId) {
          return { ...acc, balance: acc.balance + item.amount };
        }
        return acc;
      });

      return {
        ...prev,
        accounts: updatedAccounts,
        finances: [newItem, ...prev.finances],
      };
    });
    playSound('bloom');
  };

  const deleteFinance = (id: string) => {
    playSound('tap');
    setState((prev) => {
      const itemToDelete = prev.finances.find((f) => f.id === id);
      if (!itemToDelete) return prev;

      const updatedAccounts = prev.accounts.map((acc) => {
        if (acc.id === itemToDelete.accountId) {
          if (itemToDelete.type === 'expense') {
            return { ...acc, balance: acc.balance + itemToDelete.amount };
          } else if (itemToDelete.type === 'income') {
            return { ...acc, balance: acc.balance - itemToDelete.amount };
          } else if (itemToDelete.type === 'transfer') {
            return { ...acc, balance: acc.balance + itemToDelete.amount };
          }
        }
        if (itemToDelete.type === 'transfer' && itemToDelete.toAccountId && acc.id === itemToDelete.toAccountId) {
          return { ...acc, balance: acc.balance - itemToDelete.amount };
        }
        return acc;
      });

      return {
        ...prev,
        accounts: updatedAccounts,
        finances: prev.finances.filter((f) => f.id !== id),
      };
    });
  };

  const addAccount = (acc: Omit<FinanceAccount, 'id'>) => {
    const newAcc: FinanceAccount = {
      ...acc,
      id: 'acc_' + Date.now(),
    };
    playSound('bloom');
    setState((prev) => ({ ...prev, accounts: [...prev.accounts, newAcc] }));
  };

  const updateAccountBalance = (accountId: string, newBalance: number) => {
    playSound('tap');
    setState((prev) => ({
      ...prev,
      accounts: prev.accounts.map((a) => (a.id === accountId ? { ...a, balance: newBalance } : a)),
    }));
  };

  const addDebt = (debtData: Omit<DebtItem, 'id' | 'settled' | 'initialAmount'>) => {
    const newDebt: DebtItem = {
      ...debtData,
      id: 'd_' + Date.now(),
      initialAmount: debtData.amount,
      settled: false,
    };

    setState((prev) => {
      let accounts = [...prev.accounts];
      if (debtData.accountId) {
        accounts = accounts.map((acc) => {
          if (acc.id === debtData.accountId) {
            if (debtData.type === 'lent') {
              return { ...acc, balance: acc.balance - debtData.amount };
            } else {
              return { ...acc, balance: acc.balance + debtData.amount };
            }
          }
          return acc;
        });
      }
      return {
        ...prev,
        accounts,
        debts: [newDebt, ...prev.debts],
      };
    });
    playSound('bloom');
  };

  const settleDebt = (debtId: string, settleAccountId?: string) => {
    playSound('bloom');
    setState((prev) => {
      const debt = prev.debts.find((d) => d.id === debtId);
      if (!debt || debt.settled) return prev;

      let accounts = [...prev.accounts];
      const targetAccId = settleAccountId || debt.accountId || prev.accounts[0]?.id;

      if (targetAccId) {
        accounts = accounts.map((acc) => {
          if (acc.id === targetAccId) {
            if (debt.type === 'lent') {
              return { ...acc, balance: acc.balance + debt.amount };
            } else {
              return { ...acc, balance: acc.balance - debt.amount };
            }
          }
          return acc;
        });
      }

      return {
        ...prev,
        accounts,
        debts: prev.debts.map((d) => (d.id === debtId ? { ...d, settled: true } : d)),
      };
    });
  };

  const deleteDebt = (debtId: string) => {
    playSound('tap');
    setState((prev) => ({
      ...prev,
      debts: prev.debts.filter((d) => d.id !== debtId),
    }));
  };

  const addCustomCategory = (cat: string) => {
    if (!cat.trim() || state.customCategories.includes(cat.trim())) return;
    playSound('bloom');
    setState((prev) => ({
      ...prev,
      customCategories: [...prev.customCategories, cat.trim()],
    }));
  };

  const updateBudget = (monthlyBudget: number, savingsGoal: number) => {
    playSound('tap');
    setState((prev) => ({ ...prev, monthlyBudget, savingsGoal }));
  };

  const updateCategoryBudget = (category: string, limit: number) => {
    playSound('tap');
    setState((prev) => {
      const existing = prev.categoryBudgets.find((cb) => cb.category === category);
      let updated: CategoryBudget[];
      if (existing) {
        updated = prev.categoryBudgets.map((cb) => (cb.category === category ? { ...cb, limit } : cb));
      } else {
        updated = [...prev.categoryBudgets, { category, limit }];
      }
      return { ...prev, categoryBudgets: updated };
    });
  };

  const exportFinanceCsv = () => {
    if (!isPremium) {
      openUpgradeModal(
        'Exportable CSV financial ledgers and tax reports are a Bloom Club feature. Upgrade to export and backup your full financial ledger.'
      );
      return;
    }
    playSound('bloom');
    const headers = ['ID', 'Date', 'Type', 'Category', `Amount (${currency})`, 'Account', 'Notes'];
    const rows = state.finances.map((f) => {
      const acc = state.accounts.find((a) => a.id === f.accountId)?.name || f.accountId;
      return [f.id, f.date, f.type, `"${f.category}"`, f.amount, `"${acc}"`, `"${f.note.replace(/"/g, '""')}"`];
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BloomEra_Finance_Report_${todayStr}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalAccountBalance = useMemo(() => {
    return state.accounts.reduce((sum, a) => sum + a.balance, 0);
  }, [state.accounts]);

  const totalMonthlyExpense = useMemo(() => {
    return state.finances
      .filter((f) => f.type === 'expense')
      .reduce((sum, f) => sum + f.amount, 0);
  }, [state.finances]);

  const totalMonthlyIncome = useMemo(() => {
    return state.finances
      .filter((f) => f.type === 'income')
      .reduce((sum, f) => sum + f.amount, 0);
  }, [state.finances]);

  const totalLentOutstanding = useMemo(() => {
    return state.debts
      .filter((d) => d.type === 'lent' && !d.settled)
      .reduce((sum, d) => sum + d.amount, 0);
  }, [state.debts]);

  const totalBorrowedOutstanding = useMemo(() => {
    return state.debts
      .filter((d) => d.type === 'borrowed' && !d.settled)
      .reduce((sum, d) => sum + d.amount, 0);
  }, [state.debts]);

  const netWorth = useMemo(() => {
    return totalAccountBalance + totalLentOutstanding - totalBorrowedOutstanding;
  }, [totalAccountBalance, totalLentOutstanding, totalBorrowedOutstanding]);

  // Wellness
  const logWater = (delta: number) => {
    playSound('drop');
    setState((prev) => ({
      ...prev,
      wellness: {
        ...prev.wellness,
        waterCount: Math.max(0, Math.min(14, prev.wellness.waterCount + delta)),
      },
    }));
  };

  const setMood = (mood: MoodType) => {
    playSound('bloom');
    setState((prev) => ({
      ...prev,
      wellness: {
        ...prev.wellness,
        moodToday: mood,
      },
    }));
  };

  const addGratitude = (text: string) => {
    if (!text.trim()) return;
    playSound('bloom');
    const newEntry = {
      id: 'g_' + Date.now(),
      text: text.trim(),
      date: todayStr,
    };
    setState((prev) => ({
      ...prev,
      wellness: {
        ...prev.wellness,
        gratitudeEntries: [newEntry, ...prev.wellness.gratitudeEntries],
      },
    }));
  };

  const addMindfulMinutes = (minutes: number) => {
    playSound('bloom');
    setState((prev) => ({
      ...prev,
      wellness: {
        ...prev.wellness,
        mindfulMinutesToday: prev.wellness.mindfulMinutesToday + minutes,
      },
    }));
  };

  const logExercise = (minutes: number, workoutType: string) => {
    playSound('bloom');
    setState((prev) => ({
      ...prev,
      wellness: {
        ...prev.wellness,
        exerciseMinutesToday: prev.wellness.exerciseMinutesToday + minutes,
        exerciseTypeToday: workoutType,
      },
    }));
  };

  const updateSleep = (hours: number, quality: 'restful' | 'average' | 'poor') => {
    playSound('tap');
    setState((prev) => ({
      ...prev,
      wellness: {
        ...prev.wellness,
        sleepHours: hours,
        sleepQuality: quality,
      },
    }));
  };

  const toggleRoutineItem = (routineId: string) => {
    playSound('tap');
    setState((prev) => ({
      ...prev,
      wellness: {
        ...prev.wellness,
        dailyRoutines: prev.wellness.dailyRoutines.map((r) =>
          r.id === routineId ? { ...r, completed: !r.completed } : r
        ),
      },
    }));
  };

  const toggleCycleTracking = () => {
    playSound('tap');
    setState((prev) => ({
      ...prev,
      wellness: {
        ...prev.wellness,
        cycleTrackingEnabled: !prev.wellness.cycleTrackingEnabled,
      },
    }));
  };

  const updateCycleData = (lastPeriodDate: string, cycleLengthDays: number) => {
    playSound('bloom');
    setState((prev) => ({
      ...prev,
      wellness: {
        ...prev.wellness,
        cycleData: {
          lastPeriodDate,
          cycleLengthDays,
          periodLengthDays: 5,
        },
      },
    }));
  };

  const toggleWellnessPrivacy = () => {
    playSound('tap');
    setState((prev) => ({
      ...prev,
      wellness: {
        ...prev.wellness,
        wellnessPrivacyLocked: !prev.wellness.wellnessPrivacyLocked,
      },
    }));
  };

  // Goals
  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setState((prev) => {
      const goals = prev.goals.map((g) => {
        if (g.id !== goalId) return g;
        const milestones = g.milestones.map((m) => {
          if (m.id !== milestoneId) return m;
          return { ...m, completed: !m.completed };
        });
        const completedCount = milestones.filter((m) => m.completed).length;
        const progressPercent = Math.round((completedCount / milestones.length) * 100);
        const isCompleted = progressPercent === 100;
        return {
          ...g,
          milestones,
          progressPercent,
          completed: isCompleted,
          completedAt: isCompleted ? todayStr : undefined,
        };
      });
      playSound('bloom');
      return { ...prev, goals };
    });
  };

  const toggleGoalCompleted = (goalId: string) => {
    playSound('bloom');
    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => {
        if (g.id !== goalId) return g;
        const nextDone = !g.completed;
        return {
          ...g,
          completed: nextDone,
          completedAt: nextDone ? todayStr : undefined,
          progressPercent: nextDone ? 100 : g.progressPercent,
        };
      }),
    }));
  };

  const addGoal = (goalData: Omit<GoalItem, 'id' | 'progressPercent' | 'completed'>) => {
    if (!isPremium && state.goals.length >= 3) {
      openUpgradeModal(
        'You have reached the Free plan limit of 3 goals. Upgrade to Bloom Club for unlimited personal goals, milestones, and vision roadmaps.'
      );
      return;
    }
    const newGoal: GoalItem = {
      ...goalData,
      id: 'g_' + Date.now(),
      progressPercent: 0,
      completed: false,
    };
    playSound('bloom');
    setState((prev) => ({ ...prev, goals: [...prev.goals, newGoal] }));
  };

  const deleteGoal = (id: string) => {
    playSound('tap');
    setState((prev) => ({
      ...prev,
      goals: prev.goals.filter((g) => g.id !== id),
    }));
  };

  // Learning
  const updateLearningProgress = (id: string, currentUnit: number) => {
    playSound('tap');
    setState((prev) => ({
      ...prev,
      learning: prev.learning.map((l) => {
        if (l.id !== id) return l;
        const status = currentUnit >= l.totalUnits ? 'completed' : 'reading';
        return { ...l, currentUnit, status };
      }),
    }));
  };

  // Notes & Lists
  const addNote = (noteData: Omit<NoteItem, 'id' | 'updatedAt'>) => {
    const newNote: NoteItem = {
      ...noteData,
      id: 'n_' + Date.now(),
      updatedAt: 'Just now',
    };
    playSound('bloom');
    setState((prev) => ({ ...prev, notes: [newNote, ...prev.notes] }));
  };

  const deleteNote = (id: string) => {
    playSound('tap');
    setState((prev) => ({
      ...prev,
      notes: prev.notes.filter((n) => n.id !== id),
    }));
  };

  const togglePinNote = (id: string) => {
    playSound('tap');
    setState((prev) => ({
      ...prev,
      notes: prev.notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)),
    }));
  };

  const addNoteListItem = (noteId: string, text: string, price?: number) => {
    if (!text.trim()) return;
    playSound('tap');
    const newItem: NoteListItem = {
      id: 'li_' + Date.now(),
      text: text.trim(),
      done: false,
      price,
    };
    setState((prev) => ({
      ...prev,
      notes: prev.notes.map((n) =>
        n.id === noteId ? { ...n, listItems: [...(n.listItems || []), newItem] } : n
      ),
    }));
  };

  const toggleNoteListItem = (noteId: string, itemId: string) => {
    playSound('tap');
    setState((prev) => ({
      ...prev,
      notes: prev.notes.map((n) => {
        if (n.id !== noteId) return n;
        const updatedList = (n.listItems || []).map((li) =>
          li.id === itemId ? { ...li, done: !li.done } : li
        );
        return { ...n, listItems: updatedList };
      }),
    }));
  };

  const deleteNoteListItem = (noteId: string, itemId: string) => {
    playSound('tap');
    setState((prev) => ({
      ...prev,
      notes: prev.notes.map((n) => {
        if (n.id !== noteId) return n;
        return {
          ...n,
          listItems: (n.listItems || []).filter((li) => li.id !== itemId),
        };
      }),
    }));
  };

  // Personal Inventory (Vault)
  const addInventoryItem = (itemData: Omit<InventoryItem, 'id'>) => {
    const newItem: InventoryItem = {
      ...itemData,
      id: 'inv_' + Date.now(),
    };
    playSound('bloom');
    setState((prev) => ({ ...prev, inventory: [newItem, ...prev.inventory] }));
  };

  const deleteInventoryItem = (id: string) => {
    playSound('tap');
    setState((prev) => ({
      ...prev,
      inventory: prev.inventory.filter((i) => i.id !== id),
    }));
  };

  // Reminders
  const addReminder = (remData: Omit<ReminderItem, 'id'>) => {
    const newRem: ReminderItem = {
      ...remData,
      id: 'r_' + Date.now(),
    };
    playSound('bloom');
    setState((prev) => ({ ...prev, reminders: [...prev.reminders, newRem] }));
  };

  const deleteReminder = (id: string) => {
    playSound('tap');
    setState((prev) => ({
      ...prev,
      reminders: prev.reminders.filter((r) => r.id !== id),
    }));
  };

  // Settings & Preferences
  const setLanguage = (language: LanguageCode) => {
    playSound('tap');
    setState((prev) => ({ ...prev, language }));
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    playSound('tap');
    setState((prev) => ({
      ...prev,
      user: { ...prev.user, ...profile },
    }));
  };

  const updateNotificationPreferences = (prefs: Partial<NotificationPreferences>) => {
    playSound('tap');
    setState((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, ...prefs },
    }));
  };

  const updatePrivacyPreferences = (prefs: Partial<PrivacyPreferences>) => {
    playSound('tap');
    setState((prev) => ({
      ...prev,
      privacy: { ...prev.privacy, ...prefs },
    }));
  };

  const updatePricingConfig = (config: Partial<SubscriptionPricingConfig>) => {
    playSound('tap');
    setState((prev) => ({
      ...prev,
      pricingConfig: { ...prev.pricingConfig, ...config },
    }));
  };

  // Reset & Backup
  const resetData = () => {
    playSound('tap');
    setState(INITIAL_APP_STATE);
    localStorage.removeItem(STORAGE_KEY);
  };

  const exportDataJson = () => {
    return JSON.stringify(state, null, 2);
  };

  const exportProductivityReport = () => {
    if (!isPremium) {
      openUpgradeModal('Unlock exportable productivity & life analytics reports with Bloom Club.');
      return;
    }
    playSound('bloom');
    const completedTasksCount = state.tasks.filter((t) => t.completed).length;
    const lines = [
      `# BloomEra Productivity & Life Harmony Executive Report`,
      `Generated: ${new Date().toLocaleString()}`,
      `User: ${state.user.name} (${state.user.tagline})`,
      `Plan: ${subscription.planName} (PRO)`,
      `Theme Aesthetic: ${currentTheme.name}`,
      `Bloom Harmony Score: ${bloomScore}/100`,
      ``,
      `---`,
      `## 1. Rituals & Habit Consistency`,
      `Total Tracked Habits: ${state.habits.length}`,
      `Completed Today: ${completedHabitsToday}/${totalHabitsToday}`,
      ...state.habits.map(
        (h) => `- ${h.title}: Current Streak ${h.streak}d (Best: ${h.bestStreak}d) | Total Completions: ${h.completedDates.length}`
      ),
      ``,
      `---`,
      `## 2. Tasks & Action Items`,
      `Total Tasks: ${state.tasks.length}`,
      `Completed: ${completedTasksCount}`,
      `Pending: ${state.tasks.length - completedTasksCount}`,
      ...state.tasks.map(
        (t) => `- [${t.completed ? 'x' : ' '}] ${t.title} (Due: ${t.dueDate}, Priority: ${t.priority.toUpperCase()})`
      ),
      ``,
      `---`,
      `## 3. Financial Harmony (${currency})`,
      `Monthly Budget: ${currency}${state.monthlyBudget.toLocaleString()}`,
      `Monthly Expense: ${currency}${totalMonthlyExpense.toLocaleString()}`,
      `Monthly Income: ${currency}${totalMonthlyIncome.toLocaleString()}`,
      `Current Savings: ${currency}${state.currentSavings.toLocaleString()} / Goal: ${currency}${state.savingsGoal.toLocaleString()}`,
      `Net Balance Across Accounts: ${currency}${totalAccountBalance.toLocaleString()}`,
      ``,
      `---`,
      `## 4. Wellness Pulse`,
      `Water Intake Today: ${state.wellness.waterCount}/8 glasses`,
      `Hours Slept: ${state.wellness.sleepHours} hrs (${state.wellness.sleepQuality || 'restful'})`,
      `Mood Logged: ${state.wellness.moodToday || 'Not logged'}`,
      `Mindful Minutes: ${state.wellness.mindfulMinutesToday} mins`,
      ``,
      `---`,
      `BloomEra - Your life, beautifully organised.`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BloomEra_Productivity_Report_${todayStr}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importDataJson = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && typeof parsed === 'object') {
        setState({
          ...INITIAL_APP_STATE,
          ...parsed,
          pricingConfig: { ...INITIAL_APP_STATE.pricingConfig, ...(parsed.pricingConfig || {}) },
          notifications: { ...INITIAL_APP_STATE.notifications, ...(parsed.notifications || {}) },
          privacy: { ...INITIAL_APP_STATE.privacy, ...(parsed.privacy || {}) },
          user: { ...INITIAL_APP_STATE.user, ...(parsed.user || {}) },
        });
        playSound('bloom');
        return true;
      }
    } catch (e) {
      console.error('Invalid JSON import:', e);
    }
    return false;
  };

  const completedHabitsToday = useMemo(() => {
    return state.habits.filter((h) => h.completedDates.includes(todayStr)).length;
  }, [state.habits, todayStr]);

  const totalHabitsToday = state.habits.length;

  const bloomScore = useMemo(() => {
    const habitRatio = totalHabitsToday > 0 ? completedHabitsToday / totalHabitsToday : 1;
    const habitScore = habitRatio * 35;

    const todayTasks = state.tasks.filter((t) => t.dueDate === todayStr);
    const completedTasks = todayTasks.filter((t) => t.completed).length;
    const taskRatio = todayTasks.length > 0 ? completedTasks / todayTasks.length : 1;
    const taskScore = taskRatio * 25;

    const waterScore = Math.min(1, state.wellness.waterCount / 8) * 15;
    const mindfulScore = Math.min(1, state.wellness.mindfulMinutesToday / 15) * 15;
    const moodScore = state.wellness.moodToday ? 10 : 0;

    return Math.round(habitScore + taskScore + waterScore + mindfulScore + moodScore);
  }, [completedHabitsToday, totalHabitsToday, state.tasks, todayStr, state.wellness]);

  return (
    <BloomContext.Provider
      value={{
        state,
        currentTheme,
        subscription,
        isPremium,
        setSubscriptionTier,
        previewThemeId,
        previewTheme,
        applyTheme,
        setTheme,
        upgradeModalOpen,
        upgradeModalReason,
        openUpgradeModal,
        closeUpgradeModal,
        bloomScore,
        completedHabitsToday,
        totalHabitsToday,
        todayStr,
        currency,
        setCurrency,
        playSound,
        toggleDarkMode,
        toggleSound,
        setViewMode,
        setLanguage,
        updateUserProfile,
        updateNotificationPreferences,
        updatePrivacyPreferences,
        updatePricingConfig,
        exportProductivityReport,
        exportMonthlyReportPdf,
        registerUserAccount,
        deactivateUserAccount,
        reorderDashboardCards,
        toggleDashboardCardVisibility,
        setDashboardCardSize,
        addDashboardWidget,
        removeDashboardWidget,
        resetDashboardToDefault,
        toggleModuleEnabled,
        toggleModuleHomeShortcut,
        reorderModules,
        resetModulesToDefault,
        addEntertainment,
        editEntertainment,
        deleteEntertainment,
        updateEntertainmentCollectionConfig,
        resetEntertainmentCollectionsToDefault,
        toggleHabit,
        addHabit,
        editHabit,
        deleteHabit,
        resetHabitDay,
        toggleTask,
        addTask,
        editTask,
        deleteTask,
        addEvent,
        deleteEvent,
        addFinance,
        deleteFinance,
        addAccount,
        updateAccountBalance,
        addDebt,
        settleDebt,
        deleteDebt,
        addCustomCategory,
        updateBudget,
        updateCategoryBudget,
        exportFinanceCsv,
        totalAccountBalance,
        totalMonthlyExpense,
        totalMonthlyIncome,
        totalLentOutstanding,
        totalBorrowedOutstanding,
        netWorth,
        logWater,
        setMood,
        addGratitude,
        addMindfulMinutes,
        logExercise,
        updateSleep,
        toggleRoutineItem,
        toggleCycleTracking,
        updateCycleData,
        toggleWellnessPrivacy,
        toggleMilestone,
        toggleGoalCompleted,
        addGoal,
        deleteGoal,
        updateLearningProgress,
        addNote,
        deleteNote,
        togglePinNote,
        addNoteListItem,
        toggleNoteListItem,
        deleteNoteListItem,
        addInventoryItem,
        deleteInventoryItem,
        addReminder,
        deleteReminder,
        resetData,
        exportDataJson,
        importDataJson,
        activeNotification,
        triggerNotification,
        dismissNotification,
      }}
    >
      {children}
    </BloomContext.Provider>
  );
};

export const useBloom = (): BloomContextType => {
  const context = useContext(BloomContext);
  if (!context) {
    throw new Error('useBloom must be used within a BloomProvider');
  }
  return context;
};
