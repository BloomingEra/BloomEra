import React from 'react';
import {
  X,
  Layers,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useBloom } from '../context/BloomContext';
import { ModuleIcon } from './ModuleIcon';

interface ManageModulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManageModulesModal: React.FC<ManageModulesModalProps> = ({ isOpen, onClose }) => {
  const {
    state,
    currentTheme,
    toggleModuleEnabled,
    toggleModuleHomeShortcut,
    reorderModules,
    resetModulesToDefault,
    playSound,
  } = useBloom();

  if (!isOpen) return null;
  const palette = state.darkMode ? currentTheme.dark : currentTheme.light;
  const modules = state.modulesConfig || [];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border transition-all duration-300 max-h-[90vh] flex flex-col"
        style={{
          backgroundColor: palette.surface,
          borderColor: palette.cardBorder,
          color: palette.text,
        }}
      >
        {/* Mobile handle */}
        <div className="sm:hidden w-12 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-auto mb-3" />

        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-rose-500/10 text-rose-500">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight" style={{ color: palette.text }}>
                Manage My Modules
              </h3>
              <p className="text-[11px] text-neutral-400">
                Choose the features you want active in BloomEra
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

        {/* Safe Data Assurance Notice */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] mb-3">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>
            Disabling a module hides it from your view. <strong>Your records and data are always kept safe</strong> and will reappear if re-enabled.
          </span>
        </div>

        {/* Module list */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-[300px]">
          {modules.map((mod, index) => {
            const isEnabled = mod.enabled;
            return (
              <div
                key={mod.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isEnabled ? 'opacity-100' : 'opacity-50'
                }`}
                style={{
                  backgroundColor: palette.surfaceElevated,
                  borderColor: palette.outline,
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: Icon & Details */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: isEnabled ? `${palette.primary}15` : 'transparent',
                        borderColor: isEnabled ? `${palette.primary}35` : palette.outline,
                        color: isEnabled ? palette.primary : palette.textMuted,
                      }}
                    >
                      <ModuleIcon name={mod.iconName} className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold" style={{ color: palette.text }}>
                          {mod.name}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                            isEnabled
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : 'bg-neutral-500/20 text-neutral-400'
                          }`}
                        >
                          {isEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-relaxed mt-0.5">
                        {mod.description}
                      </p>
                      {/* Home Screen Shortcut Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleModuleHomeShortcut(mod.id)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 mt-1.5 rounded-lg text-[10px] font-semibold border transition-all ${
                          mod.showOnHomeShortcut !== false
                            ? 'border-rose-400/30 text-rose-400 bg-rose-500/10'
                            : 'border-neutral-300 dark:border-neutral-700 text-neutral-400 hover:text-neutral-200'
                        }`}
                        title="Choose whether a shortcut for this module appears on Home"
                      >
                        <span>Home Shortcut: {mod.showOnHomeShortcut !== false ? 'Shown' : 'Hidden'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Right: Toggle & Reorder controls */}
                  <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => toggleModuleEnabled(mod.id)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                        isEnabled ? 'bg-rose-500' : 'bg-neutral-600'
                      }`}
                      role="switch"
                      aria-checked={isEnabled}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          isEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>

                    {/* Move Up */}
                    <button
                      disabled={index === 0}
                      onClick={() => reorderModules(index, index - 1)}
                      className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 disabled:opacity-20 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                      title="Move Up in list"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    {/* Move Down */}
                    <button
                      disabled={index === modules.length - 1}
                      onClick={() => reorderModules(index, index + 1)}
                      className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 disabled:opacity-20 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                      title="Move Down in list"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div
          className="pt-3 border-t flex items-center justify-between gap-3"
          style={{ borderColor: palette.cardBorder }}
        >
          <button
            onClick={() => {
              if (window.confirm('Reset all modules to default enabled order?')) {
                resetModulesToDefault();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-rose-400 transition-colors py-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default</span>
          </button>

          <button
            onClick={() => {
              playSound('tap');
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white shadow-xs transition-transform active:scale-98"
            style={{ backgroundColor: palette.primary }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
