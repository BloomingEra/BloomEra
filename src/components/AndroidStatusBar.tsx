import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Bell, Sparkles } from 'lucide-react';
import { useBloom } from '../context/BloomContext';

export const AndroidStatusBar: React.FC = () => {
  const { currentTheme, state, activeNotification, dismissNotification } = useBloom();
  const [timeStr, setTimeStr] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const palette = state.darkMode ? currentTheme.dark : currentTheme.light;

  return (
    <div className="relative z-50">
      {/* Android 15 Status Bar */}
      <div
        className="w-full flex items-center justify-between px-6 pt-3 pb-1 select-none text-xs font-semibold tracking-tight transition-colors duration-200"
        style={{ color: palette.text }}
      >
        {/* Left: Time + subtle notification indicator */}
        <div className="flex items-center gap-1.5">
          <span className="font-medium tracking-normal text-[13px]">{timeStr}</span>
          {activeNotification && (
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse ml-0.5"
              style={{ backgroundColor: palette.primary }}
            />
          )}
        </div>

        {/* Center: Camera Punch-Hole Simulation */}
        <div className="w-4 h-4 rounded-full bg-black/90 ring-1 ring-white/10 flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-neutral-800" />
        </div>

        {/* Right: Android Status Icons */}
        <div className="flex items-center gap-2 text-[12px] opacity-85">
          <span className="text-[10px] font-bold tracking-tighter">5G</span>
          <Wifi className="w-3.5 h-3.5" />
          <div className="flex items-center gap-0.5">
            <BatteryMedium className="w-4 h-4" />
            <span className="text-[10px] tabular-nums font-mono">92%</span>
          </div>
        </div>
      </div>

      {/* Slide-down Android In-App Notification Banner */}
      {activeNotification && (
        <div className="absolute top-12 left-4 right-4 z-50 animate-in slide-in-from-top-4 duration-300">
          <div
            className="p-3.5 rounded-2xl shadow-xl border backdrop-blur-xl flex items-start gap-3"
            style={{
              backgroundColor: state.darkMode ? 'rgba(34, 21, 27, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              borderColor: palette.outline,
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
            }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: palette.primaryContainer, color: palette.primary }}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-xs tracking-tight" style={{ color: palette.text }}>
                  {activeNotification.title}
                </span>
                <span className="text-[10px] text-neutral-400">{activeNotification.time}</span>
              </div>
              <p className="text-xs line-clamp-2 mt-0.5" style={{ color: palette.textMuted }}>
                {activeNotification.body}
              </p>
            </div>
            <button
              onClick={dismissNotification}
              className="text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
