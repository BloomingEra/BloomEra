/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BloomProvider } from './context/BloomContext';
import { AndroidFrame } from './components/AndroidFrame';
import { AndroidNavBar, NavTab } from './components/AndroidNavBar';
import { QuickActionModal } from './components/QuickActionModal';
import { HomeScreen } from './screens/HomeScreen';
import { PlannerScreen } from './screens/PlannerScreen';
import { InsightsScreen } from './screens/InsightsScreen';
import { ModulesScreen } from './screens/ModulesScreen';
import { SettingsScreen } from './screens/SettingsScreen';

function BloomAppContent() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [targetModule, setTargetModule] = useState<string | undefined>(undefined);
  const [quickActionOpen, setQuickActionOpen] = useState(false);

  const handleNavigateToTab = (tab: NavTab, mod?: string) => {
    if (mod) {
      setTargetModule(mod);
    }
    setCurrentTab(tab);
  };

  return (
    <AndroidFrame>
      {/* Active Screen Container */}
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        {currentTab === 'home' && (
          <HomeScreen
            onOpenQuickAction={() => setQuickActionOpen(true)}
            onNavigateToTab={(tab, mod) => handleNavigateToTab(tab, mod)}
          />
        )}
        {currentTab === 'planner' && (
          <PlannerScreen onOpenQuickAction={() => setQuickActionOpen(true)} />
        )}
        {currentTab === 'insights' && <InsightsScreen />}
        {currentTab === 'modules' && (
          <ModulesScreen
            onOpenQuickAction={() => setQuickActionOpen(true)}
            initialModule={targetModule}
          />
        )}
        {currentTab === 'settings' && <SettingsScreen />}
      </div>

      {/* Material 3 Bottom Navigation Bar */}
      <AndroidNavBar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
      />

      {/* Floating Quick Action Modal / Sheet */}
      <QuickActionModal
        isOpen={quickActionOpen}
        onClose={() => setQuickActionOpen(false)}
      />
    </AndroidFrame>
  );
}

export default function App() {
  return (
    <BloomProvider>
      <BloomAppContent />
    </BloomProvider>
  );
}
