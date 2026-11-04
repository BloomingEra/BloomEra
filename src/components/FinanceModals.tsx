import React, { useState } from 'react';
import {
  X,
  DollarSign,
  Plus,
  Building,
  Smartphone,
  Banknote,
  ArrowRight,
  User,
  Calendar,
  Wallet,
  Sparkles,
} from 'lucide-react';
import { useBloom } from '../context/BloomContext';
import { TransactionType, AccountType, HabitItem } from '../types/bloom';
import { HABIT_ICONS, getAccountTypeIcon } from '../utils/iconMap';

// 1. TRANSACTION MODAL (Income, Expense, Transfer)
interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ isOpen, onClose }) => {
  const { state, currentTheme, currency, addFinance, todayStr, playSound } = useBloom();
  const palette = state.darkMode ? currentTheme.dark : currentTheme.light;

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Nourishment & Cafes');
  const [accountId, setAccountId] = useState(state.accounts[0]?.id || 'acc_upi');
  const [toAccountId, setToAccountId] = useState(state.accounts[1]?.id || 'acc_bank');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(todayStr);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return;

    addFinance({
      type,
      category: type === 'transfer' ? 'Transfer' : category,
      amount: val,
      date,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      note: note.trim() || (type === 'transfer' ? 'Internal Account Transfer' : 'Expense'),
      accountId,
      toAccountId: type === 'transfer' ? toAccountId : undefined,
    });

    playSound('bloom');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border transition-all duration-300 max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: palette.surface,
          borderColor: palette.cardBorder,
          color: palette.text,
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-semibold" style={{ color: palette.text }}>
              Log Transaction
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-neutral-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type selector: Expense, Income, Transfer */}
        <div className="flex items-center p-1 rounded-xl mb-4" style={{ backgroundColor: palette.surfaceElevated }}>
          {(['expense', 'income', 'transfer'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                type === t ? 'shadow-xs' : 'opacity-60'
              }`}
              style={{
                backgroundColor: type === t ? palette.surface : 'transparent',
                color: type === t ? palette.primary : palette.textMuted,
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Amount */}
          <div>
            <label className="block text-xs font-medium mb-1 text-neutral-400">
              Amount ({currency}) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-base font-bold text-neutral-400">
                {currency}
              </span>
              <input
                type="number"
                step="any"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border text-lg font-bold outline-none"
                style={{
                  backgroundColor: palette.surfaceElevated,
                  borderColor: palette.outline,
                  color: palette.text,
                }}
              />
            </div>
          </div>

          {/* Account */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-neutral-400">
                {type === 'transfer' ? 'From Account' : 'Account'}
              </label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                style={{
                  backgroundColor: palette.surfaceElevated,
                  borderColor: palette.outline,
                  color: palette.text,
                }}
              >
                {state.accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({currency}{a.balance.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            {type === 'transfer' ? (
              <div>
                <label className="block text-xs font-medium mb-1 text-neutral-400">
                  To Account
                </label>
                <select
                  value={toAccountId}
                  onChange={(e) => setToAccountId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                  style={{
                    backgroundColor: palette.surfaceElevated,
                    borderColor: palette.outline,
                    color: palette.text,
                  }}
                >
                  {state.accounts
                    .filter((a) => a.id !== accountId)
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({currency}{a.balance.toLocaleString()})
                      </option>
                    ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium mb-1 text-neutral-400">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                  style={{
                    backgroundColor: palette.surfaceElevated,
                    borderColor: palette.outline,
                    color: palette.text,
                  }}
                >
                  {state.customCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Note & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-neutral-400">
                Note / Merchant
              </label>
              <input
                type="text"
                placeholder="e.g. Blue Tokai matcha"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                style={{
                  backgroundColor: palette.surfaceElevated,
                  borderColor: palette.outline,
                  color: palette.text,
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-neutral-400">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                style={{
                  backgroundColor: palette.surfaceElevated,
                  borderColor: palette.outline,
                  color: palette.text,
                }}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-white shadow-xs transition-transform active:scale-98"
              style={{ backgroundColor: palette.primary }}
            >
              Record Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 2. DEBT MODAL (Lending & Borrowing Ledger)
interface DebtModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DebtModal: React.FC<DebtModalProps> = ({ isOpen, onClose }) => {
  const { state, currentTheme, currency, addDebt, todayStr, playSound } = useBloom();
  const palette = state.darkMode ? currentTheme.dark : currentTheme.light;

  const [type, setType] = useState<'lent' | 'borrowed'>('lent');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [accountId, setAccountId] = useState(state.accounts[0]?.id || 'acc_upi');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0 || !name.trim()) return;

    addDebt({
      type,
      counterpartyName: name.trim(),
      amount: val,
      dueDate: dueDate || undefined,
      notes: notes.trim(),
      date: todayStr,
      accountId,
    });

    playSound('bloom');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border transition-all duration-300 max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: palette.surface,
          borderColor: palette.cardBorder,
          color: palette.text,
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-semibold" style={{ color: palette.text }}>
              Record Lending / Borrowing
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-neutral-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lent vs Borrowed selector */}
        <div className="flex items-center p-1 rounded-xl mb-4" style={{ backgroundColor: palette.surfaceElevated }}>
          <button
            type="button"
            onClick={() => setType('lent')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              type === 'lent' ? 'bg-emerald-500 text-white shadow-xs' : 'opacity-60'
            }`}
          >
            I Lent Money (Who owes me)
          </button>
          <button
            type="button"
            onClick={() => setType('borrowed')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              type === 'borrowed' ? 'bg-amber-500 text-white shadow-xs' : 'opacity-60'
            }`}
          >
            I Borrowed Money (Whom I owe)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium mb-1 text-neutral-400">
              Person's Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Aarav Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none"
              style={{
                backgroundColor: palette.surfaceElevated,
                borderColor: palette.outline,
                color: palette.text,
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-neutral-400">
                Amount ({currency}) *
              </label>
              <input
                type="number"
                step="any"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-sm font-bold outline-none"
                style={{
                  backgroundColor: palette.surfaceElevated,
                  borderColor: palette.outline,
                  color: palette.text,
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-neutral-400">
                Settlement Account
              </label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                style={{
                  backgroundColor: palette.surfaceElevated,
                  borderColor: palette.outline,
                  color: palette.text,
                }}
              >
                {state.accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-neutral-400">
                Expected Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                style={{
                  backgroundColor: palette.surfaceElevated,
                  borderColor: palette.outline,
                  color: palette.text,
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-neutral-400">
                Purpose / Reason
              </label>
              <input
                type="text"
                placeholder="e.g. Dinner bill split"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                style={{
                  backgroundColor: palette.surfaceElevated,
                  borderColor: palette.outline,
                  color: palette.text,
                }}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-white shadow-xs transition-transform active:scale-98"
              style={{ backgroundColor: palette.primary }}
            >
              Record in Ledger
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 3. HABIT MODAL (Add & Edit Habit with Custom Meaningful Icons)
interface HabitModalProps {
  isOpen: boolean;
  habitToEdit?: HabitItem | null;
  onClose: () => void;
}

export const HabitModal: React.FC<HabitModalProps> = ({ isOpen, habitToEdit, onClose }) => {
  const { state, currentTheme, addHabit, editHabit, playSound } = useBloom();
  const palette = state.darkMode ? currentTheme.dark : currentTheme.light;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'morning' | 'afternoon' | 'evening' | 'anytime'>('morning');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [targetDays, setTargetDays] = useState(7);
  const [reminderTime, setReminderTime] = useState('08:00');
  const [iconName, setIconName] = useState('Coffee');
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    if (habitToEdit) {
      setTitle(habitToEdit.title);
      setCategory(habitToEdit.category);
      setFrequency(habitToEdit.frequency || 'daily');
      setTargetDays(habitToEdit.targetDaysPerWeek || 7);
      setReminderTime(habitToEdit.reminderTime || '08:00');
      setIconName(habitToEdit.iconName || 'Coffee');
      setNotes(habitToEdit.notes || '');
    } else {
      setTitle('');
      setCategory('morning');
      setFrequency('daily');
      setTargetDays(7);
      setReminderTime('08:00');
      setIconName('Coffee');
      setNotes('');
    }
  }, [habitToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (habitToEdit) {
      editHabit(habitToEdit.id, {
        title: title.trim(),
        category,
        frequency,
        targetDaysPerWeek: targetDays,
        reminderTime,
        iconName,
        notes: notes.trim(),
      });
    } else {
      addHabit({
        title: title.trim(),
        pillar: 'wellness',
        category,
        frequency,
        targetDaysPerWeek: targetDays,
        reminderTime,
        iconName,
        color: palette.primary,
        notes: notes.trim(),
      });
    }

    playSound('bloom');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border transition-all duration-300 max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: palette.surface,
          borderColor: palette.cardBorder,
          color: palette.text,
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-semibold" style={{ color: palette.text }}>
              {habitToEdit ? 'Edit Habit' : 'Create Custom Habit'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-neutral-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium mb-1 text-neutral-400">
              Habit Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 15 minutes morning mobility"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none"
              style={{
                backgroundColor: palette.surfaceElevated,
                borderColor: palette.outline,
                color: palette.text,
              }}
            />
          </div>

          {/* Meaningful Icon Selector */}
          <div>
            <label className="block text-xs font-medium mb-1.5 text-neutral-400">
              Select Meaningful Icon *
            </label>
            <div className="grid grid-cols-7 gap-2">
              {Object.keys(HABIT_ICONS).map((name) => {
                const IconComp = HABIT_ICONS[name];
                const isSelected = iconName === name;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      setIconName(name);
                      playSound('tap');
                    }}
                    className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
                      isSelected ? 'ring-2 ring-rose-400 scale-105 shadow-xs' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: isSelected ? palette.primaryContainer : palette.surfaceElevated,
                      borderColor: isSelected ? palette.primary : palette.outline,
                      color: isSelected ? palette.onPrimaryContainer : palette.text,
                    }}
                    title={name}
                  >
                    <IconComp className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Routine & Frequency */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-neutral-400">
                Time of Day
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                style={{
                  backgroundColor: palette.surfaceElevated,
                  borderColor: palette.outline,
                  color: palette.text,
                }}
              >
                <option value="morning">Morning Ritual</option>
                <option value="afternoon">Afternoon Flow</option>
                <option value="evening">Evening Unwind</option>
                <option value="anytime">Anytime</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-neutral-400">
                Schedule Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                style={{
                  backgroundColor: palette.surfaceElevated,
                  borderColor: palette.outline,
                  color: palette.text,
                }}
              >
                <option value="daily">Daily Schedule</option>
                <option value="weekly">Weekly Target Days</option>
              </select>
            </div>
          </div>

          {/* Target days & reminder time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-neutral-400">
                Target Days / Week ({targetDays} days)
              </label>
              <input
                type="range"
                min="1"
                max="7"
                value={targetDays}
                onChange={(e) => setTargetDays(parseInt(e.target.value))}
                className="w-full mt-2"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-neutral-400">
                Reminder Time
              </label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                style={{
                  backgroundColor: palette.surfaceElevated,
                  borderColor: palette.outline,
                  color: palette.text,
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1 text-neutral-400">
              Intentional Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Sip slowly before checking notifications"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border text-xs outline-none"
              style={{
                backgroundColor: palette.surfaceElevated,
                borderColor: palette.outline,
                color: palette.text,
              }}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-white shadow-xs transition-transform active:scale-98"
              style={{ backgroundColor: palette.primary }}
            >
              {habitToEdit ? 'Save Changes' : 'Activate Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
