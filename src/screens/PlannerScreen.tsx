import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  CheckCircle2,
  Circle,
  Trash2,
  Edit2,
  Search,
  Filter,
  ArrowUpDown,
  History,
  AlertTriangle,
  Repeat,
  Tag,
  Check,
  MapPin,
  CalendarDays,
  BookmarkCheck,
} from 'lucide-react';
import { useBloom } from '../context/BloomContext';
import { TaskItem, CalendarEventItem } from '../types/bloom';
import { TaskEditModal } from '../components/TaskEditModal';
import { EventModal } from '../components/EventModal';
import { ThemeCardCorner } from '../components/ThemeDecorations';

interface PlannerScreenProps {
  onOpenQuickAction: () => void;
}

type PlannerMainMode = 'calendar' | 'tasks';
type CalendarSubMode = 'day' | 'week' | 'month';
type TaskFilterStatus = 'all' | 'pending' | 'completed' | 'overdue';

export const PlannerScreen: React.FC<PlannerScreenProps> = ({ onOpenQuickAction }) => {
  const { state, currentTheme, todayStr, toggleTask, deleteTask, deleteEvent, playSound } = useBloom();
  const palette = state.darkMode ? currentTheme.dark : currentTheme.light;

  const [mainMode, setMainMode] = useState<PlannerMainMode>('calendar');
  const [calendarMode, setCalendarMode] = useState<CalendarSubMode>('day');
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Modals
  const [taskEditModalOpen, setTaskEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<TaskItem | null>(null);
  const [eventModalOpen, setEventModalOpen] = useState(false);

  // Task search & filter
  const [taskSearch, setTaskSearch] = useState('');
  const [taskCategory, setTaskCategory] = useState('all');

  // 7-day horizon centered on selectedDate
  const weekDays = useMemo(() => {
    const list = [];
    const base = new Date(selectedDate);
    for (let i = -3; i <= 3; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      list.push({ iso, dayName, dayNum });
    }
    return list;
  }, [selectedDate]);

  // Events for selected date
  const eventsForSelectedDate = useMemo(() => {
    return state.events.filter((e) => e.date === selectedDate);
  }, [state.events, selectedDate]);

  // Tasks for selected date
  const tasksForSelectedDate = useMemo(() => {
    return state.tasks.filter((t) => t.dueDate === selectedDate);
  }, [state.tasks, selectedDate]);

  // Upcoming events
  const upcomingEvents = useMemo(() => {
    return state.events
      .filter((e) => e.date >= todayStr)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5);
  }, [state.events, todayStr]);

  // Task filtering
  const filteredTasks = useMemo(() => {
    return state.tasks.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(taskSearch.toLowerCase())) ||
        (t.customLabels && t.customLabels.some((l) => l.toLowerCase().includes(taskSearch.toLowerCase())));
      const matchesCategory = taskCategory === 'all' || t.category === taskCategory;
      return matchesSearch && matchesCategory;
    });
  }, [state.tasks, taskSearch, taskCategory]);

  const overdueTasks = filteredTasks.filter((t) => !t.completed && t.dueDate < todayStr);
  const pendingTasks = filteredTasks.filter((t) => !t.completed && t.dueDate >= todayStr);
  const completedTasks = filteredTasks.filter((t) => t.completed);

  return (
    <div className="flex-1 pb-24 p-4 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Schedule & Organization
          </span>
          <h2
            className={`text-xl font-medium tracking-tight flex items-center gap-2 ${currentTheme.fontFamily.fontClass}`}
            style={{ color: palette.text }}
          >
            Planner & Calendar
            <ThemeCardCorner className="w-4 h-4 text-rose-400" />
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setEventModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800"
            style={{ borderColor: palette.outline, color: palette.text }}
          >
            <CalendarIcon className="w-3.5 h-3.5 text-indigo-400" />
            <span>+ Event</span>
          </button>
          <button
            onClick={() => {
              setTaskToEdit(null);
              setTaskEditModalOpen(true);
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-white shadow-xs"
            style={{ backgroundColor: palette.primary }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Task</span>
          </button>
        </div>
      </div>

      {/* Main Switcher: Calendar View vs Task List */}
      <div
        className="flex items-center p-1 rounded-2xl text-xs"
        style={{ backgroundColor: palette.surfaceElevated }}
      >
        <button
          onClick={() => {
            playSound('tap');
            setMainMode('calendar');
          }}
          className={`flex-1 py-1.5 rounded-xl font-semibold transition-all ${
            mainMode === 'calendar' ? 'shadow-xs' : 'opacity-60 hover:opacity-100'
          }`}
          style={{
            backgroundColor: mainMode === 'calendar' ? palette.surface : 'transparent',
            color: mainMode === 'calendar' ? palette.primary : palette.textMuted,
          }}
        >
          Calendar Engine
        </button>
        <button
          onClick={() => {
            playSound('tap');
            setMainMode('tasks');
          }}
          className={`flex-1 py-1.5 rounded-xl font-semibold transition-all ${
            mainMode === 'tasks' ? 'shadow-xs' : 'opacity-60 hover:opacity-100'
          }`}
          style={{
            backgroundColor: mainMode === 'tasks' ? palette.surface : 'transparent',
            color: mainMode === 'tasks' ? palette.primary : palette.textMuted,
          }}
        >
          Tasks & Checklists ({pendingTasks.length})
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: CALENDAR VIEW */}
      {/* ========================================================================= */}
      {mainMode === 'calendar' && (
        <div className="space-y-4">
          {/* Calendar Granularity Switch: Day / Week / Month */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold" style={{ color: palette.text }}>
              {new Date(selectedDate).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <div
              className="flex items-center p-0.5 rounded-xl text-[11px]"
              style={{ backgroundColor: palette.surfaceElevated }}
            >
              {(['day', 'week', 'month'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    playSound('tap');
                    setCalendarMode(m);
                  }}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                    calendarMode === m ? 'bg-white dark:bg-neutral-800 font-bold shadow-2xs' : 'text-neutral-400'
                  }`}
                  style={{ color: calendarMode === m ? palette.primary : undefined }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* 7-Day Interactive Horizon Strip */}
          <div
            className="p-3 rounded-2xl border flex items-center justify-between gap-1 overflow-x-auto"
            style={{
              backgroundColor: palette.surface,
              borderColor: palette.cardBorder,
            }}
          >
            {weekDays.map((w) => {
              const isSelected = w.iso === selectedDate;
              const isToday = w.iso === todayStr;
              const hasEvents = state.events.some((e) => e.date === w.iso);
              const hasTasks = state.tasks.some((t) => t.dueDate === w.iso);

              return (
                <button
                  key={w.iso}
                  onClick={() => {
                    playSound('tap');
                    setSelectedDate(w.iso);
                  }}
                  className={`flex-1 min-w-[42px] py-2 px-1 rounded-xl flex flex-col items-center transition-all ${
                    isSelected
                      ? 'shadow-xs font-semibold scale-105'
                      : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                  style={{
                    backgroundColor: isSelected ? palette.primaryContainer : 'transparent',
                    color: isSelected ? palette.onPrimaryContainer : palette.text,
                  }}
                >
                  <span className="text-[10px] font-medium uppercase opacity-75">{w.dayName}</span>
                  <span className="text-sm font-bold tabular-nums mt-0.5">{w.dayNum}</span>
                  <div className="flex items-center gap-0.5 mt-1">
                    {hasEvents && <div className="w-1 h-1 rounded-full bg-indigo-400" />}
                    {hasTasks && <div className="w-1 h-1 rounded-full bg-rose-400" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* MONTH CALENDAR GRID (if month mode) */}
          {calendarMode === 'month' && (
            <div
              className="p-4 rounded-3xl border space-y-3"
              style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
            >
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <span key={i} className="font-semibold text-neutral-400 text-[10px] py-1">
                    {d}
                  </span>
                ))}
                {Array.from({ length: 30 }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const dayStr = `2026-11-${String(dayNum).padStart(2, '0')}`;
                  const isSel = dayStr === selectedDate;
                  const hasEv = state.events.some((e) => e.date === dayStr);

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedDate(dayStr);
                        playSound('tap');
                      }}
                      className={`py-2 rounded-xl border flex flex-col items-center justify-center text-xs transition-all ${
                        isSel ? 'ring-2 ring-rose-400 font-bold' : ''
                      }`}
                      style={{
                        backgroundColor: isSel ? palette.primaryContainer : palette.surfaceElevated,
                        borderColor: isSel ? palette.primary : palette.outline,
                        color: isSel ? palette.onPrimaryContainer : palette.text,
                      }}
                    >
                      <span className="tabular-nums font-medium">{dayNum}</span>
                      {hasEv && <div className="w-1 h-1 rounded-full bg-indigo-400 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* DAY SCHEDULE & LINKED TASKS FOR SELECTED DATE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="font-semibold" style={{ color: palette.text }}>
                Schedule for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
              <span className="text-neutral-400">
                {eventsForSelectedDate.length} events · {tasksForSelectedDate.length} tasks
              </span>
            </div>

            {/* Events for this day */}
            <div className="space-y-2">
              {eventsForSelectedDate.length === 0 && tasksForSelectedDate.length === 0 ? (
                <div
                  className="p-6 rounded-2xl border text-center text-xs text-neutral-400"
                  style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
                >
                  Clear schedule for this date.
                </div>
              ) : (
                <>
                  {eventsForSelectedDate.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-3.5 rounded-2xl border flex items-start justify-between gap-3 group"
                      style={{
                        backgroundColor: palette.surface,
                        borderColor: ev.type === 'deadline' ? '#FCA5A5' : palette.cardBorder,
                      }}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            ev.type === 'deadline'
                              ? 'bg-rose-500/10 text-rose-500'
                              : 'bg-indigo-500/10 text-indigo-500'
                          }`}
                        >
                          <CalendarIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-semibold truncate" style={{ color: palette.text }}>
                              {ev.title}
                            </h4>
                            <span
                              className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-md ${
                                ev.type === 'deadline'
                                  ? 'bg-rose-500 text-white'
                                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                              }`}
                            >
                              {ev.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-0.5">
                            <span className="font-mono tabular-nums">{ev.startTime} – {ev.endTime}</span>
                            {ev.location && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="flex items-center gap-0.5">
                                  <MapPin className="w-2.5 h-2.5" />
                                  {ev.location}
                                </span>
                              </>
                            )}
                          </div>
                          {ev.notes && (
                            <p className="text-[11px] text-neutral-400 mt-1 line-clamp-1">
                              {ev.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => deleteEvent(ev.id)}
                        className="p-1 text-neutral-400 hover:text-rose-500 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Tasks for this day */}
                  {tasksForSelectedDate.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className="p-3.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer select-none group"
                      style={{
                        backgroundColor: palette.surface,
                        borderColor: task.completed ? palette.primaryContainer : palette.cardBorder,
                      }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          type="button"
                          className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: task.completed ? palette.primary : palette.surfaceElevated,
                            color: task.completed ? palette.onPrimary : palette.textMuted,
                          }}
                        >
                          {task.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                        </button>
                        <div className="min-w-0">
                          <p
                            className={`text-xs font-semibold truncate ${
                              task.completed ? 'line-through opacity-60' : ''
                            }`}
                            style={{ color: palette.text }}
                          >
                            {task.title}
                          </p>
                          <p className="text-[10px] text-neutral-400">
                            Task · {task.category} {task.dueTime ? `· ${task.dueTime}` : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* UPCOMING EVENTS & DEADLINES LIST */}
          <div
            className="p-5 rounded-3xl border shadow-xs space-y-3"
            style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold" style={{ color: palette.text }}>
                Upcoming Events & Deadlines
              </h3>
              <span className="text-xs text-neutral-400">{upcomingEvents.length} scheduled</span>
            </div>

            <div className="space-y-2">
              {upcomingEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-2.5 rounded-xl flex items-center justify-between text-xs"
                  style={{ backgroundColor: palette.surfaceElevated }}
                >
                  <div className="min-w-0 mr-2">
                    <p className="font-semibold truncate" style={{ color: palette.text }}>
                      {ev.title}
                    </p>
                    <p className="text-[10px] text-neutral-400">
                      {ev.date} · {ev.startTime} · <span className="capitalize">{ev.type}</span>
                    </p>
                  </div>
                  {ev.type === 'deadline' && (
                    <span className="text-[9px] font-bold text-rose-500 uppercase px-1.5 py-0.5 rounded bg-rose-500/10">
                      Deadline
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: TASKS AND TO-DO MANAGER */}
      {/* ========================================================================= */}
      {mainMode === 'tasks' && (
        <div className="space-y-4">
          {/* Search bar */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs"
            style={{ backgroundColor: palette.surface, borderColor: palette.outline }}
          >
            <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <input
              type="text"
              placeholder="Search tasks, labels..."
              value={taskSearch}
              onChange={(e) => setTaskSearch(e.target.value)}
              className="w-full bg-transparent outline-none"
              style={{ color: palette.text }}
            />
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['all', 'Work', 'Personal', 'Wellness', 'Finance'].map((cat) => (
              <button
                key={cat}
                onClick={() => setTaskCategory(cat)}
                className={`px-3 py-1 rounded-xl border whitespace-nowrap transition-all ${
                  taskCategory === cat ? 'font-semibold shadow-xs' : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: taskCategory === cat ? palette.primary : palette.surface,
                  borderColor: taskCategory === cat ? palette.primary : palette.cardBorder,
                  color: taskCategory === cat ? palette.onPrimary : palette.text,
                }}
              >
                {cat === 'all' ? 'All Tasks' : cat}
              </button>
            ))}
          </div>

          {/* Overdue */}
          {overdueTasks.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-rose-500 flex items-center gap-1 px-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Overdue Tasks ({overdueTasks.length})
              </span>
              {overdueTasks.map((t) => (
                <TaskRow
                  key={t.id}
                  task={t}
                  palette={palette}
                  onToggle={() => toggleTask(t.id)}
                  onEdit={() => {
                    setTaskToEdit(t);
                    setTaskEditModalOpen(true);
                  }}
                  onDelete={() => deleteTask(t.id)}
                />
              ))}
            </div>
          )}

          {/* Pending Tasks or Empty State */}
          {filteredTasks.length === 0 ? (
            <div
              className="p-8 rounded-3xl border text-center space-y-3"
              style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
            >
              <div
                className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-rose-400"
                style={{ backgroundColor: palette.primaryContainer }}
              >
                <BookmarkCheck className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-sm font-semibold" style={{ color: palette.text }}>
                  No tasks found
                </h4>
                <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                  {taskSearch || taskCategory !== 'all'
                    ? 'No tasks match your active filter. Try resetting search or filter.'
                    : 'Your agenda is completely clear. Tap "+ Task" to add your first intention.'}
                </p>
              </div>
              <button
                onClick={() => {
                  setTaskToEdit(null);
                  setTaskEditModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white inline-flex items-center gap-1.5 shadow-xs"
                style={{ backgroundColor: palette.primary }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Task</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <span className="text-xs font-semibold text-neutral-400 px-1">
                Active To-do ({pendingTasks.length})
              </span>
              {pendingTasks.length === 0 ? (
                <div
                  className="p-4 rounded-2xl border text-center text-xs text-neutral-400"
                  style={{ backgroundColor: palette.surface, borderColor: palette.cardBorder }}
                >
                  All pending tasks for this filter are complete. Enjoy your calm!
                </div>
              ) : (
                pendingTasks.map((t) => (
                  <TaskRow
                    key={t.id}
                    task={t}
                    palette={palette}
                    onToggle={() => toggleTask(t.id)}
                    onEdit={() => {
                      setTaskToEdit(t);
                      setTaskEditModalOpen(true);
                    }}
                    onDelete={() => deleteTask(t.id)}
                  />
                ))
              )}
            </div>
          )}

          {/* Completed History */}
          {completedTasks.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-xs font-semibold text-neutral-400 px-1 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                Completed Tasks ({completedTasks.length})
              </span>
              {completedTasks.map((t) => (
                <TaskRow
                  key={t.id}
                  task={t}
                  palette={palette}
                  onToggle={() => toggleTask(t.id)}
                  onEdit={() => {
                    setTaskToEdit(t);
                    setTaskEditModalOpen(true);
                  }}
                  onDelete={() => deleteTask(t.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <TaskEditModal
        isOpen={taskEditModalOpen}
        taskToEdit={taskToEdit}
        onClose={() => setTaskEditModalOpen(false)}
      />
      <EventModal
        isOpen={eventModalOpen}
        onClose={() => setEventModalOpen(false)}
      />
    </div>
  );
};

const TaskRow: React.FC<{
  task: TaskItem;
  palette: any;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ task, palette, onToggle, onEdit, onDelete }) => (
  <div
    className="p-3.5 rounded-2xl border flex items-start justify-between gap-3 group"
    style={{
      backgroundColor: palette.surface,
      borderColor: task.completed ? palette.primaryContainer : palette.cardBorder,
    }}
  >
    <button
      onClick={onToggle}
      className="mt-0.5 w-6 h-6 rounded-md flex items-center justify-center shrink-0"
      style={{
        backgroundColor: task.completed ? palette.primary : palette.surfaceElevated,
        color: task.completed ? palette.onPrimary : palette.textMuted,
      }}
    >
      {task.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
    </button>
    <div className="flex-1 min-w-0" onClick={onEdit}>
      <p
        className={`text-xs font-semibold truncate ${task.completed ? 'line-through opacity-60' : ''}`}
        style={{ color: palette.text }}
      >
        {task.title}
      </p>
      {task.description && (
        <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">{task.description}</p>
      )}
      <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-1 font-mono">
        <span>{task.dueDate} {task.dueTime ? `· ${task.dueTime}` : ''}</span>
        <span>· {task.category}</span>
      </div>
    </div>
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
      <button onClick={onEdit} className="p-1 text-neutral-400 hover:text-neutral-700">
        <Edit2 className="w-3.5 h-3.5" />
      </button>
      <button onClick={onDelete} className="p-1 text-neutral-400 hover:text-rose-500">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);
