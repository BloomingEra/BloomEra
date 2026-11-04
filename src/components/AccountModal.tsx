import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Sparkles,
  Download,
  ShieldCheck,
} from 'lucide-react';
import { useBloom } from '../context/BloomContext';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose }) => {
  const {
    state,
    currentTheme,
    subscription,
    registerUserAccount,
    deactivateUserAccount,
    exportMonthlyReportPdf,
    playSound,
  } = useBloom();

  const user = state.user;
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phoneNumber || '');
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;
  const palette = state.darkMode ? currentTheme.dark : currentTheme.light;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    registerUserAccount(email, phone, name);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleDeactivate = () => {
    deactivateUserAccount();
    setShowDeactivateConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border transition-all duration-300 max-h-[90vh] flex flex-col"
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
            <div
              className="w-9 h-9 rounded-2xl flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: palette.primary }}
            >
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight" style={{ color: palette.text }}>
                My BloomEra Account
              </h3>
              <p className="text-[11px] text-neutral-400">
                {user.isRegistered ? 'Verified Profile' : 'Local Guest Account'}
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

        {/* Form container */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs">
          {/* Registration status banner */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-500" />
              <div>
                <p className="text-xs font-semibold text-rose-500">
                  {user.isRegistered ? 'BloomEra Account Active' : 'Setup Account Profile'}
                </p>
                <p className="text-[10px] text-neutral-400">
                  Secure local identity for exports and personalised reminders.
                </p>
              </div>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-white dark:bg-neutral-800 text-rose-500 font-bold uppercase tracking-wider">
              {subscription.planName}
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                Your Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g., Aanya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border focus:outline-hidden focus:ring-2 focus:ring-rose-400/50"
                  style={{
                    backgroundColor: palette.surfaceElevated,
                    borderColor: palette.outline,
                    color: palette.text,
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                <input
                  type="email"
                  placeholder="e.g., aanya@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border focus:outline-hidden focus:ring-2 focus:ring-rose-400/50"
                  style={{
                    backgroundColor: palette.surfaceElevated,
                    borderColor: palette.outline,
                    color: palette.text,
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
                <input
                  type="tel"
                  placeholder="e.g., +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border focus:outline-hidden focus:ring-2 focus:ring-rose-400/50"
                  style={{
                    backgroundColor: palette.surfaceElevated,
                    borderColor: palette.outline,
                    color: palette.text,
                  }}
                />
              </div>
            </div>

            {saveSuccess && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-semibold py-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Account details saved successfully!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-white shadow-xs transition-transform active:scale-98"
              style={{ backgroundColor: palette.primary }}
            >
              Update Account Details
            </button>
          </form>

          {/* Monthly Executive PDF Report Download */}
          <div
            className="p-3.5 rounded-2xl border"
            style={{
              backgroundColor: palette.surfaceElevated,
              borderColor: palette.outline,
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: palette.text }}>
                  <FileText className="w-4 h-4 text-rose-500" />
                  <span>Monthly Executive Summary</span>
                </div>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Generate a clean, print-ready PDF lifestyle report with habits, finances, and goals.
                </p>
              </div>

              <button
                type="button"
                onClick={exportMonthlyReportPdf}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 active:scale-95 transition-all shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
            </div>
          </div>

          {/* Account Deactivation / Reset Danger Zone */}
          <div className="pt-2 border-t" style={{ borderColor: palette.cardBorder }}>
            {!showDeactivateConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeactivateConfirm(true)}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs text-rose-400 hover:text-rose-600 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Deactivate or Reset Account</span>
              </button>
            ) : (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 space-y-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                  <p className="text-[11px] leading-relaxed">
                    Are you sure? This will remove your registered name, email, and phone number, resetting the profile back to guest mode. Your logged habits and records remain intact on this device.
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleDeactivate}
                    className="flex-1 py-1.5 rounded-lg bg-rose-500 text-white font-semibold text-xs active:scale-95"
                  >
                    Confirm Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeactivateConfirm(false)}
                    className="flex-1 py-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-400 hover:text-neutral-200 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
