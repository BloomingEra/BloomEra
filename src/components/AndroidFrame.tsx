import React, { ReactNode } from 'react';
import { Smartphone, Monitor, Sun, Moon, Volume2, VolumeX, Code, Crown, Sparkles } from 'lucide-react';
import { useBloom } from '../context/BloomContext';
import { THEMES, THEME_LIST } from '../constants/themes';
import { AndroidStatusBar } from './AndroidStatusBar';
import { ThemeBackgroundAmbiance } from './ThemeDecorations';
import { ThemePreviewBanner } from './ThemePreviewBanner';
import { UpgradePlanModal } from './UpgradePlanModal';

interface AndroidFrameProps {
  children: ReactNode;
  onOpenCodeModal?: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children, onOpenCodeModal }) => {
  const {
    state,
    currentTheme,
    setTheme,
    toggleDarkMode,
    toggleSound,
    setViewMode,
    isPremium,
    subscription,
    openUpgradeModal,
    upgradeModalOpen,
    closeUpgradeModal,
    upgradeModalReason,
  } = useBloom();
  const palette = state.darkMode ? currentTheme.dark : currentTheme.light;
  const isPhoneMode = state.viewMode === 'phone';

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans-bloom">
      {/* Top Workspace Control Bar (Strict Top Bar Contract: Brand - Nav/Controls - Primary Action) */}
      <header className="shrink-0 flex items-center justify-between gap-4 px-4 sm:px-8 py-3 bg-neutral-900/90 border-b border-neutral-800 backdrop-blur-md z-40">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl overflow-hidden ring-1 ring-white/20 shadow-sm shrink-0">
            <img
              src="/src/assets/images/bloomera_app_icon_1793594984703.jpg"
              alt="BloomEra Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-white flex items-center gap-2">
              BloomEra
              <span className="hidden md:inline text-xs font-normal text-neutral-400">
                · Your life, beautifully organised.
              </span>
            </h1>
          </div>
        </div>

        {/* Center / Controls: View mode & Theme picker */}
        <div className="flex items-center gap-2">
          {/* Phone vs Canvas toggle */}
          <div className="flex items-center p-0.5 bg-neutral-800 rounded-lg text-xs">
            <button
              onClick={() => setViewMode('phone')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                isPhoneMode
                  ? 'bg-neutral-700 text-white font-medium shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Android Pixel 9 Pro Frame"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Android Frame</span>
            </button>
            <button
              onClick={() => setViewMode('canvas')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                !isPhoneMode
                  ? 'bg-neutral-700 text-white font-medium shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Full Tablet / Desktop Canvas"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Expanded Canvas</span>
            </button>
          </div>

          {/* Quick Theme Color Dots */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-neutral-800 rounded-lg border border-neutral-700/60">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider mr-1">Theme</span>
            {THEME_LIST.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                title={`${t.name} — ${t.subtitle}${t.isPremium ? ' (Pro)' : ' (Free)'}`}
                className={`w-4 h-4 rounded-full transition-all flex items-center justify-center relative ${
                  state.theme === t.id ? 'scale-125 ring-2 ring-white shadow-md' : 'opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: t.previewColor }}
              >
                {t.isPremium && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-amber-400" />
                )}
              </button>
            ))}
          </div>

          {/* Freemium Membership Pill */}
          <button
            onClick={() => openUpgradeModal()}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
              isPremium
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:border-amber-500/40'
            }`}
            title="Manage BloomEra Membership"
          >
            <Crown className={`w-3.5 h-3.5 ${isPremium ? 'text-amber-400 fill-amber-400' : 'text-neutral-400'}`} />
            <span className="hidden sm:inline">{isPremium ? 'Bloom Club' : 'Free Plan'}</span>
          </button>
        </div>

        {/* Right Zone: Sound, Dark Mode & Native Kotlin Code Inspector */}
        <div className="flex items-center gap-2">
          {/* Sound toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title={state.soundEnabled ? 'Mute Haptic Audio' : 'Enable Haptic Audio'}
          >
            {state.soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Dark / Light toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title={state.darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {state.darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Interactive Stage */}
      <main className="flex-1 flex items-center justify-center p-0 sm:p-6 overflow-y-auto bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
        {isPhoneMode ? (
          /* Android 15 Device Frame Mockup */
          <div className="relative my-auto">
            {/* Phone Outer Chassis with metallic edge & buttons */}
            <div className="relative w-[390px] sm:w-[412px] h-[860px] max-h-[92vh] bg-neutral-900 rounded-[52px] p-3 shadow-2xl ring-1 ring-neutral-700/60 ring-inset flex flex-col overflow-hidden">
              <div className="absolute -right-1 top-28 w-1 h-12 bg-neutral-700 rounded-r-sm opacity-80" />
              <div className="absolute -right-1 top-44 w-1 h-16 bg-neutral-700 rounded-r-sm opacity-80" />
              <div className="absolute -right-1 top-64 w-1 h-10 bg-neutral-700 rounded-r-sm opacity-80" />

              {/* Inner High-Res Screen */}
              <div
                className="relative flex-1 w-full rounded-[42px] overflow-hidden flex flex-col transition-colors duration-300 shadow-inner"
                style={{
                  backgroundColor: palette.bg,
                  color: palette.text,
                }}
              >
                {/* Theme Subtle Background Ambiance */}
                <ThemeBackgroundAmbiance />

                {/* Android Status Bar */}
                <AndroidStatusBar />

                {/* Live Theme Preview Banner if active */}
                <ThemePreviewBanner />

                {/* Screen Scrollable Body */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col relative z-10">
                  {children}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Full Expanded Canvas Viewport */
          <div
            className="relative w-full max-w-5xl h-[88vh] rounded-3xl overflow-hidden shadow-2xl border flex flex-col transition-colors duration-300"
            style={{
              backgroundColor: palette.bg,
              borderColor: palette.cardBorder,
              color: palette.text,
            }}
          >
            {/* Theme Subtle Background Ambiance */}
            <ThemeBackgroundAmbiance />

            {/* Embedded Top Status Bar */}
            <AndroidStatusBar />

            {/* Live Theme Preview Banner if active */}
            <ThemePreviewBanner />

            {/* Body */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col relative z-10">
              {children}
            </div>
          </div>
        )}
      </main>

      {/* Upgrade Plan Modal */}
      <UpgradePlanModal
        isOpen={upgradeModalOpen}
        onClose={closeUpgradeModal}
        reason={upgradeModalReason}
      />
    </div>
  );
};
