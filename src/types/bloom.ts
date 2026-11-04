export type ThemeId =
  | 'blush-bow'
  | 'sage-garden'
  | 'lavender-dream'
  | 'tiramisu'
  | 'midnight-luxe'
  | 'ocean-breeze'
  // Backward compatibility aliases
  | 'midnight-starlight'
  | 'terracotta-sol'
  | 'sakura'
  | 'sage'
  | 'buttercream'
  | 'mauve'
  | 'obsidian'
  | 'terracotta';

export type SubscriptionTier = 'free' | 'premium';

export interface SubscriptionInfo {
  tier: SubscriptionTier;
  planName: string;
  activatedAt?: string;
}

export type LifePillar = 'wellness' | 'habits' | 'finance' | 'planner' | 'goals' | 'learning' | 'notes' | 'reminders';

export type MoodType = 'radiant' | 'peaceful' | 'reflective' | 'low-energy' | 'anxious';

export interface HabitItem {
  id: string;
  title: string;
  pillar: LifePillar;
  streak: number;
  bestStreak: number;
  frequency: 'daily' | 'weekly';
  targetDaysPerWeek: number;
  completedDates: string[]; // YYYY-MM-DD
  reminderTime?: string;
  category: 'morning' | 'afternoon' | 'evening' | 'anytime';
  color: string;
  iconName: string;
  notes?: string;
  createdAt?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority: 'low' | 'medium' | 'high';
  category: string;
  customLabels: string[];
  recurring: 'none' | 'daily' | 'weekly' | 'monthly';
  completed: boolean;
  completedAt?: string;
  location?: string;
}

export interface CalendarEventItem {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  type: 'event' | 'appointment' | 'deadline';
  recurring: 'none' | 'daily' | 'weekly' | 'monthly';
  linkedTaskId?: string;
  location?: string;
  notes?: string;
}

export type AccountType = 'cash' | 'bank' | 'upi';

export interface FinanceAccount {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  accountNumberOrUpi?: string;
  color?: string;
}

export type TransactionType = 'expense' | 'income' | 'transfer';

export interface FinanceItem {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  date: string; // YYYY-MM-DD
  time?: string;
  note: string;
  accountId: string;
  toAccountId?: string;
}

export interface DebtItem {
  id: string;
  type: 'lent' | 'borrowed';
  counterpartyName: string;
  amount: number;
  initialAmount: number;
  dueDate?: string;
  settled: boolean;
  notes?: string;
  date: string;
  accountId?: string;
}

export interface CategoryBudget {
  category: string;
  limit: number;
}

export interface GoalMilestone {
  id: string;
  title: string;
  completed: boolean;
}

export type GoalScope = 'short-term' | 'long-term';
export type GoalCategory = 'Career' | 'Learning' | 'Personal Development' | 'Health & Vitality' | 'Financial';

export interface GoalItem {
  id: string;
  title: string;
  scope: GoalScope;
  category: GoalCategory;
  pillar: LifePillar;
  targetDate: string;
  progressPercent: number;
  milestones: GoalMilestone[];
  completed: boolean;
  completedAt?: string;
  imageUrl?: string;
  notes?: string;
}

export interface LearningItem {
  id: string;
  title: string;
  creator: string;
  type: 'book' | 'course' | 'podcast';
  currentUnit: number;
  totalUnits: number;
  status: 'reading' | 'completed' | 'queued';
  keyQuote?: string;
}

export type NoteType = 'note' | 'shopping' | 'checklist' | 'tobuy';

export interface NoteListItem {
  id: string;
  text: string;
  done: boolean;
  price?: number;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  type: NoteType;
  listItems?: NoteListItem[];
  pillar: LifePillar;
  pinned: boolean;
  colorTag: string;
  updatedAt: string;
  tags: string[];
}

export type InventoryCategory = 'document' | 'subscription' | 'belonging' | 'warranty';

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  providerOrBrand: string;
  expiryOrRenewalDate: string; // YYYY-MM-DD
  costOrValue?: number;
  billingFrequency?: 'monthly' | 'yearly' | 'one-time';
  maskedRefNumber?: string; // e.g. "•••• 8392"
  notes?: string;
  status?: 'active' | 'expiring_soon' | 'expired';
}

export interface ReminderItem {
  id: string;
  title: string;
  dueDate: string;
  category: 'subscription' | 'renewal' | 'birthday' | 'health';
  amount?: number;
  recurring: 'none' | 'monthly' | 'yearly';
}

export interface DailyRoutineItem {
  id: string;
  title: string;
  timeOfDay: 'morning' | 'evening';
  completed: boolean;
}

