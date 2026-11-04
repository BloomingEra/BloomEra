import React, { useState } from 'react';
import {
  Palette,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Bell,
  Download,
  Upload,
  RefreshCw,
  ShieldCheck,
  Code,
  Smartphone,
  Check,
  Crown,
  Globe,
  Sliders,
  User,
  Edit3,
  Clock,
  Lock,
  EyeOff,
  Eye,
  FileSpreadsheet,
  FileText,
  Sparkles,
  Layers,
  Heart,
  Droplets,
} from 'lucide-react';
import { useBloom } from '../context/BloomContext';
import { THEMES, THEME_LIST } from '../constants/themes';
import { ThemeId, LanguageCode } from '../types/bloom';
import { ThemeCardCorner, ThemeDivider, ThemeDoodleVignette } from '../components/ThemeDecorations';
import { EditProfileModal } from '../components/EditProfileModal';
import { PricingConfigModal } from '../components/PricingConfigModal';
import { DashboardCustomizerModal } from '../components/DashboardCustomizerModal';
import { AccountModal } from '../components/AccountModal';
import { PrivacyPolicyModal } from '../components/PrivacyPolicyModal';

interface SettingsScreenProps {
  onOpenCodeModal?: () => void;
}

const LANGUAGES: { code: LanguageCode; name: string; native: string; flag: string }[] = [
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
];

const CURRENCIES = [
  { symbol: '₹', label: 'INR (₹)' },
  { symbol: '$', label: 'USD ($)' },
  { symbol: '€', label: 'EUR (€)' },
  { symbol: '£', label: 'GBP (£)' },
  { symbol: '¥', label: 'JPY (¥)' },
  { symbol: 'C$', label: 'CAD (C$)' },
  { symbol: 'A$', label: 'AUD (A$)' },
];

