import React from 'react';
import { Eye, Check, X, Crown, Sparkles } from 'lucide-react';
import { useBloom } from '../context/BloomContext';
import { THEMES } from '../constants/themes';

export const ThemePreviewBanner: React.FC = () => {
  const { previewThemeId, previewTheme, applyTheme, isPremium, state, currentTheme } = useBloom();

  if (!previewThemeId) return null;

  const targetTheme = THEMES[previewThemeId] || THEMES['blush-bow'];
  const isTargetPremium = targetTheme.isPremium;
  const canApply = !isTargetPremium || isPremium;

  return (
    <div className="sticky top-0 z-40 w-full px-3 py-2 bg-neutral-900/90 text-white backdrop-blur-md border-b border-white/10 flex items-center justify-between shadow-lg text-xs animate-in slide-in-from-top-2 duration-200">
      <div className="flex items-center gap-2 min-w-0">
        <div
          className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
          style={{ backgroundColor: targetTheme.previewColor }}
        />
        <div className="truncate">
          <span className="text-neutral-400 mr-1.5">Live Preview:</span>
          <strong className="font-semibold">{targetTheme.name}</strong>
          {isTargetPremium && (
            <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300">
              PRO
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => previewTheme(null)}
          className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors flex items-center gap-1"
        >
          <X className="w-3 h-3" />
          <span>Exit Preview</span>
        </button>

        <button
          onClick={() => applyTheme(previewThemeId)}
          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all shadow-xs flex items-center gap-1 ${
            canApply
              ? 'bg-rose-500 hover:bg-rose-600 text-white'
              : 'bg-amber-500 hover:bg-amber-600 text-white'
          }`}
        >
          {canApply ? (
            <>
              <Check className="w-3 h-3 stroke-[2.5]" />
              <span>Apply Theme</span>
            </>
          ) : (
            <>
              <Crown className="w-3 h-3 fill-white" />
              <span>Unlock (Pro)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
