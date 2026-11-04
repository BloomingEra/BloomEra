import React, { useState, useEffect } from 'react';
import { X, CheckSquare, Calendar, Clock, AlertCircle, Tag, Repeat } from 'lucide-react';
import { useBloom } from '../context/BloomContext';
import { TaskItem } from '../types/bloom';

interface TaskEditModalProps {
  isOpen: boolean;
  taskToEdit?: TaskItem | null;
  onClose: () => void;
}

export const TaskEditModal: React.FC<TaskEditModalProps> = ({
  isOpen,
  taskToEdit,
  onClose,
}) => {
  const { state, currentTheme, addTask, editTask, todayStr, playSound } = useBloom();
  const palette = state.darkMode ? currentTheme.dark : currentTheme.light;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(todayStr);
  const [dueTime, setDueTime] = useState('10:00');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState('Work');
  const [labelsStr, setLabelsStr] = useState('');
  const [recurring, setRecurring] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none');
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setDueDate(taskToEdit.dueDate);
      setDueTime(taskToEdit.dueTime || '10:00');
      setPriority(taskToEdit.priority);
      setCategory(taskToEdit.category);
      setLabelsStr(taskToEdit.customLabels ? taskToEdit.customLabels.join(', ') : '');
      setRecurring(taskToEdit.recurring || 'none');
      setLocation(taskToEdit.location || '');
    } else {
      setTitle('');
      setDescription('');
      setDueDate(todayStr);
      setDueTime('10:00');
      setPriority('medium');
      setCategory('Work');
      setLabelsStr('');
      setRecurring('none');
      setLocation('');
    }
  }, [taskToEdit, todayStr, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const customLabels = labelsStr
      .split(',')
      .map((l) => l.trim().toLowerCase())
      .filter((l) => l.length > 0);

    if (taskToEdit) {
      editTask(taskToEdit.id, {
        title: title.trim(),
        description: description.trim(),
        dueDate,
        dueTime,
        priority,
        category,
        customLabels,
        recurring,
        location: location.trim() || undefined,
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        dueDate,
        dueTime,
        priority,
        category,
        customLabels,
        recurring,
        completed: false,
        location: location.trim() || undefined,
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
            <CheckSquare className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-semibold" style={{ color: palette.text }}>
              {taskToEdit ? 'Edit Task' : 'Add New Task'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium mb-1 text-neutral-400">
              Task Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Prepare design specification"
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

          {/* Description */}
          <div>
            <label className="block text-xs font-medium mb-1 text-neutral-400">
              Description & Details
            </label>
            <textarea
              rows={2}
              placeholder="Add notes, key checklist, or context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border text-xs outline-none resize-none"
              style={{
                backgroundColor: palette.surfaceElevated,
                borderColor: palette.outline,
                color: palette.text,
              }}
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-neutral-400">
                Due Date
              </label>
              <input
                type="date"
                required
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
                Time
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                style={{
                  backgroundColor: palette.surfaceElevated,
                  borderColor: palette.outline,
                  color: palette.text,
                }}
              />
            </div>
          </div>

          {/* Priority & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-neutral-400">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
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
                <option value="Work">Work & Studio</option>
                <option value="Personal">Personal & Home</option>
                <option value="Wellness">Wellness & Health</option>
                <option value="Finance">Finance & Bills</option>
                <option value="Errands">Errands & Shopping</option>
              </select>
            </div>
          </div>

          {/* Recurring & Custom Labels */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-neutral-400">
                Recurring Schedule
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
                <option value="none">One-time Task</option>
                <option value="daily">Repeats Daily</option>
                <option value="weekly">Repeats Weekly</option>
                <option value="monthly">Repeats Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-neutral-400">
                Location (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Studio / Meet"
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

          <div>
            <label className="block text-xs font-medium mb-1 text-neutral-400">
              Custom Labels (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. design, client, urgent"
              value={labelsStr}
              onChange={(e) => setLabelsStr(e.target.value)}
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
              {taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
