import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Tag, AlertCircle } from 'lucide-react';
import { useBloom } from '../context/BloomContext';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose }) => {
  const { state, currentTheme, addEvent, todayStr, playSound } = useBloom();
  const palette = state.darkMode ? currentTheme.dark : currentTheme.light;

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(todayStr);
  const [startTime, setStartTime] = useState('11:00');
  const [endTime, setEndTime] = useState('12:00');
  const [type, setType] = useState<'event' | 'appointment' | 'deadline'>('appointment');
  const [recurring, setRecurring] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [linkedTaskId, setLinkedTaskId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addEvent({
      title: title.trim(),
      date,
      startTime,
      endTime,
      type,
      recurring,
      location: location.trim() || undefined,
      notes: notes.trim() || undefined,
      linkedTaskId: linkedTaskId || undefined,
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
            <Calendar className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-semibold" style={{ color: palette.text }}>
              Add Event / Deadline
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-neutral-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type selector */}
        <div className="flex items-center p-1 rounded-xl mb-4" style={{ backgroundColor: palette.surfaceElevated }}>
          {(['appointment', 'event', 'deadline'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                type === t ? 'shadow-xs' : 'opacity-60'
              }`}
              style={{
                backgroundColor: type === t ? palette.surface : 'transparent',
                color: type === t ? (t === 'deadline' ? '#EF4444' : palette.primary) : palette.textMuted,
              }}
            >
              {t}
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
              placeholder="e.g. CA Sharma Tax Advisory Call"
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

          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1">
              <label className="block text-xs font-medium mb-1 text-neutral-400">
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border text-xs outline-none"
                style={{
                  backgroundColor: palette.surfaceElevated,
                  borderColor: palette.outline,
                  color: palette.text,
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-neutral-400">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border text-xs outline-none"
                style={{
                  backgroundColor: palette.surfaceElevated,
                  borderColor: palette.outline,
                  color: palette.text,
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-neutral-400">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl border text-xs outline-none"
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
                Recurrence
              </label>
              <select
                value={recurring}
                onChange={(e) => setRecurring(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                style={{
                  backgroundColor: palette.surfaceElevated,
                  borderColor: palette.outline,
                  color: palette.text,
                }}
              >
                <option value="none">One-time</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-neutral-400">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Google Meet / Studio"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                style={{
                  backgroundColor: palette.surfaceElevated,
                  borderColor: palette.outline,
                  color: palette.text,
                }}
              />
            </div>
          </div>

          {/* Link to existing task */}
          {state.tasks.length > 0 && (
            <div>
              <label className="block text-xs font-medium mb-1 text-neutral-400">
                Link to Task (optional)
              </label>
              <select
                value={linkedTaskId}
                onChange={(e) => setLinkedTaskId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                style={{
                  backgroundColor: palette.surfaceElevated,
                  borderColor: palette.outline,
                  color: palette.text,
                }}
              >
                <option value="">No linked task</option>
                {state.tasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium mb-1 text-neutral-400">
              Notes
            </label>
            <input
              type="text"
              placeholder="Agenda or reminder notes..."
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
              Add to Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
