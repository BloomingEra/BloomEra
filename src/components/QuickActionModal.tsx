import React, { useState } from 'react';
import { Plus, CheckSquare, Sparkles, DollarSign, StickyNote, X } from 'lucide-react';
import { useBloom } from '../context/BloomContext';
import { LifePillar } from '../types/bloom';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({ isOpen, onClose }) => {
  const { state, currentTheme, currency, addTask, addHabit, addFinance, addNote, playSound, todayStr } = useBloom();
  const palette = state.darkMode ? currentTheme.dark : currentTheme.light;

  const [activeTab, setActiveTab] = useState<'task' | 'habit' | 'finance' | 'note'>('task');

  // Task form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskTime, setTaskTime] = useState('10:00');
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [taskCategory, setTaskCategory] = useState('Work');

  // Habit form
  const [habitTitle, setHabitTitle] = useState('');
  const [habitCategory, setHabitCategory] = useState<'morning' | 'afternoon' | 'evening' | 'anytime'>('morning');

  // Finance form
  const [financeAmount, setFinanceAmount] = useState('');
  const [financeCategory, setFinanceCategory] = useState(state.customCategories[0] || 'Nourishment & Cafes');
  const [financeAccountId, setFinanceAccountId] = useState(state.accounts[0]?.id || 'acc_upi');
  const [financeNote, setFinanceNote] = useState('');

  // Note form
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'task' && taskTitle.trim()) {
      addTask({
        title: taskTitle.trim(),
        dueDate: todayStr,
        dueTime: taskTime,
        priority: taskPriority,
        category: taskCategory,
        customLabels: [],
        recurring: 'none',
        completed: false,
      });
      setTaskTitle('');
    } else if (activeTab === 'habit' && habitTitle.trim()) {
      addHabit({
        title: habitTitle.trim(),
        pillar: 'wellness',
        category: habitCategory,
        frequency: 'daily',
        targetDaysPerWeek: 7,
        color: palette.primary,
        iconName: 'Sparkles',
      });
      setHabitTitle('');
    } else if (activeTab === 'finance' && financeAmount.trim()) {
      const amt = parseFloat(financeAmount);
      if (!isNaN(amt) && amt > 0) {
        addFinance({
          type: 'expense',
          category: financeCategory,
          amount: amt,
          date: todayStr,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: financeNote.trim() || 'Daily expense',
          accountId: financeAccountId,
        });
        setFinanceAmount('');
        setFinanceNote('');
      }
    } else if (activeTab === 'note' && noteTitle.trim()) {
      addNote({
        title: noteTitle.trim(),
        content: noteContent.trim(),
        type: 'note',
        pillar: 'wellness',
        pinned: false,
        colorTag: palette.primary,
        tags: ['quick-capture'],
      });
      setNoteTitle('');
      setNoteContent('');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border transition-all duration-300 animate-in slide-in-from-bottom-6 duration-300"
        style={{
          backgroundColor: palette.surface,
          borderColor: palette.cardBorder,
          color: palette.text,
        }}
      >
        <div className="sm:hidden w-10 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold tracking-tight" style={{ color: palette.text }}>
            Create & Bloom
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          className="flex items-center p-1 rounded-xl mb-4"
          style={{ backgroundColor: palette.surfaceElevated }}
        >
          {[
            { id: 'task', label: 'Task', icon: CheckSquare },
            { id: 'habit', label: 'Habit', icon: Sparkles },
            { id: 'finance', label: 'Expense', icon: DollarSign },
            { id: 'note', label: 'Note', icon: StickyNote },
          ].map((t) => {
            const isSel = activeTab === t.id;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  playSound('tap');
                  setActiveTab(t.id as any);
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                  isSel ? 'shadow-xs' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: isSel ? palette.surface : 'transparent',
                  color: isSel ? palette.primary : palette.textMuted,
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* TASK FORM */}
          {activeTab === 'task' && (
            <>
              <div>
                <label className="block text-xs font-medium mb-1 text-neutral-400">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Studio Design Sprint"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
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
                    Scheduled Time
                  </label>
                  <input
                    type="time"
                    value={taskTime}
                    onChange={(e) => setTaskTime(e.target.value)}
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
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                    style={{
                      backgroundColor: palette.surfaceElevated,
                      borderColor: palette.outline,
                      color: palette.text,
                    }}
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* HABIT FORM */}
          {activeTab === 'habit' && (
            <>
              <div>
                <label className="block text-xs font-medium mb-1 text-neutral-400">
                  Habit Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 20-minute afternoon stroll"
                  value={habitTitle}
                  onChange={(e) => setHabitTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none"
                  style={{
                    backgroundColor: palette.surfaceElevated,
                    borderColor: palette.outline,
                    color: palette.text,
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 text-neutral-400">
                  Time of Day
                </label>
                <select
                  value={habitCategory}
                  onChange={(e) => setHabitCategory(e.target.value as any)}
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
            </>
          )}

          {/* EXPENSE FORM */}
          {activeTab === 'finance' && (
            <>
              <div>
                <label className="block text-xs font-medium mb-1 text-neutral-400">
                  Amount ({currency}) *
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  placeholder="0.00"
                  value={financeAmount}
                  onChange={(e) => setFinanceAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border text-base font-bold outline-none"
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
                    Category
                  </label>
                  <select
                    value={financeCategory}
                    onChange={(e) => setFinanceCategory(e.target.value)}
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
                <div>
                  <label className="block text-xs font-medium mb-1 text-neutral-400">
                    Account
                  </label>
                  <select
                    value={financeAccountId}
                    onChange={(e) => setFinanceAccountId(e.target.value)}
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

              <div>
                <label className="block text-xs font-medium mb-1 text-neutral-400">
                  Note / Merchant
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sourdough loaf & farm butter"
                  value={financeNote}
                  onChange={(e) => setFinanceNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                  style={{
                    backgroundColor: palette.surfaceElevated,
                    borderColor: palette.outline,
                    color: palette.text,
                  }}
                />
              </div>
            </>
          )}

          {/* NOTE FORM */}
          {activeTab === 'note' && (
            <>
              <div>
                <label className="block text-xs font-medium mb-1 text-neutral-400">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Evening reflection"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none"
                  style={{
                    backgroundColor: palette.surfaceElevated,
                    borderColor: palette.outline,
                    color: palette.text,
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 text-neutral-400">
                  Content
                </label>
                <textarea
                  rows={3}
                  placeholder="Write your thoughts..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs outline-none resize-none"
                  style={{
                    backgroundColor: palette.surfaceElevated,
                    borderColor: palette.outline,
                    color: palette.text,
                  }}
                />
              </div>
            </>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-semibold text-xs text-white shadow-xs transition-all active:scale-[0.98]"
              style={{
                backgroundColor: palette.primary,
              }}
            >
              Save & Blossom
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
