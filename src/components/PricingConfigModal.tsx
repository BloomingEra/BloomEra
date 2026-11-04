import React, { useState } from 'react';
import { X, Sliders, ShieldCheck, Check, DollarSign, AlertCircle } from 'lucide-react';
import { useBloom } from '../context/BloomContext';

interface PricingConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PricingConfigModal: React.FC<PricingConfigModalProps> = ({ isOpen, onClose }) => {
  const { state, currentTheme, updatePricingConfig, playSound } = useBloom();

  const [monthly, setMonthly] = useState(state.pricingConfig.monthlyPrice.toString());
  const [annual, setAnnual] = useState(state.pricingConfig.annualPrice.toString());
  const [currencySymbol, setCurrencySymbol] = useState(state.pricingConfig.currencySymbol);

  if (!isOpen) return null;

  const palette = state.darkMode ? currentTheme.dark : currentTheme.light;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const m = parseFloat(monthly);
    const a = parseFloat(annual);
    if (isNaN(m) || isNaN(a) || m <= 0 || a <= 0) return;

    updatePricingConfig({
      monthlyPrice: m,
      annualPrice: a,
      currencySymbol,
    });
    playSound('bloom');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border transition-all duration-300 animate-in slide-in-from-bottom-6 duration-300 max-h-[85vh] flex flex-col"
        style={{
          backgroundColor: palette.surface,
          borderColor: palette.cardBorder,
          color: palette.text,
        }}
      >
        {/* Mobile handle */}
        <div className="sm:hidden w-10 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-semibold" style={{ color: palette.text }}>
              Configure Subscription Pricing
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Google Play Billing Notice */}
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs leading-relaxed space-y-1 mb-4">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Google Play Billing Sandbox & Preview Mode</span>
          </div>
          <p className="text-[11px] opacity-90">
            Per product guidelines, subscription rates are configurable and not locked to unconfirmed estimates. No real transactions or charges occur without explicit Google Play confirmation and active billing client initialization.
          </p>
        </div>

        <form onSubmit={handleSave} className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Currency Symbol Selection */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
              Billing Currency Symbol
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['$', '₹', '€', '£'].map((sym) => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => {
                    setCurrencySymbol(sym);
                    playSound('tap');
                  }}
                  className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                    currencySymbol === sym
                      ? 'bg-amber-500 text-white border-amber-600'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          {/* Monthly Price */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Monthly Subscription Rate ({currencySymbol})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-sm font-bold text-neutral-400">
                {currencySymbol}
              </span>
              <input
                type="number"
                step="0.01"
                min="0.99"
                value={monthly}
                onChange={(e) => setMonthly(e.target.value)}
                required
                className="w-full pl-8 pr-3.5 py-2 rounded-xl border text-sm outline-hidden focus:ring-2 focus:ring-amber-500 font-mono"
                style={{
                  backgroundColor: palette.surfaceElevated,
                  borderColor: palette.outline,
                  color: palette.text,
                }}
              />
            </div>
          </div>

          {/* Annual Price */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Annual Membership Rate ({currencySymbol})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-sm font-bold text-neutral-400">
                {currencySymbol}
              </span>
              <input
                type="number"
                step="0.01"
                min="4.99"
                value={annual}
                onChange={(e) => setAnnual(e.target.value)}
                required
                className="w-full pl-8 pr-3.5 py-2 rounded-xl border text-sm outline-hidden focus:ring-2 focus:ring-amber-500 font-mono"
                style={{
                  backgroundColor: palette.surfaceElevated,
                  borderColor: palette.outline,
                  color: palette.text,
                }}
              />
            </div>
            <p className="text-[10px] text-neutral-400 mt-1">
              Provides ~{Math.max(0, Math.round((1 - parseFloat(annual) / (parseFloat(monthly) * 12 || 1)) * 100))}% savings for annual subscribers.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-colors"
              style={{ borderColor: palette.outline, color: palette.text }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs flex items-center justify-center gap-1.5 transition-transform active:scale-98 bg-amber-500 hover:bg-amber-600"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              Save Pricing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