export interface WellnessData {
  waterCount: number; // glasses (goal: 8)
  moodToday: MoodType | null;
  sleepHours: number;
  sleepBedtime?: string;
  sleepWakeTime?: string;
  sleepQuality?: 'restful' | 'average' | 'poor';
  exerciseMinutesToday: number;
  exerciseTypeToday?: string; // e.g. 'Yoga Flow', 'Pilates', 'Brisk Walk'
  gratitudeEntries: { id: string; text: string; date: string }[];
  mindfulMinutesToday: number;
  dailyRoutines: DailyRoutineItem[];
  // Optional and private Menstrual Cycle Tracking
  cycleTrackingEnabled: boolean;
  cycleData?: {
    lastPeriodDate: string; // YYYY-MM-DD
    cycleLengthDays: number; // e.g. 28
    periodLengthDays: number; // e.g. 5
  };
  wellnessPrivacyLocked: boolean;
}

export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'hi';

export interface NotificationPreferences {
  morningIntentionEnabled: boolean;
  morningIntentionTime: string; // HH:mm
  eveningReflectionEnabled: boolean;
  eveningReflectionTime: string; // HH:mm
  hydrationAlerts: boolean;
  hydrationIntervalHours: number;
  quietHoursEnabled: boolean;
  quietHoursStart: string; // HH:mm
  quietHoursEnd: string; // HH:mm
}

export interface PrivacyPreferences {
  biometricLockEnabled: boolean;
  pinLockEnabled: boolean;
  hideFinancialBalances: boolean;
  cycleTrackingLocked: boolean;
  localStorageOnlyNoticeAcknowledged: boolean;
}

export interface SubscriptionPricingConfig {
  monthlyPrice: number;
  annualPrice: number;
  currencySymbol: string;
}

export type EntertainmentType = 'book' | 'movie' | 'tv';

export type BookReadingStatus = 'want_to_read' | 'reading' | 'completed' | 'on_hold';
export type MovieWatchStatus = 'want_to_watch' | 'watched' | 'on_hold';
export type TvWatchStatus = 'want_to_watch' | 'watching' | 'completed' | 'on_hold';
export type ReadingStatus = BookReadingStatus;
export type WatchStatus = MovieWatchStatus | TvWatchStatus;

export interface EntertainmentItem {
  id: string;
  type: EntertainmentType;
  title: string;
  author?: string;
  creatorOrAuthor?: string; // Author for books, Director/Studio for movies
  genre?: string;
  status: string;
  startDate?: string;
  completionDate?: string;
  rating?: number; // 1 to 5
  notes?: string;
  // TV Specific
  totalSeasons?: number;
  currentSeason?: number;
  currentEpisode?: number;
  coverColor?: string;
}

export interface EntertainmentCollectionConfig {
  id: EntertainmentType;
  type?: EntertainmentType;
  name: string;
  iconName: string;
  enabled: boolean;
}

export interface ModuleConfig {
  id: string;
  name: string;
  description: string;
  iconName: string;
  enabled: boolean;
  order: number;
  showOnHomeShortcut?: boolean;
}

export interface UserProfile {
  name: string;
  tagline: string;
  email?: string;
  phoneNumber?: string;
  isRegistered?: boolean;
  bio?: string;
  joinedDate: string;
  avatarSeed: string;
}

export interface DashboardCardConfig {
  id: string;
  title: string;
  visible: boolean;
  order?: number;
  size?: 'compact' | 'full';
  description?: string;
  category?: string;
}

export interface AppState {
  theme: ThemeId;
  darkMode: boolean;
  soundEnabled: boolean;
  viewMode: 'phone' | 'canvas';
  currency: string;
  language: LanguageCode;
  user: UserProfile;
  dashboardCards: DashboardCardConfig[];
  modulesConfig: ModuleConfig[];
  entertainment: EntertainmentItem[];
  entertainmentCollections: EntertainmentCollectionConfig[];
  habits: HabitItem[];
  tasks: TaskItem[];
  events: CalendarEventItem[];
  accounts: FinanceAccount[];
  finances: FinanceItem[];
  debts: DebtItem[];
  monthlyBudget: number;
  categoryBudgets: CategoryBudget[];
  savingsGoal: number;
  currentSavings: number;
  customCategories: string[];
  goals: GoalItem[];
  learning: LearningItem[];
  notes: NoteItem[];
  inventory: InventoryItem[];
  reminders: ReminderItem[];
  wellness: WellnessData;
  subscription?: SubscriptionInfo;
  pricingConfig: SubscriptionPricingConfig;
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  previewThemeId?: ThemeId | null;
}