const AVATAR_EMOJIS: Record<string, string> = {
  ananya: '🌸',
  elena: '🌿',
  charlotte: '✨',
  maya: '☕',
  zara: '🌙',
  chloe: '🌊',
  sophia: '🎀',
  flora: '🪴',
};

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onOpenCodeModal }) => {
  const {
    state,
    currentTheme,
    currency,
    setCurrency,
    setLanguage,
    updateUserProfile,
    updateNotificationPreferences,
    updatePrivacyPreferences,
    exportProductivityReport,
    exportMonthlyReportPdf,
    exportFinanceCsv,
    toggleDarkMode,
    toggleSound,
    setViewMode,
    resetData,
    exportDataJson,
    importDataJson,
    triggerNotification,
    playSound,
    isPremium,
    setSubscriptionTier,
    openUpgradeModal,
    previewThemeId,
    previewTheme,
    applyTheme,
  } = useBloom();

  const palette = state.darkMode ? currentTheme.dark : currentTheme.light;
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Modals state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const handleExport = () => {
    playSound('bloom');
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BloomEra_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDataJson(content);
      if (success) {
        setImportStatus('Backup restored successfully!');
      } else {
        setImportStatus('Failed to parse backup JSON.');
      }
      setTimeout(() => setImportStatus(null), 3500);
    };
    reader.readAsText(file);
  };

  const handleSimulateNotification = () => {
    triggerNotification(
      'Evening Gratitude & Reflection',
      'Take 2 minutes to pause and honor the peaceful moments of today.'
    );
  };

  const userAvatarEmoji = AVATAR_EMOJIS[state.user.avatarSeed] || '🌸';
  const visibleCardsCount = state.dashboardCards.filter((c) => c.visible).length;

  return (
    <div className="flex-1 pb-28 p-4 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Preferences & Visual Engine
          </span>
          <h2
            className={`text-xl font-medium tracking-tight flex items-center gap-2 ${currentTheme.fontFamily.fontClass}`}
            style={{ color: palette.text }}
          >
            Settings & Aesthetics
            <ThemeCardCorner className="w-4 h-4 text-rose-400" />
          </h2>
        </div>
      </div>

      {/* 1. User Profile Card (Section 17) */}
      <div
        className={`p-5 ${currentTheme.cardStyle.radius} border ${currentTheme.cardStyle.shadow} space-y-3.5 relative overflow-hidden`}
        style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-13 h-13 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-black/5 dark:border-white/5"
              style={{ backgroundColor: palette.primaryContainer }}
            >
              <span>{userAvatarEmoji}</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold" style={{ color: palette.text }}>
                  {state.user.name}
                </h3>
                {isPremium && (
                  <span className="p-0.5 rounded-full bg-amber-500/20 text-amber-500" title="Bloom Club Pro">
                    <Crown className="w-3.5 h-3.5 fill-amber-500" />
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 italic">
                “{state.user.tagline}”
              </p>
              <p className="text-[10px] text-neutral-400 mt-0.5">
                Member since {state.user.joinedDate} • {state.user.email || 'Local Account'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playSound('tap');
              setIsProfileModalOpen(true);
            }}
            className="p-2 rounded-xl border flex items-center gap-1.5 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            style={{ borderColor: palette.outline, color: palette.text }}
          >
            <Edit3 className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Edit Profile</span>
          </button>
        </div>

        {state.user.bio && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400 border-t border-black/5 dark:border-white/5 pt-2 leading-relaxed">
            {state.user.bio}
          </p>
        )}
      </div>

      {/* 2. BloomEra Freemium Subscription Tier (Section 16 / Section 17) */}
      <div
        className={`p-5 ${currentTheme.cardStyle.radius} border ${currentTheme.cardStyle.shadow} space-y-3.5 relative overflow-hidden`}
        style={{
          backgroundColor: isPremium ? (state.darkMode ? '#1A1813' : '#FFFDF7') : palette.surface,
          borderColor: isPremium ? '#D4AF37' : palette.cardBorder,
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`p-1.5 rounded-xl ${
                isPremium ? 'bg-amber-500/20 text-amber-500' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
              }`}
            >
              <Crown className={`w-4 h-4 ${isPremium ? 'fill-amber-500' : ''}`} />
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Subscription Tier (Freemium Entitlement Model)
              </span>
              <h3 className="text-base font-bold flex items-center gap-2" style={{ color: palette.text }}>
                {isPremium ? 'Bloom Club Membership' : 'Bloom Free Plan'}
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    isPremium
                      ? 'bg-amber-500 text-white'
                      : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200'
                  }`}
                >
                  {isPremium ? 'PRO ACTIVE' : 'FREE TIER'}
                </span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playSound('tap');
                setIsPricingModalOpen(true);
              }}
              className="p-1.5 rounded-xl border text-neutral-400 hover:text-amber-500 transition-colors"
              style={{ borderColor: palette.outline }}
              title="Configure Pricing in Sandbox"
            >
              <Sliders className="w-4 h-4" />
            </button>
            <button
              onClick={() => openUpgradeModal()}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all hover:scale-102 active:scale-98"
              style={{
                backgroundColor: isPremium ? palette.surfaceElevated : '#D4AF37',
                borderColor: isPremium ? '#D4AF37' : 'transparent',
                color: isPremium ? '#D4AF37' : '#FFFFFF',
              }}
            >
              {isPremium ? 'View Benefits' : 'Upgrade to Pro'}
            </button>
          </div>
        </div>

        {/* Feature status badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
          <div className="p-2 rounded-xl border border-black/5 dark:border-white/5" style={{ backgroundColor: palette.surfaceElevated }}>
            <span className="text-neutral-400 block text-[9px] uppercase">Habits Limit</span>
            <span className="font-bold">{isPremium ? 'Unlimited' : `${state.habits.length} / 5 habits`}</span>
          </div>
          <div className="p-2 rounded-xl border border-black/5 dark:border-white/5" style={{ backgroundColor: palette.surfaceElevated }}>
            <span className="text-neutral-400 block text-[9px] uppercase">Goals Limit</span>
            <span className="font-bold">{isPremium ? 'Unlimited' : `${state.goals.length} / 3 goals`}</span>
          </div>
          <div className="p-2 rounded-xl border border-black/5 dark:border-white/5" style={{ backgroundColor: palette.surfaceElevated }}>
            <span className="text-neutral-400 block text-[9px] uppercase">Themes Access</span>
            <span className="font-bold">{isPremium ? 'All 6 Luxury' : '2 Free (Blush & Sage)'}</span>
          </div>
          <div className="p-2 rounded-xl border border-black/5 dark:border-white/5" style={{ backgroundColor: palette.surfaceElevated }}>
            <span className="text-neutral-400 block text-[9px] uppercase">Reports & Ledgers</span>
            <span className="font-bold">{isPremium ? 'CSV & Executive' : 'Basic JSON only'}</span>
          </div>
        </div>

        {/* Instant 1-click tier switcher for test & validation */}
        <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5 text-xs">
          <span className="text-neutral-400 text-[11px]">Sandbox Tier Switcher:</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                playSound('tap');
                setSubscriptionTier('free');
              }}
              className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] border transition-all ${
                !isPremium ? 'bg-neutral-800 text-white border-neutral-700' : 'text-neutral-400 hover:text-white border-transparent'
              }`}
            >
              Free Plan
            </button>
            <button
              onClick={() => {
                playSound('bloom');
                setSubscriptionTier('premium');
              }}
              className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] border transition-all ${
                isPremium ? 'bg-amber-500 text-white border-amber-600 shadow-xs' : 'text-neutral-400 hover:text-amber-400 border-transparent'
              }`}
            >
              Bloom Club (Pro)
            </button>
          </div>
        </div>
      </div>

      {/* 3. Theme Selection Gallery — 6 Distinct Complete Visual Identities (Theme System Requirements) */}
      <div
        className={`p-5 ${currentTheme.cardStyle.radius} border ${currentTheme.cardStyle.shadow} space-y-3.5`}
        style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4" style={{ color: palette.primary }} />
            <h3 className="text-sm font-semibold" style={{ color: palette.text }}>
              Theme Gallery & Live Previews
            </h3>
          </div>
          <span
            className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ backgroundColor: palette.primaryContainer, color: palette.onPrimaryContainer }}
          >
            {THEME_LIST.length} Themes
          </span>
        </div>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Preview any aesthetic live across every screen before applying. Themes include custom typography, card geometry, background watermarks, and audio pitch.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {THEME_LIST.map((t) => {
            const isSelected = state.theme === t.id;
            const isPreviewingThis = previewThemeId === t.id;

            return (
              <div
                key={t.id}
                className={`p-4 ${t.cardStyle.radius} border flex flex-col justify-between text-left transition-all relative overflow-hidden ${
                  isSelected
                    ? 'ring-2 ring-rose-400/90 shadow-md'
                    : isPreviewingThis
                    ? 'ring-2 ring-amber-400/90 shadow-md'
                    : 'hover:border-neutral-400/40'
                }`}
                style={{
                  backgroundColor: palette.surfaceElevated,
                  borderColor: isSelected ? palette.primary : palette.outline,
                }}
              >
                {/* Header: Dot + Motif symbol + Name + Pro/Free badge */}
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-7 h-7 rounded-full shadow-inner shrink-0 flex items-center justify-center text-xs"
                      style={{ backgroundColor: t.previewColor }}
                    >
                      <span>{t.decorations.quoteSymbol}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate flex items-center gap-1.5" style={{ color: palette.text }}>
                        {t.name}
                        {t.isPremium ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase bg-amber-500/20 text-amber-500 border border-amber-500/30">
                            PRO
                          </span>
                        ) : (
                          <span className="text-[9px] font-medium px-1.5 py-0.2 rounded-full uppercase bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                            FREE
                          </span>
                        )}
                      </p>
                      <p className="text-[10px] text-neutral-400 truncate">{t.subtitle}</p>
                    </div>
                  </div>

                  {isSelected && (
                    <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-rose-500 text-white flex items-center gap-1 shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                      Active
                    </span>
                  )}
                </div>

                {/* Typography Sample Banner in Theme Display Font */}
                <div
                  className="w-full px-2.5 py-1.5 rounded-lg mb-2 text-center border border-black/5 dark:border-white/5 flex items-center justify-between"
                  style={{ backgroundColor: state.darkMode ? t.dark.surface : t.light.surface }}
                >
                  <span
                    className={`text-sm italic tracking-tight ${t.fontFamily.fontClass}`}
                    style={{ color: state.darkMode ? t.dark.primary : t.light.primary }}
                  >
                    “Bloom in your own time”
                  </span>
                  <span className="text-[9px] font-mono text-neutral-400 uppercase">
                    {t.fontFamily.display.split(',')[0].replace(/'/g, '')}
                  </span>
                </div>

                {/* Theme Motif Doodle Vignette */}
                <div
                  className="w-full py-1.5 px-3 rounded-lg mb-2 flex items-center justify-center border border-black/5 dark:border-white/5 overflow-hidden"
                  style={{
                    backgroundColor: state.darkMode ? `${t.dark.primary}12` : `${t.light.primary}10`,
                  }}
                  title={`${t.name} motif doodle preview`}
                >
                  <ThemeDoodleVignette
                    themeId={t.id}
                    className="w-full h-6"
                    color={state.darkMode ? t.dark.primary : t.light.primary}
                  />
                </div>

                {/* Tagline / visual traits */}
                <p className="text-[10px] text-neutral-400 line-clamp-2 leading-tight">
                  {t.tagline}
                </p>

                {/* Color swatches preview bar */}
                <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-neutral-200/40 dark:border-neutral-700/40">
                  <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: t.light.bg }} title="Light Background" />
                  <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: t.light.primary }} title="Primary Color" />
                  <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: t.light.secondary }} title="Secondary Color" />
                  <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: t.dark.bg }} title="Dark Background" />
                  <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: t.dark.primary }} title="Dark Primary" />
                  <span className="text-[9px] text-neutral-400 ml-auto font-medium capitalize">
                    {t.motif} motif
                  </span>
                </div>

                {/* Theme Action Buttons: Preview & Apply */}
                <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-neutral-200/40 dark:border-neutral-700/40">
                  <button
                    onClick={() => {
                      if (isPreviewingThis) {
                        previewTheme(null);
                      } else {
                        previewTheme(t.id);
                      }
                    }}
                    className={`py-1.5 px-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1 transition-all ${
                      isPreviewingThis
                        ? 'bg-amber-500 text-white border-amber-600'
                        : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                    style={{
                      borderColor: palette.outline,
                      color: isPreviewingThis ? '#FFFFFF' : palette.text,
                    }}
                  >
                    <span>{isPreviewingThis ? 'Exit Preview' : 'Live Preview'}</span>
                  </button>

                  <button
                    onClick={() => applyTheme(t.id)}
                    disabled={isSelected}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all shadow-xs ${
                      isSelected
                        ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-default'
                        : t.isPremium && !isPremium
                        ? 'bg-amber-500 hover:bg-amber-600 text-white'
                        : 'bg-rose-500 hover:bg-rose-600 text-white active:scale-98'
                    }`}
                  >
                    {isSelected ? (
                      'Applied'
                    ) : t.isPremium && !isPremium ? (
                      <>
                        <Crown className="w-3 h-3 fill-white" />
                        <span>Unlock</span>
                      </>
                    ) : (
                      'Apply Theme'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Display & Viewport */}
      <div
        className={`p-5 ${currentTheme.cardStyle.radius} border ${currentTheme.cardStyle.shadow} space-y-3`}
        style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
      >
        <h3 className="text-sm font-semibold" style={{ color: palette.text }}>
          Display & Viewport
        </h3>

        {/* Dark Mode Row */}
        <div className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800 text-xs">
          <div className="flex items-center gap-2">
            {state.darkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            <span style={{ color: palette.text }}>Dark Theme (OLED Friendly)</span>
          </div>
          <button
            onClick={toggleDarkMode}
            className="px-3 py-1 rounded-xl font-semibold border text-xs"
            style={{
              backgroundColor: state.darkMode ? palette.primary : palette.surfaceElevated,
              borderColor: palette.outline,
              color: state.darkMode ? palette.onPrimary : palette.text,
            }}
          >
            {state.darkMode ? 'Enabled (OLED)' : 'Light (Ceramic)'}
          </button>
        </div>

        {/* View Mode */}
        <div className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800 text-xs">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-neutral-400" />
            <span style={{ color: palette.text }}>Viewport Presentation</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setViewMode('phone')}
              className={`px-2.5 py-1 rounded-lg text-xs ${
                state.viewMode === 'phone' ? 'bg-rose-500 text-white font-semibold' : 'text-neutral-400'
              }`}
            >
              Pixel 9 Pro
            </button>
            <button
              onClick={() => setViewMode('canvas')}
              className={`px-2.5 py-1 rounded-lg text-xs ${
                state.viewMode === 'canvas' ? 'bg-rose-500 text-white font-semibold' : 'text-neutral-400'
              }`}
            >
              Expanded
            </button>
          </div>
        </div>

        {/* Tactile Audio */}
        <div className="flex items-center justify-between py-2 text-xs">
          <div className="flex items-center gap-2">
            {state.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-neutral-400" />}
            <span style={{ color: palette.text }}>Haptic Chimes & Tactile Acoustic Feedback</span>
          </div>
          <button
            onClick={toggleSound}
            className="px-3 py-1 rounded-xl font-semibold border text-xs"
            style={{
              backgroundColor: state.soundEnabled ? palette.primary : palette.surfaceElevated,
              borderColor: palette.outline,
              color: state.soundEnabled ? palette.onPrimary : palette.text,
            }}
          >
            {state.soundEnabled ? 'Enabled' : 'Muted'}
          </button>
        </div>
      </div>

      {/* 5. Language & Currency Preferences (Section 17) */}
      <div
        className={`p-5 ${currentTheme.cardStyle.radius} border ${currentTheme.cardStyle.shadow} space-y-4`}
        style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
      >
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold" style={{ color: palette.text }}>
            Language & Currency Preferences
          </h3>
        </div>

        {/* Language Selection */}
        <div>
          <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
            Interface Language
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {LANGUAGES.map((lang) => {
              const isSelected = (state.language || 'en') === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/10 font-bold'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                  }`}
                  style={{ color: palette.text }}
                >
                  <div className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <div className="text-left">
                      <p className="leading-tight">{lang.name}</p>
                      <p className="text-[10px] text-neutral-400">{lang.native}</p>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Currency Preference */}
        <div>
          <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
            Primary Currency
          </label>
          <div className="flex flex-wrap items-center gap-1.5">
            {CURRENCIES.map((c) => (
              <button
                key={c.symbol}
                onClick={() => setCurrency(c.symbol)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                  currency === c.symbol
                    ? 'bg-rose-500 text-white border-rose-600 shadow-xs'
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Notifications & Reminder Preferences (Section 17) */}
      <div
        className={`p-5 ${currentTheme.cardStyle.radius} border ${currentTheme.cardStyle.shadow} space-y-4`}
        style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold" style={{ color: palette.text }}>
              Notifications & Intentional Reminders
            </h3>
          </div>
          <button
            onClick={handleSimulateNotification}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg border text-amber-500 border-amber-500/30 hover:bg-amber-500/10 flex items-center gap-1"
          >
            <span>Test Push</span>
          </button>
        </div>

        <div className="space-y-3 text-xs">
          {/* Morning Intention */}
          <div className="flex items-center justify-between py-2 border-b border-black/5 dark:border-white/5">
            <div>
              <p className="font-semibold" style={{ color: palette.text }}>
                Morning Intention Pulse
              </p>
              <p className="text-[10px] text-neutral-400">Gentle cue to set your 3 core focuses for the day</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={state.notifications?.morningIntentionTime || '07:30'}
                onChange={(e) => updateNotificationPreferences({ morningIntentionTime: e.target.value })}
                className="px-2 py-1 rounded-lg border text-xs font-mono outline-hidden"
                style={{ backgroundColor: palette.surfaceElevated, borderColor: palette.outline, color: palette.text }}
              />
              <button
                onClick={() =>
                  updateNotificationPreferences({
                    morningIntentionEnabled: !state.notifications?.morningIntentionEnabled,
                  })
                }
                className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                  state.notifications?.morningIntentionEnabled !== false ? 'bg-rose-500' : 'bg-neutral-300 dark:bg-neutral-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform ${
                    state.notifications?.morningIntentionEnabled !== false ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Evening Reflection */}
          <div className="flex items-center justify-between py-2 border-b border-black/5 dark:border-white/5">
            <div>
              <p className="font-semibold" style={{ color: palette.text }}>
                Evening Gratitude & Reflection
              </p>
              <p className="text-[10px] text-neutral-400">Evening unwind reflection and sleep routine</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={state.notifications?.eveningReflectionTime || '21:30'}
                onChange={(e) => updateNotificationPreferences({ eveningReflectionTime: e.target.value })}
                className="px-2 py-1 rounded-lg border text-xs font-mono outline-hidden"
                style={{ backgroundColor: palette.surfaceElevated, borderColor: palette.outline, color: palette.text }}
              />
              <button
                onClick={() =>
                  updateNotificationPreferences({
                    eveningReflectionEnabled: !state.notifications?.eveningReflectionEnabled,
                  })
                }
                className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                  state.notifications?.eveningReflectionEnabled !== false ? 'bg-rose-500' : 'bg-neutral-300 dark:bg-neutral-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform ${
                    state.notifications?.eveningReflectionEnabled !== false ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Hydration Reminders */}
          <div className="flex items-center justify-between py-2 border-b border-black/5 dark:border-white/5">
            <div>
              <p className="font-semibold flex items-center gap-1.5" style={{ color: palette.text }}>
                <Droplets className="w-3.5 h-3.5 text-sky-400" />
                Hydration Reminders
              </p>
              <p className="text-[10px] text-neutral-400">Drink a glass of water every 2 hours</p>
            </div>
            <button
              onClick={() =>
                updateNotificationPreferences({
                  hydrationAlerts: !state.notifications?.hydrationAlerts,
                })
              }
              className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                state.notifications?.hydrationAlerts ? 'bg-sky-500' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform ${
                  state.notifications?.hydrationAlerts ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Quiet Hours */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-semibold flex items-center gap-1.5" style={{ color: palette.text }}>
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                Quiet Hours (Do Not Disturb)
              </p>
              <p className="text-[10px] text-neutral-400">Silence all notifications between 22:00 and 07:00</p>
            </div>
            <button
              onClick={() =>
                updateNotificationPreferences({
                  quietHoursEnabled: !state.notifications?.quietHoursEnabled,
                })
              }
              className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                state.notifications?.quietHoursEnabled ? 'bg-indigo-500' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform ${
                  state.notifications?.quietHoursEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 7. Dashboard Customisation (Section 4 / Section 17) */}
      <div
        className={`p-5 ${currentTheme.cardStyle.radius} border ${currentTheme.cardStyle.shadow} space-y-3`}
        style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-semibold" style={{ color: palette.text }}>
              Home Dashboard Layout
            </h3>
          </div>
          <span className="text-xs text-neutral-400 font-medium">
            {visibleCardsCount} of {state.dashboardCards.length} cards visible
          </span>
        </div>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Personalise your home dashboard: drag or move cards up/down, or toggle off cards you do not need right now.
        </p>

        <button
          onClick={() => {
            playSound('tap');
            setIsDashboardModalOpen(true);
          }}
          className="w-full py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          style={{ borderColor: palette.outline, color: palette.text }}
        >
          <Layers className="w-3.5 h-3.5 text-rose-400" />
          <span>Customize Cards & Display Order</span>
        </button>
      </div>

      {/* 8. Data Export & Executive Reports (Section 17 / Section 18) */}
      <div
        className={`p-5 ${currentTheme.cardStyle.radius} border ${currentTheme.cardStyle.shadow} space-y-3.5`}
        style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <h3 className="text-sm font-semibold" style={{ color: palette.text }}>
              Data Export & Reports
            </h3>
          </div>
          {isPremium ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-amber-500/20 text-amber-500">
              Pro Unlocked
            </span>
          ) : (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full uppercase bg-neutral-200 dark:bg-neutral-800 text-neutral-500">
              Bloom Club Only
            </span>
          )}
        </div>
        <p className="text-xs text-neutral-400">
          Export financial ledgers and personal productivity reports for accounting, journals, or personal archives:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {/* CSV Financial Ledger */}
          <button
            onClick={exportFinanceCsv}
            className="p-3 rounded-2xl border text-left flex items-start justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            style={{ borderColor: palette.outline }}
          >
            <div>
              <p className="text-xs font-bold flex items-center gap-1.5" style={{ color: palette.text }}>
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                Financial Ledger (CSV)
              </p>
              <p className="text-[10px] text-neutral-400 mt-0.5">
                All transactions, categories, and accounts in spreadsheet format.
              </p>
            </div>
            {!isPremium && <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />}
          </button>

          {/* Productivity Executive Report */}
          <button
            onClick={exportProductivityReport}
            className="p-3 rounded-2xl border text-left flex items-start justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            style={{ borderColor: palette.outline }}
          >
            <div>
              <p className="text-xs font-bold flex items-center gap-1.5" style={{ color: palette.text }}>
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                Productivity Report (.md)
              </p>
              <p className="text-[10px] text-neutral-400 mt-0.5">
                Comprehensive habits, streaks, tasks, and wellness summary.
              </p>
            </div>
            {!isPremium && <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />}
          </button>
        </div>
      </div>

      {/* 9. Privacy & Offline Local Persistence (Section 18) */}
      <div
        className={`p-5 ${currentTheme.cardStyle.radius} border ${currentTheme.cardStyle.shadow} space-y-3.5`}
        style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold" style={{ color: palette.text }}>
            Privacy & Offline Persistence
          </h3>
        </div>

        {/* Security / 100% On-Device Badge */}
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs leading-relaxed space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <Lock className="w-3.5 h-3.5" />
            <span>100% On-Device Storage Pledge</span>
          </div>
          <p className="text-[11px] opacity-90">
            All routines, finances, notes, cycles, and personal data remain stored strictly on this device. No remote telemetry, no ad tracking, and zero surveillance.
          </p>
        </div>

        {/* Privacy Toggles */}
        <div className="space-y-3 text-xs pt-1">
          {/* Biometric / PIN Lock */}
          <div className="flex items-center justify-between py-2 border-b border-black/5 dark:border-white/5">
            <div>
              <p className="font-semibold" style={{ color: palette.text }}>
                Biometric & PIN Shield
              </p>
              <p className="text-[10px] text-neutral-400">Require device authentication to view finances and cycles</p>
            </div>
            <button
              onClick={() =>
                updatePrivacyPreferences({
                  biometricLockEnabled: !state.privacy?.biometricLockEnabled,
                })
              }
              className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                state.privacy?.biometricLockEnabled ? 'bg-emerald-500' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform ${
                  state.privacy?.biometricLockEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Mask Balances */}
          <div className="flex items-center justify-between py-2 border-b border-black/5 dark:border-white/5">
            <div>
              <p className="font-semibold" style={{ color: palette.text }}>
                Mask Account Balances on Launch
              </p>
              <p className="text-[10px] text-neutral-400">Hide total net worth until tapped</p>
            </div>
            <button
              onClick={() =>
                updatePrivacyPreferences({
                  hideFinancialBalances: !state.privacy?.hideFinancialBalances,
                })
              }
              className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                state.privacy?.hideFinancialBalances ? 'bg-emerald-500' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform ${
                  state.privacy?.hideFinancialBalances ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 9. My Account & Registered Profile */}
      <div
        className={`p-5 ${currentTheme.cardStyle.radius} border ${currentTheme.cardStyle.shadow} space-y-3.5`}
        style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-semibold" style={{ color: palette.text }}>
              My Account
            </h3>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
              state.user.isRegistered
                ? 'bg-emerald-500/20 text-emerald-500'
                : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400'
            }`}
          >
            {state.user.isRegistered ? 'Verified Profile' : 'Guest Mode'}
          </span>
        </div>

        <div
          className="p-3.5 rounded-2xl border space-y-2 text-xs"
          style={{ backgroundColor: palette.surfaceElevated, borderColor: palette.outline }}
        >
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Account Holder:</span>
            <span className="font-bold" style={{ color: palette.text }}>
              {state.user.name}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Registered Email:</span>
            <span className="font-medium" style={{ color: palette.text }}>
              {state.user.email || 'Not registered'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Phone Number:</span>
            <span className="font-medium" style={{ color: palette.text }}>
              {state.user.phoneNumber || 'Not registered'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => {
              playSound('tap');
              setIsAccountModalOpen(true);
            }}
            className="w-full py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            style={{ borderColor: palette.outline, color: palette.text }}
          >
            <User className="w-3.5 h-3.5 text-rose-400" />
            <span>Manage Account & Profile</span>
          </button>

          <button
            onClick={exportMonthlyReportPdf}
            className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-white shadow-xs flex items-center justify-center gap-2 transition-transform active:scale-98"
            style={{ backgroundColor: palette.primary }}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Download Monthly Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* 10. Privacy Policy & Local Trust */}
      <div
        className={`p-5 ${currentTheme.cardStyle.radius} border ${currentTheme.cardStyle.shadow} space-y-3.5`}
        style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold" style={{ color: palette.text }}>
            Privacy Policy & Data Trust
          </h3>
        </div>

        <p className="text-xs text-neutral-400 leading-relaxed">
          BloomEra stores 100% of your habits, financial transactions, wellness logs, and personal documents on your device. We do not use advertising trackers, third-party analytics, or remote cloud surveillance.
        </p>

        <button
          onClick={() => {
            playSound('tap');
            setIsPrivacyModalOpen(true);
          }}
          className="w-full py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          style={{ borderColor: palette.outline, color: palette.text }}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Read In-App Privacy Policy</span>
        </button>

        <button
          onClick={() => {
            if (confirm('Reset BloomEra to the default intentional sample dataset?')) {
              resetData();
            }
          }}
          className="w-full py-2 rounded-xl text-xs text-neutral-400 hover:text-rose-500 transition-colors flex items-center justify-center gap-1.5"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset to Clean Demo Dataset</span>
        </button>
      </div>

      {/* Footer info */}
      <div className="text-center text-xs text-neutral-400 space-y-1 pt-2">
        <p className="font-serif-bloom italic font-medium text-sm" style={{ color: palette.text }}>
          BloomEra v1.2.0
        </p>
        <p className="text-[11px]">“Your life, beautifully organised.”</p>
        <p className="text-[10px] text-neutral-500">
          Offline-first architecture • Material 3 custom design system
        </p>
      </div>

      {/* Modals */}
      <EditProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
      <PricingConfigModal isOpen={isPricingModalOpen} onClose={() => setIsPricingModalOpen(false)} />
      <DashboardCustomizerModal isOpen={isDashboardModalOpen} onClose={() => setIsDashboardModalOpen(false)} />
      <AccountModal isOpen={isAccountModalOpen} onClose={() => setIsAccountModalOpen(false)} />
      <PrivacyPolicyModal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} />
    </div>
  );
};
