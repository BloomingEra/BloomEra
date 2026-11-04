import React from 'react';
import {
  Home,
  ClipboardCheck,
  Sprout,
  Coins,
  Wallet,
  Calendar,
  CalendarDays,
  Target,
  Heart,
  Droplets,
  Moon,
  Activity,
  BookOpen,
  ShoppingBasket,
  ShoppingBag,
  Package,
  BarChart3,
  SlidersHorizontal,
  Settings,
  Coffee,
  Dumbbell,
  Laptop,
  Languages,
  Smile,
  Brain,
  Utensils,
  Sun,
  Music,
  Sparkles,
  Zap,
  Compass,
  Briefcase,
  Landmark,
  PiggyBank,
  HeartPulse,
  CheckSquare,
  FileText,
  BellRing,
  CreditCard,
  Building,
  Smartphone,
  Banknote,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
} from 'lucide-react';

/**
 * Section 15: Distinctive, meaningful icon system for every module in BloomEra.
 * Consistent vector icons across the app that adapt to current theme strokes and surfaces.
 */
export const MODULE_ICONS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  home: Home,
  tasks: ClipboardCheck,
  habits: Sprout,
  finance: Coins,
  finances: Coins,
  planner: Calendar,
  goals: Target,
  wellness: Heart,
  water: Droplets,
  sleep: Moon,
  exercise: Activity,
  notes: BookOpen,
  shopping: ShoppingBasket,
  inventory: Package,
  vault: Package,
  insights: BarChart3,
  settings: SlidersHorizontal,
};

export const getModuleIcon = (key: string) => {
  const normalized = key.toLowerCase();
  return MODULE_ICONS[normalized] || MODULE_ICONS.home;
};

export const HABIT_ICONS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Coffee,
  Dumbbell,
  Laptop,
  Languages,
  Moon,
  Heart,
  BookOpen,
  Droplets,
  Smile,
  Brain,
  Utensils,
  Sun,
  Music,
  Sparkles,
  Sprout,
  Activity,
  ShoppingBasket,
  Package,
};

export const getHabitIcon = (iconName: string) => {
  return HABIT_ICONS[iconName] || Sparkles;
};

export const getFinanceCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes('nourish') || cat.includes('cafe') || cat.includes('food')) return Coffee;
  if (cat.includes('wellness') || cat.includes('health')) return HeartPulse;
  if (cat.includes('home') || cat.includes('living')) return Home;
  if (cat.includes('learn') || cat.includes('growth') || cat.includes('course')) return BookOpen;
  if (cat.includes('treat') || cat.includes('shopping')) return ShoppingBag;
  if (cat.includes('bill') || cat.includes('util')) return Zap;
  if (cat.includes('travel') || cat.includes('commute')) return Compass;
  if (cat.includes('retainer') || cat.includes('work') || cat.includes('freelance')) return Briefcase;
  if (cat.includes('salary') || cat.includes('income')) return Landmark;
  if (cat.includes('saving') || cat.includes('investment')) return PiggyBank;
  return Coins;
};

export const getAccountTypeIcon = (type: 'cash' | 'bank' | 'upi') => {
  if (type === 'cash') return Banknote;
  if (type === 'bank') return Building;
  if (type === 'upi') return Smartphone;
  return CreditCard;
};

export const getTransactionTypeIcon = (type: 'income' | 'expense' | 'transfer') => {
  if (type === 'income') return ArrowDownLeft;
  if (type === 'expense') return ArrowUpRight;
  return ArrowLeftRight;
};
