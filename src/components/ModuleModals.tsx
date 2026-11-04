import React, { useState } from 'react';
import { X, Target, StickyNote, ShieldCheck, Plus, Trash2, Calendar } from 'lucide-react';
import { useBloom } from '../context/BloomContext';
import { GoalScope, GoalCategory, NoteType, InventoryCategory } from '../types/bloom';

// 1. GOAL MODAL
interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose }) => {
  const { state, currentTheme, addGoal, todayStr, playSound } = useBloom();
  const palette = state.darkMode ? currentTheme.dark : currentTheme.light;

  const [title, setTitle] = useState('');
  const [scope, setScope] = useState<GoalScope>('short-term');
  const [category, setCategory] = useState<GoalCategory>('Career');
  const [targetDate, setTargetDate] = useState('2026-12-31');
  const [notes, setNotes] = useState('');
  const [milestonesText, setMilestonesText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const milestones = milestonesText
      .split('\n')
      .map((m) => m.trim())
      .filter((m) => m.length > 0)
      .map((text, idx) => ({
        id: 'm_' + Date.now() + '_' + idx,
        title: text,
        completed: false,
      }));

    addGoal({
      title: title.trim(),
      scope,
      category,
      pillar: 'goals',
      targetDate,
      milestones: milestones.length > 0 ? milestones : [{ id: 'm1', title: 'Complete first phase', completed: false }],
      notes: notes.trim() || undefined,
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
            <Target className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-semibold" style={{ color: palette.text }}>
              Set Life Goal
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-neutral-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium mb-1 text-neutral-400">
              Goal Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Master Botanical Architectural Illustration"
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-neutral-400">
                Scope
              </label>
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                style={{
                  backgroundColor: palette.surfaceElevated,
                  borderColor: palette.outline,
                  color: palette.text,
                }}
              >
                <option value="short-term">Short-Term (0–6 Months)</option>
                <option value="long-term">Long-Term (1–3 Years)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-neutral-400">
                Category
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
                <option value="Career">Career & Studio</option>
                <option value="Learning">Learning & Craft</option>
                <option value="Personal Development">Personal Development</option>
                <option value="Health & Vitality">Health & Vitality</option>
                <option value="Financial">Financial Independence</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1 text-neutral-400">
              Target Deadline
            </label>
            <input
              type="date"
              required
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
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
              Key Milestones (one per line)
            </label>
            <textarea
              rows={3}
              placeholder="e.g.&#10;Complete foundational sketching course&#10;Deliver 10 botanical portfolio prints&#10;Host exhibition evening"
              value={milestonesText}
              onChange={(e) => setMilestonesText(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border text-xs outline-none resize-none font-sans"
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
              Activate Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 2. NOTE & LIST MODAL
interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({ isOpen, onClose }) => {
  const { state, currentTheme, addNote, playSound } = useBloom();
  const palette = state.darkMode ? currentTheme.dark : currentTheme.light;

  const [title, setTitle] = useState('');
  const [type, setType] = useState<NoteType>('note');
  const [content, setContent] = useState('');
  const [itemsText, setItemsText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let listItems = undefined;
    if (type !== 'note') {
      listItems = itemsText
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((text, idx) => ({
          id: 'li_' + Date.now() + '_' + idx,
          text,
          done: false,
        }));
    }

    addNote({
      title: title.trim(),
      content: content.trim(),
      type,
      listItems,
      pillar: 'notes',
      pinned: false,
      colorTag: palette.primary,
      tags: [type],
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
            <StickyNote className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-semibold" style={{ color: palette.text }}>
              New Note or List
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-neutral-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Note Type selector */}
        <div className="flex items-center p-1 rounded-xl mb-4" style={{ backgroundColor: palette.surfaceElevated }}>
          {(['note', 'shopping', 'checklist', 'tobuy'] as const).map((t) => (
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
              {t === 'tobuy' ? 'To-Buy' : t}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium mb-1 text-neutral-400">
              Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sunday Farmers Market / Travel Packing"
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

          {type === 'note' ? (
            <div>
              <label className="block text-xs font-medium mb-1 text-neutral-400">
                Content
              </label>
              <textarea
                rows={4}
                placeholder="Write your thoughts freely..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border text-xs outline-none resize-none"
                style={{
                  backgroundColor: palette.surfaceElevated,
                  borderColor: palette.outline,
                  color: palette.text,
                }}
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium mb-1 text-neutral-400">
                Checkable Items (one item per line)
              </label>
              <textarea
                rows={5}
                placeholder="e.g.&#10;Organic avocados&#10;Sourdough bread&#10;Cold-pressed olive oil"
                value={itemsText}
                onChange={(e) => setItemsText(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border text-xs outline-none resize-none font-sans"
                style={{
                  backgroundColor: palette.surfaceElevated,
                  borderColor: palette.outline,
                  color: palette.text,
                }}
              />
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-white shadow-xs transition-transform active:scale-98"
              style={{ backgroundColor: palette.primary }}
            >
              Save Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 3. PERSONAL INVENTORY & VAULT MODAL
interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({ isOpen, onClose }) => {
  const { state, currentTheme, currency, addInventoryItem, playSound } = useBloom();
  const palette = state.darkMode ? currentTheme.dark : currentTheme.light;

  const [name, setName] = useState('');
  const [category, setCategory] = useState<InventoryCategory>('document');
  const [provider, setProvider] = useState('');
  const [expiryDate, setExpiryDate] = useState('2027-01-01');
  const [cost, setCost] = useState('');
  const [maskedRef, setMaskedRef] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addInventoryItem({
      name: name.trim(),
      category,
      providerOrBrand: provider.trim() || 'Official Issuer',
      expiryOrRenewalDate: expiryDate,
      costOrValue: cost ? parseFloat(cost) : undefined,
      maskedRefNumber: maskedRef.trim() ? `•••• ${maskedRef.trim().slice(-4)}` : undefined,
      notes: notes.trim(),
      status: 'active',
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
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-semibold" style={{ color: palette.text }}>
              Add to Vault Inventory
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-neutral-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium mb-1 text-neutral-400">
              Item / Document Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Health Insurance Policy / MacBook Pro"
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
                Category
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
                <option value="document">Important Document</option>
                <option value="subscription">Subscription / Service</option>
                <option value="belonging">Valuable Belonging</option>
                <option value="warranty">Warranty Card</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-neutral-400">
                Issuer / Brand
              </label>
              <input
                type="text"
                placeholder="e.g. HDFC ERGO / Apple"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                style={{
                  backgroundColor: palette.surfaceElevated,
                  borderColor: palette.outline,
                  color: palette.text,
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-neutral-400">
                Expiry / Renewal Date
              </label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
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
                Cost or Value ({currency})
              </label>
              <input
                type="number"
                placeholder="0"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
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
              Reference / Policy Number (Stored Masked)
            </label>
            <input
              type="text"
              placeholder="e.g. 4829 (will display as •••• 4829)"
              value={maskedRef}
              onChange={(e) => setMaskedRef(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border text-xs outline-none"
              style={{
                backgroundColor: palette.surfaceElevated,
                borderColor: palette.outline,
                color: palette.text,
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1 text-neutral-400">
              Storage Notes / Location
            </label>
            <input
              type="text"
              placeholder="e.g. Stored in fireproof study pouch"
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
              Secure in Vault
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
