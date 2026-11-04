import React from 'react';
import {
  Sparkles,
  Check,
  X,
  Crown,
  ShieldCheck,
  Zap,
  ArrowRight,
  Flame,
  Palette,
  FileSpreadsheet,
  Lock,
} from 'lucide-react';
import { useBloom } from '../context/BloomContext';

interface UpgradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: string;
}

export const UpgradePlanModal: React.FC<UpgradePlanModalProps> = ({ isOpen, onClose, reason }) => {
  const { currentTheme, state, isPremium, setSubscriptionTier, currency, playSound } = useBloom();
  const palette = state.darkMode ? currentTheme.dark : currentTheme.light;

  if (!isOpen) return null;

  const handleTogglePlan = (targetTier: 'free' | 'premium') => {
    playSound(targetTier === 'premium' ? 'bloom' : 'tap');
    setSubscriptionTier(targetTier);
    if (targetTier === 'premium') {
      setTimeout(() => {
        onClose();
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all"
        style={{
          backgroundColor: palette.surface,
          borderColor: palette.cardBorder,
          color: palette.text,
        }}
      >
        {/* Header Banner */}
        <div className="relative p-6 bg-gradient-to-br from-amber-500/20 via-rose-500/15 to-purple-500/20 border-b border-black/5 dark:border-white/5">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-500">
              <Crown className="w-5 h-5 fill-amber-500" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              BloomEra Subscriptions
            </span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight">
            Bloom Club Membership
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Unlock your full intentional potential with unlimited life management.
          </p>

          {reason && (
            <div className="mt-3 p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
              <span>{reason}</span>
            </div>
          )}
        </div>

        {/* Content Body: Plan comparison */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. FREE PLAN */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                !isPremium
                  ? 'ring-2 ring-neutral-400 dark:ring-neutral-600 bg-neutral-50/60 dark:bg-neutral-800/40'
                  : 'opacity-70 hover:opacity-100'
              }`}
              style={{ borderColor: palette.cardBorder }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Essential
                </span>
                {!isPremium && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200">
                    Current Plan
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold">Bloom Free</h3>
              <p className="text-xl font-extrabold mt-1">
                {currency}0 <span className="text-xs font-normal text-neutral-400">/ forever</span>
              </p>

              <ul className="mt-4 space-y-2 text-xs text-neutral-600 dark:text-neutral-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Essential Home Dashboard</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Up to <strong>5 custom habits</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Up to <strong>3 active goals</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Basic tasks & calendar</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span><strong>2 Free Themes</strong> (Blush Bow, Sage)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Local secure storage</span>
                </li>
              </ul>

              {isPremium && (
                <button
                  onClick={() => handleTogglePlan('free')}
                  className="w-full mt-5 py-2 px-3 rounded-xl border text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  style={{ borderColor: palette.outline }}
                >
                  Downgrade to Free
                </button>
              )}
            </div>

            {/* 2. PREMIUM PLAN */}
            <div
              className={`p-4 rounded-2xl border transition-all relative overflow-hidden ${
                isPremium
                  ? 'ring-2 ring-amber-400 shadow-md bg-amber-500/5'
                  : 'bg-gradient-to-b from-amber-500/10 to-transparent'
              }`}
              style={{
                borderColor: isPremium ? '#D4AF37' : palette.cardBorder,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1">
                  <Crown className="w-3 h-3 fill-amber-500" />
                  Pro Unlimited
                </span>
                {isPremium && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                    Active
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold">Bloom Club</h3>
              <p className="text-xl font-extrabold mt-1 text-amber-600 dark:text-amber-400">
                {state.pricingConfig.currencySymbol}{state.pricingConfig.monthlyPrice}{' '}
                <span className="text-xs font-normal text-neutral-400">/ month (or {state.pricingConfig.currencySymbol}{state.pricingConfig.annualPrice}/yr)</span>
              </p>

              <ul className="mt-4 space-y-2 text-xs">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span><strong>Unlimited</strong> custom habits</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span><strong>Unlimited</strong> personal goals</span>
                </li>
                <li className="flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span><strong>All 6 Luxury Themes</strong> (Midnight Luxe, Ocean, etc.)</span>
                </li>
                <li className="flex items-center gap-2">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span><strong>CSV Export</strong> for financial ledger</span>
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span><strong>Advanced Analytics</strong> & Executive Reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span><strong>Cycle Privacy Lock</strong> & biometric shield</span>
                </li>
              </ul>

              <button
                onClick={() => handleTogglePlan('premium')}
                className={`w-full mt-5 py-2 px-3 rounded-xl text-xs font-bold shadow-md transition-all ${
                  isPremium
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300'
                    : 'bg-amber-500 hover:bg-amber-600 text-white active:scale-98'
                }`}
              >
                {isPremium ? 'Active Membership' : 'Activate Bloom Club (Sandbox)'}
              </button>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
            <p className="font-semibold text-amber-700 dark:text-amber-300 mb-0.5">
              Google Play Billing Sandbox / Preview Mode:
            </p>
            No real payments or subscription charges occur in this sandbox environment. All entitlements are toggleable for product verification.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-50 dark:bg-neutral-900/60 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <span>Cancel or switch tiers anytime with 1 click</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl font-medium hover:text-neutral-700 dark:hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
