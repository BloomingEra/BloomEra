import React from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  EyeOff,
  Database,
  Heart,
  CheckCircle2,
} from 'lucide-react';
import { useBloom } from '../context/BloomContext';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  const { state, currentTheme } = useBloom();

  if (!isOpen) return null;
  const palette = state.darkMode ? currentTheme.dark : currentTheme.light;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border transition-all duration-300 max-h-[88vh] flex flex-col"
        style={{
          backgroundColor: palette.surface,
          borderColor: palette.cardBorder,
          color: palette.text,
        }}
      >
        {/* Mobile drag handle */}
        <div className="sm:hidden w-12 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-auto mb-3" />

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center bg-emerald-500/10 text-emerald-500 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight" style={{ color: palette.text }}>
                Privacy Policy & Trust
              </h3>
              <p className="text-[11px] text-neutral-400">
                Your data belongs to you. Zero telemetry, 100% on-device.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Privacy Principles */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
          {/* Commitment Card */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <p className="font-semibold text-xs mb-1">Our Privacy Promise</p>
            <p className="text-[11px] leading-relaxed opacity-90">
              BloomEra was built on the core principle of calm, intimate lifestyle management. We believe personal journals, habit trackers, and financial records should never be tracked, profiled, or commodified.
            </p>
          </div>

          {/* Point 1: 100% On-Device Processing */}
          <div
            className="p-3.5 rounded-2xl border space-y-1.5"
            style={{
              backgroundColor: palette.surfaceElevated,
              borderColor: palette.outline,
            }}
          >
            <div className="flex items-center gap-2 text-xs font-bold" style={{ color: palette.text }}>
              <Database className="w-4 h-4 text-rose-500" />
              <span>1. Complete On-Device Storage</span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              All your tasks, daily habits, financial transactions, debt records, personal inventory, and entertainment ratings are stored locally on your device using sandboxed local storage. No external servers or third-party databases read your personal data.
            </p>
          </div>

          {/* Point 2: Zero Telemetry & Ad Trackers */}
          <div
            className="p-3.5 rounded-2xl border space-y-1.5"
            style={{
              backgroundColor: palette.surfaceElevated,
              borderColor: palette.outline,
            }}
          >
            <div className="flex items-center gap-2 text-xs font-bold" style={{ color: palette.text }}>
              <EyeOff className="w-4 h-4 text-sky-500" />
              <span>2. No Ad Trackers or Behavioral Telemetry</span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              BloomEra contains zero third-party advertising SDKs, no device fingerprinting scripts, and no analytics cookies. We do not track your app usage patterns, screen time, or daily routines.
            </p>
          </div>

          {/* Point 3: Sensitive Wellness & Menstrual Cycle Privacy */}
          <div
            className="p-3.5 rounded-2xl border space-y-1.5"
            style={{
              backgroundColor: palette.surfaceElevated,
              borderColor: palette.outline,
            }}
          >
            <div className="flex items-center gap-2 text-xs font-bold" style={{ color: palette.text }}>
              <Heart className="w-4 h-4 text-pink-500" />
              <span>3. Optional & Private Wellness Tracking</span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Wellness logs, sleep hours, mood notes, and cycle information are strictly optional. They are shielded by your in-app privacy toggle and never shared with healthcare brokers or advertising networks.
            </p>
          </div>

          {/* Point 4: Data Retention & User Control */}
          <div
            className="p-3.5 rounded-2xl border space-y-1.5"
            style={{
              backgroundColor: palette.surfaceElevated,
              borderColor: palette.outline,
            }}
          >
            <div className="flex items-center gap-2 text-xs font-bold" style={{ color: palette.text }}>
              <Lock className="w-4 h-4 text-amber-500" />
              <span>4. Complete User Ownership & Erasure</span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              You maintain 100% control over your data. You can delete or reset any item, habit, financial entry, or your entire account at any moment via Settings or My Account.
            </p>
          </div>

          <div className="text-[10px] text-center text-neutral-400 py-1">
            Last updated: November 2026 · Complies with GDPR, CCPA & Indian Digital Personal Data Protection Act (DPDP).
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t mt-2" style={{ borderColor: palette.cardBorder }}>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-xs font-semibold text-white shadow-xs transition-transform active:scale-98"
            style={{ backgroundColor: palette.primary }}
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
