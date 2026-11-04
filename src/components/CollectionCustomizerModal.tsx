import React, { useState } from 'react';
import {
  X,
  Sliders,
  RotateCcw,
  Check,
  Info,
  BookOpen,
  Film,
  Tv,
  Bookmark,
  Star,
  Sparkles,
  Clapperboard,
  Video,
  AlertTriangle,
} from 'lucide-react';
import { useBloom } from '../context/BloomContext';
import { EntertainmentType } from '../types/bloom';
import { ModuleIcon } from './ModuleIcon';

interface CollectionCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVAILABLE_ICONS = [
  { name: 'BookOpen', label: 'Book' },
  { name: 'Film', label: 'Film' },
  { name: 'Tv', label: 'Television' },
  { name: 'Bookmark', label: 'Bookmark' },
  { name: 'Star', label: 'Star' },
  { name: 'Sparkles', label: 'Sparkle' },
  { name: 'Clapperboard', label: 'Cinema' },
  { name: 'Video', label: 'Video' },
];

export const CollectionCustomizerModal: React.FC<CollectionCustomizerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    state,
    currentTheme,
    updateEntertainmentCollectionConfig,
    resetEntertainmentCollectionsToDefault,
    playSound,
  } = useBloom();

  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const palette = state.darkMode ? currentTheme.dark : currentTheme.light;
  const collections = state.entertainmentCollections || [
    { id: 'book', type: 'book', name: 'Books', iconName: 'BookOpen', enabled: true },
    { id: 'movie', type: 'movie', name: 'Movies', iconName: 'Film', enabled: true },
    { id: 'tv', type: 'tv', name: 'TV Shows & Series', iconName: 'Tv', enabled: true },
  ];

  const enabledCount = collections.filter((c) => c.enabled !== false).length;

  const handleToggleCollection = (type: EntertainmentType, currentEnabled: boolean) => {
    if (currentEnabled && enabledCount <= 1) {
      playSound('tap');
      setWarningMessage('At least one media collection must remain enabled.');
      setTimeout(() => setWarningMessage(null), 3000);
      return;
    }
    setWarningMessage(null);
    updateEntertainmentCollectionConfig(type, { enabled: !currentEnabled });
  };

  const handleNameChange = (type: EntertainmentType, newName: string) => {
    updateEntertainmentCollectionConfig(type, { name: newName });
  };

  const handleIconChange = (type: EntertainmentType, iconName: string) => {
    updateEntertainmentCollectionConfig(type, { iconName });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        style={{
          backgroundColor: palette.surface,
          borderColor: palette.cardBorder,
        }}
      >
        {/* Header */}
        <div
          className="p-5 border-b flex items-center justify-between"
          style={{ borderColor: palette.outline }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-2xs"
              style={{
                backgroundColor: palette.surfaceElevated,
                color: palette.primary,
              }}
            >
              <Sliders className="w-5 h-5 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-base font-bold" style={{ color: palette.text }}>
                Customise Collections
              </h3>
              <p className="text-xs text-neutral-400">
                Rename collections, choose icons, and toggle visibility
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playSound('tap');
              onClose();
            }}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Informational tip */}
          <div
            className="p-3.5 rounded-2xl border flex items-start gap-2.5 text-xs"
            style={{
              backgroundColor: palette.surfaceElevated,
              borderColor: palette.cardBorder,
              color: palette.text,
            }}
          >
            <Info className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p className="text-neutral-500 dark:text-neutral-300 leading-relaxed text-[11px]">
              Toggling a collection off hides it from your tabs without deleting any of your saved records or ratings. You can re-enable it at any time.
            </p>
          </div>

          {warningMessage && (
            <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{warningMessage}</span>
            </div>
          )}

          {/* Collection Cards */}
          <div className="space-y-4">
            {collections.map((coll) => {
              const collType = (coll.type || coll.id) as EntertainmentType;
              const isEnabled = coll.enabled !== false;
              const count = (state.entertainment || []).filter((e) => e.type === collType).length;

              return (
                <div
                  key={collType}
                  className={`p-4 rounded-2xl border transition-all space-y-3 ${
                    isEnabled ? 'shadow-2xs' : 'opacity-65'
                  }`}
                  style={{
                    backgroundColor: palette.surfaceElevated,
                    borderColor: isEnabled ? palette.primary : palette.cardBorder,
                  }}
                >
                  {/* Top line: Icon, Name, Count & Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center border shadow-2xs"
                        style={{
                          backgroundColor: palette.surface,
                          borderColor: palette.outline,
                          color: palette.primary,
                        }}
                      >
                        <ModuleIcon name={coll.iconName || 'BookOpen'} className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold" style={{ color: palette.text }}>
                            {coll.name}
                          </h4>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 font-medium">
                            {count} {count === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-400 capitalize">
                          Type: {collType === 'book' ? 'Books' : collType === 'movie' ? 'Movies' : 'TV Shows'}
                        </span>
                      </div>
                    </div>

                    {/* Enable / Disable switch button */}
                    <button
                      type="button"
                      onClick={() => handleToggleCollection(collType, isEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-hidden ${
                        isEnabled ? 'bg-emerald-500' : 'bg-neutral-300 dark:bg-neutral-700'
                      }`}
                      title={isEnabled ? 'Hide collection' : 'Show collection'}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-xs ${
                          isEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Name Input */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                      Display Title
                    </label>
                    <input
                      type="text"
                      value={coll.name}
                      onChange={(e) => handleNameChange(collType, e.target.value)}
                      placeholder="e.g. My Reading Vault"
                      className="w-full px-3 py-1.5 rounded-xl border text-xs focus:outline-hidden transition-colors"
                      style={{
                        backgroundColor: palette.surface,
                        borderColor: palette.outline,
                        color: palette.text,
                      }}
                    />
                  </div>

                  {/* Icon Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                      Icon
                    </label>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {AVAILABLE_ICONS.map((ic) => {
                        const isSelected = (coll.iconName || 'BookOpen') === ic.name;
                        return (
                          <button
                            key={ic.name}
                            type="button"
                            onClick={() => handleIconChange(collType, ic.name)}
                            className={`p-1.5 rounded-xl border text-xs flex items-center gap-1 transition-all ${
                              isSelected
                                ? 'shadow-2xs font-semibold'
                                : 'opacity-70 hover:opacity-100'
                            }`}
                            style={{
                              backgroundColor: isSelected ? palette.primary : palette.surface,
                              borderColor: isSelected ? palette.primary : palette.outline,
                              color: isSelected ? palette.onPrimary : palette.text,
                            }}
                            title={ic.label}
                          >
                            <ModuleIcon name={ic.name} className="w-3.5 h-3.5" />
                            <span className="text-[10px]">{ic.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div
          className="p-4 border-t flex items-center justify-between gap-3"
          style={{ borderColor: palette.outline }}
        >
          <button
            type="button"
            onClick={() => {
              resetEntertainmentCollectionsToDefault();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playSound('tap');
              onClose();
            }}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-xs transition-transform active:scale-95"
            style={{ backgroundColor: palette.primary }}
          >
            <Check className="w-4 h-4" />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
