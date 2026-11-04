import React, { useState } from 'react';
import { X, User, Sparkles, Check, Heart } from 'lucide-react';
import { useBloom } from '../context/BloomContext';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVATAR_OPTIONS = [
  { seed: 'ananya', name: 'Ananya', emoji: '🌸' },
  { seed: 'elena', name: 'Elena', emoji: '🌿' },
  { seed: 'charlotte', name: 'Charlotte', emoji: '✨' },
  { seed: 'maya', name: 'Maya', emoji: '☕' },
  { seed: 'zara', name: 'Zara', emoji: '🌙' },
  { seed: 'chloe', name: 'Chloe', emoji: '🌊' },
  { seed: 'sophia', name: 'Sophia', emoji: '🎀' },
  { seed: 'flora', name: 'Flora', emoji: '🪴' },
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { state, currentTheme, updateUserProfile, playSound } = useBloom();

  const [name, setName] = useState(state.user.name);
  const [tagline, setTagline] = useState(state.user.tagline);
  const [email, setEmail] = useState(state.user.email || '');
  const [bio, setBio] = useState(state.user.bio || '');
  const [avatarSeed, setAvatarSeed] = useState(state.user.avatarSeed);

  if (!isOpen) return null;

  const palette = state.darkMode ? currentTheme.dark : currentTheme.light;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateUserProfile({
      name: name.trim(),
      tagline: tagline.trim(),
      email: email.trim(),
      bio: bio.trim(),
      avatarSeed,
    });
    playSound('bloom');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border transition-all duration-300 animate-in slide-in-from-bottom-6 duration-300 max-h-[90vh] flex flex-col"
        style={{
          backgroundColor: palette.surface,
          borderColor: palette.cardBorder,
          color: palette.text,
        }}
      >
        {/* Mobile handle */}
        <div className="sm:hidden w-10 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-semibold" style={{ color: palette.text }}>
              Edit User Profile
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Choose Avatar Seed
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {AVATAR_OPTIONS.map((opt) => {
                const isSelected = avatarSeed === opt.seed;
                return (
                  <button
                    key={opt.seed}
                    type="button"
                    onClick={() => {
                      setAvatarSeed(opt.seed);
                      playSound('tap');
                    }}
                    className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1 transition-all ${
                      isSelected
                        ? 'ring-2 ring-rose-400 bg-rose-500/10 border-rose-400'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                    }`}
                  >
                    <span className="text-xl">{opt.emoji}</span>
                    <span className="text-[10px] font-semibold truncate">{opt.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ananya Rao"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-hidden focus:ring-2 focus:ring-rose-400"
              style={{
                backgroundColor: palette.surfaceElevated,
                borderColor: palette.outline,
                color: palette.text,
              }}
            />
          </div>

          {/* Tagline / Daily Intention */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Personal Intention / Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Designing a calm, intentional life"
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-hidden focus:ring-2 focus:ring-rose-400"
              style={{
                backgroundColor: palette.surfaceElevated,
                borderColor: palette.outline,
                color: palette.text,
              }}
            />
          </div>

          {/* Email (Optional) */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Contact Email (Stored Locally)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. ananya.rao@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-hidden focus:ring-2 focus:ring-rose-400"
              style={{
                backgroundColor: palette.surfaceElevated,
                borderColor: palette.outline,
                color: palette.text,
              }}
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Life Philosophy / Bio
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Brief note about your aspirations..."
              className="w-full px-3.5 py-2 rounded-xl border text-xs outline-hidden focus:ring-2 focus:ring-rose-400 resize-none"
              style={{
                backgroundColor: palette.surfaceElevated,
                borderColor: palette.outline,
                color: palette.text,
              }}
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-colors"
              style={{ borderColor: palette.outline, color: palette.text }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs flex items-center justify-center gap-1.5 transition-transform active:scale-98"
              style={{ backgroundColor: palette.primary }}
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
