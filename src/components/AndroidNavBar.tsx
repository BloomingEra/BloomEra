import React from 'react';
import { Home, Calendar, BarChart3, LayoutGrid, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useBloom } from '../context/BloomContext';

export type NavTab = 'home' | 'planner' | 'insights' | 'modules' | 'settings';

interface AndroidNavBarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const AndroidNavBar: React.FC<AndroidNavBarProps> = ({ currentTab, onSelectTab }) => {
  const { currentTheme, state, playSound } = useBloom();
  const palette = state.darkMode ? currentTheme.dark : currentTheme.light;

  const tabs: {
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'planner', label: 'Planner', icon: Calendar },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
    { id: 'modules', label: 'Modules', icon: LayoutGrid },
    { id: 'settings', label: 'Settings', icon: SlidersHorizontal },
  ];

  return (
    <nav
      aria-label="Main Navigation"
      className="shrink-0 w-full select-none border-t backdrop-blur-xl transition-colors duration-200"
      style={{
        backgroundColor: state.darkMode ? `${palette.surface}f0` : `${palette.surface}f5`,
        borderColor: palette.cardBorder,
      }}
    >
      <div className="grid grid-cols-5 h-16 items-center max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => {
                playSound('tap');
                onSelectTab(tab.id);
              }}
              className="flex flex-col items-center justify-center h-full group focus:outline-none rounded-xl transition-all"
            >
              {/* Theme-Adaptive Active Indicator Pill */}
              <div
                className={`relative px-4 py-1 flex items-center justify-center transition-all duration-300 ${
                  currentTheme.cardStyle.badgeRadius
                } ${isActive ? 'scale-100 shadow-xs' : 'scale-90 group-hover:scale-95'}`}
                style={{
                  backgroundColor: isActive ? palette.primaryContainer : 'transparent',
                }}
              >
                <Icon
                  className={`w-5 h-5 transition-colors duration-200 ${
                    isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                  style={{
                    color: isActive ? palette.onPrimaryContainer : palette.textMuted,
                  }}
                />
              </div>

              {/* Label */}
              <span
                className={`text-[11px] tracking-tight mt-0.5 transition-all duration-200 ${
                  isActive ? 'font-semibold' : 'font-medium'
                }`}
                style={{
                  color: isActive ? palette.primary : palette.textMuted,
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Android Gesture Bar */}
      <div className="w-full flex justify-center pb-2 pt-1">
        <div
          className="w-32 h-1 rounded-full opacity-60 transition-colors"
          style={{
            backgroundColor: palette.textMuted,
          }}
        />
      </div>
    </nav>
  );
};
