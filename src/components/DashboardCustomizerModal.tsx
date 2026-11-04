import React, { useState } from 'react';
import {
  X,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Layout,
  Plus,
  Trash2,
  RotateCcw,
  Sliders,
  Library,
  Maximize2,
  Minimize2,
  Check,
} from 'lucide-react';
import { useBloom } from '../context/BloomContext';
import { INITIAL_APP_STATE } from '../data/seedData';
import { DashboardCardConfig } from '../types/bloom';

interface DashboardCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DashboardCustomizerModal: React.FC<DashboardCustomizerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    state,
    currentTheme,
    reorderDashboardCards,
    toggleDashboardCardVisibility,
    setDashboardCardSize,
    addDashboardWidget,
    removeDashboardWidget,
    resetDashboardToDefault,
    playSound,
  } = useBloom();

  const [activeTab, setActiveTab] = useState<'arrange' | 'library'>('arrange');

  if (!isOpen) return null;
  const palette = state.darkMode ? currentTheme.dark : currentTheme.light;

  const currentCards = state.dashboardCards;
  const currentCardIds = new Set(currentCards.map((c) => c.id));

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
        {/* Mobile drag handle */}
        <div className="sm:hidden w-12 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-auto mb-3" />

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layout className="w-5 h-5 text-rose-400" />
            <div>
              <h3 className="text-base font-bold tracking-tight" style={{ color: palette.text }}>
                Personalise Dashboard
              </h3>
              <p className="text-[11px] text-neutral-400">
                Choose cards, order, and compact or full sizing
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

        {/* Mode switcher tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 mb-3 text-xs">
          <button
            onClick={() => {
              playSound('tap');
              setActiveTab('arrange');
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'arrange'
                ? 'bg-white dark:bg-neutral-700 text-rose-500 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Arrange & Resize ({currentCards.length})</span>
          </button>
          <button
            onClick={() => {
              playSound('tap');
              setActiveTab('library');
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'library'
                ? 'bg-white dark:bg-neutral-700 text-rose-500 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <Library className="w-3.5 h-3.5" />
            <span>Widget Library ({INITIAL_APP_STATE.dashboardCards.length})</span>
          </button>
        </div>

        {/* Tab 1: Arrange & Resize */}
        {activeTab === 'arrange' && (
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[300px]">
            {currentCards.map((card, index) => (
              <div
                key={card.id}
                className={`p-3 rounded-2xl border transition-all ${
                  card.visible ? 'opacity-100' : 'opacity-40'
                }`}
                style={{
                  backgroundColor: palette.surfaceElevated,
                  borderColor: palette.outline,
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      type="button"
                      onClick={() => toggleDashboardCardVisibility(card.id)}
                      className={`p-1.5 rounded-xl border transition-colors ${
                        card.visible
                          ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10'
                          : 'text-neutral-400 border-neutral-300 dark:border-neutral-700'
                      }`}
                      title={card.visible ? 'Hide widget' : 'Show widget'}
                    >
                      {card.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold truncate" style={{ color: palette.text }}>
                          {card.title}
                        </span>
                        {card.category && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-neutral-200/60 dark:bg-neutral-700/60 text-neutral-500 uppercase tracking-wider">
                            {card.category}
                          </span>
                        )}
                      </div>
                      {card.description && (
                        <p className="text-[10px] text-neutral-400 truncate max-w-[200px]">
                          {card.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions: Size switcher, Move up/down, remove */}
                  <div className="flex items-center gap-1 shrink-0">
                    {/* Compact / Full size toggle */}
                    <button
                      type="button"
                      onClick={() => {
                        const newSize = card.size === 'compact' ? 'full' : 'compact';
                        setDashboardCardSize(card.id, newSize);
                      }}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                        card.size === 'compact'
                          ? 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10'
                          : 'border-neutral-300 dark:border-neutral-700 text-neutral-400 hover:text-neutral-200'
                      }`}
                      title="Toggle between Compact (half-width) and Full (full-width) card display"
                    >
                      {card.size === 'compact' ? (
                        <>
                          <Minimize2 className="w-3 h-3" />
                          <span>Half</span>
                        </>
                      ) : (
                        <>
                          <Maximize2 className="w-3 h-3" />
                          <span>Full</span>
                        </>
                      )}
                    </button>

                    {/* Move Up */}
                    <button
                      disabled={index === 0}
                      onClick={() => reorderDashboardCards(index, index - 1)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 disabled:opacity-20 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                      title="Move Up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    {/* Move Down */}
                    <button
                      disabled={index === currentCards.length - 1}
                      onClick={() => reorderDashboardCards(index, index + 1)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 disabled:opacity-20 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                      title="Move Down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {/* Remove from dashboard */}
                    <button
                      onClick={() => removeDashboardWidget(card.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-500/10 transition-colors"
                      title="Remove widget"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Widget Library with Previews */}
        {activeTab === 'library' && (
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 min-h-[300px]">
            <p className="text-[11px] text-neutral-400 px-1">
              Add any module summary, tracker, or motivator to your personal home screen.
            </p>
            {INITIAL_APP_STATE.dashboardCards.map((libCard) => {
              const isIncluded = currentCardIds.has(libCard.id);
              const cardInstance = currentCards.find((c) => c.id === libCard.id);
              const isVisible = cardInstance?.visible ?? false;

              return (
                <div
                  key={libCard.id}
                  className="p-3.5 rounded-2xl border transition-all hover:border-rose-400/50"
                  style={{
                    backgroundColor: palette.surfaceElevated,
                    borderColor: palette.outline,
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold" style={{ color: palette.text }}>
                          {libCard.title}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-rose-500/15 text-rose-400 font-medium uppercase tracking-wider">
                          {libCard.category || 'General'}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-relaxed mb-2">
                        {libCard.description || 'Interactive widget for your daily overview.'}
                      </p>
                      {/* Mini preview pill */}
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-neutral-200/50 dark:bg-neutral-800 text-[10px] text-neutral-400">
                        <span>Default size:</span>
                        <span className="font-semibold text-neutral-200">{libCard.size || 'full'}</span>
                      </div>
                    </div>

                    {/* Add / Status Button */}
                    <div className="shrink-0">
                      {isIncluded ? (
                        <div className="flex flex-col items-end gap-1">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500">
                            <Check className="w-3.5 h-3.5" />
                            {isVisible ? 'Active' : 'Hidden'}
                          </span>
                          {!isVisible && (
                            <button
                              onClick={() => toggleDashboardCardVisibility(libCard.id)}
                              className="text-[10px] text-rose-400 hover:underline"
                            >
                              Unhide
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => addDashboardWidget(libCard.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 active:scale-95 transition-all shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Actions: Reset to default + Apply */}
        <div className="pt-3 border-t flex items-center justify-between gap-3" style={{ borderColor: palette.cardBorder }}>
          <button
            onClick={() => {
              if (window.confirm('Reset dashboard to default arrangement? Your habits and data remain untouched.')) {
                resetDashboardToDefault();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-rose-400 transition-colors py-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Default</span>
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
