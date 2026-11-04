import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  Film,
  Tv,
  Star,
  Calendar,
  Sparkles,
  Tag,
  AlignLeft,
} from 'lucide-react';
import { useBloom } from '../context/BloomContext';
import {
  EntertainmentItem,
  EntertainmentType,
  ReadingStatus,
  WatchStatus,
} from '../types/bloom';

interface EntertainmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: EntertainmentType;
  editingItem?: EntertainmentItem | null;
}

const PASTEL_COVERS = [
  '#f43f5e', // rose
  '#ec4899', // pink
  '#a855f7', // purple
  '#6366f1', // indigo
  '#0ea5e9', // sky
  '#10b981', // emerald
  '#f59e0b', // amber
  '#78716c', // warm stone
];

export const EntertainmentModal: React.FC<EntertainmentModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'book',
  editingItem = null,
}) => {
  const { currentTheme, state, addEntertainment, editEntertainment, playSound } = useBloom();

  const [type, setType] = useState<EntertainmentType>(defaultType);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [status, setStatus] = useState<ReadingStatus | WatchStatus>('want_to_read');
  const [startDate, setStartDate] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [totalSeasons, setTotalSeasons] = useState<number | ''>(1);
  const [currentSeason, setCurrentSeason] = useState<number | ''>(1);
  const [currentEpisode, setCurrentEpisode] = useState<number | ''>(1);
  const [rating, setRating] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [coverColor, setCoverColor] = useState(PASTEL_COVERS[0]);

  useEffect(() => {
    if (editingItem) {
      setType(editingItem.type);
      setTitle(editingItem.title);
      setAuthor(editingItem.author || '');
      setGenre(editingItem.genre || '');
      setStatus(editingItem.status as ReadingStatus | WatchStatus);
      setStartDate(editingItem.startDate || '');
      setCompletionDate(editingItem.completionDate || '');
      setTotalSeasons(editingItem.totalSeasons ?? 1);
      setCurrentSeason(editingItem.currentSeason ?? 1);
      setCurrentEpisode(editingItem.currentEpisode ?? 1);
      setRating(editingItem.rating || 0);
      setNotes(editingItem.notes || '');
      setCoverColor(editingItem.coverColor || PASTEL_COVERS[0]);
    } else {
      setType(defaultType);
      setTitle('');
      setAuthor('');
      setGenre('');
      setStatus(defaultType === 'book' ? 'reading' : defaultType === 'tv' ? 'watching' : 'want_to_watch');
      setStartDate(new Date().toISOString().split('T')[0]);
      setCompletionDate('');
      setTotalSeasons(1);
      setCurrentSeason(1);
      setCurrentEpisode(1);
      setRating(0);
      setNotes('');
      setCoverColor(PASTEL_COVERS[Math.floor(Math.random() * PASTEL_COVERS.length)]);
    }
  }, [editingItem, defaultType, isOpen]);

  if (!isOpen) return null;
  const palette = state.darkMode ? currentTheme.dark : currentTheme.light;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const baseData = {
      type,
      title: title.trim(),
      genre: genre.trim() || undefined,
      rating: rating > 0 ? rating : undefined,
      notes: notes.trim() || undefined,
      coverColor,
      status,
      startDate: startDate || undefined,
      completionDate: completionDate || undefined,
    };

    if (type === 'book') {
      const bookData = {
        ...baseData,
        author: author.trim() || undefined,
      };
      if (editingItem) {
        editEntertainment(editingItem.id, bookData);
      } else {
        addEntertainment(bookData);
      }
    } else if (type === 'movie') {
      const movieData = {
        ...baseData,
      };
      if (editingItem) {
        editEntertainment(editingItem.id, movieData);
      } else {
        addEntertainment(movieData);
      }
    } else {
      // tv
      const tvData = {
        ...baseData,
        totalSeasons: Number(totalSeasons) || 1,
        currentSeason: Number(currentSeason) || 1,
        currentEpisode: Number(currentEpisode) || 1,
      };
      if (editingItem) {
        editEntertainment(editingItem.id, tvData);
      } else {
        addEntertainment(tvData);
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border transition-all duration-300 max-h-[92vh] flex flex-col"
        style={{
          backgroundColor: palette.surface,
          borderColor: palette.cardBorder,
          color: palette.text,
        }}
      >
        {/* Mobile handle */}
        <div className="sm:hidden w-12 h-1 bg-neutral-300 dark:bg-neutral-700 rounded-full mx-auto mb-3" />

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: coverColor }}
            >
              {type === 'book' && <BookOpen className="w-4 h-4" />}
              {type === 'movie' && <Film className="w-4 h-4" />}
              {type === 'tv' && <Tv className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight" style={{ color: palette.text }}>
                {editingItem ? 'Edit Media Entry' : 'Add to Entertainment Tracker'}
              </h3>
              <p className="text-[11px] text-neutral-400">
                Log books, cinema & series with your personal ratings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
          {/* Media Type Selector */}
          {!editingItem && (
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">
                Collection
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setType('book');
                    setStatus('reading');
                  }}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border font-semibold transition-all ${
                    type === 'book'
                      ? 'bg-rose-500/15 border-rose-500 text-rose-500 shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:border-neutral-300'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Book</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setType('movie');
                    setStatus('watched');
                  }}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border font-semibold transition-all ${
                    type === 'movie'
                      ? 'bg-sky-500/15 border-sky-500 text-sky-500 shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:border-neutral-300'
                  }`}
                >
                  <Film className="w-4 h-4" />
                  <span>Movie</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setType('tv');
                    setStatus('watching');
                  }}
                  className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border font-semibold transition-all ${
                    type === 'tv'
                      ? 'bg-purple-500/15 border-purple-500 text-purple-500 shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-400 hover:border-neutral-300'
                  }`}
                >
                  <Tv className="w-4 h-4" />
                  <span>TV Show</span>
                </button>
              </div>
            </div>
          )}

          {/* Title Input */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              placeholder={type === 'book' ? 'e.g., The Midnight Library' : type === 'movie' ? 'e.g., Interstellar' : 'e.g., Gilmore Girls'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border focus:outline-hidden focus:ring-2 focus:ring-rose-400/50"
              style={{
                backgroundColor: palette.surfaceElevated,
                borderColor: palette.outline,
                color: palette.text,
              }}
            />
          </div>

          {/* Book: Author */}
          {type === 'book' && (
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                Author
              </label>
              <input
                type="text"
                placeholder="e.g., Matt Haig"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border focus:outline-hidden"
                style={{
                  backgroundColor: palette.surfaceElevated,
                  borderColor: palette.outline,
                  color: palette.text,
                }}
              />
            </div>
          )}

          {/* Genre & Cover Accent */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                Genre
              </label>
              <input
                type="text"
                placeholder={type === 'book' ? 'Fiction, Self-Help' : 'Sci-Fi, Drama'}
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border focus:outline-hidden"
                style={{
                  backgroundColor: palette.surfaceElevated,
                  borderColor: palette.outline,
                  color: palette.text,
                }}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                Cover Accent
              </label>
              <div className="flex items-center gap-1.5 pt-1">
                {PASTEL_COVERS.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setCoverColor(col)}
                    className={`w-5 h-5 rounded-full transition-transform ${
                      coverColor === col ? 'scale-125 ring-2 ring-white shadow-xs' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: col }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Status Selector */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl border focus:outline-hidden"
              style={{
                backgroundColor: palette.surfaceElevated,
                borderColor: palette.outline,
                color: palette.text,
              }}
            >
              {type === 'book' && (
                <>
                  <option value="reading">Currently Reading</option>
                  <option value="want_to_read">Want to Read</option>
                  <option value="completed">Completed</option>
                  <option value="on_hold">On Hold</option>
                </>
              )}
              {type === 'movie' && (
                <>
                  <option value="watched">Watched</option>
                  <option value="want_to_watch">Want to Watch</option>
                  <option value="on_hold">On Hold</option>
                </>
              )}
              {type === 'tv' && (
                <>
                  <option value="watching">Currently Watching</option>
                  <option value="want_to_watch">Want to Watch</option>
                  <option value="completed">Completed</option>
                  <option value="on_hold">On Hold</option>
                </>
              )}
            </select>
          </div>

          {/* TV Show Specific: Seasons & Episode tracking */}
          {type === 'tv' && (
            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
              <div>
                <label className="block text-[10px] font-semibold text-purple-300 mb-1">
                  Total Seasons
                </label>
                <input
                  type="number"
                  min="1"
                  value={totalSeasons}
                  onChange={(e) => setTotalSeasons(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-purple-500/30 bg-white/10 text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-purple-300 mb-1">
                  Season
                </label>
                <input
                  type="number"
                  min="1"
                  value={currentSeason}
                  onChange={(e) => setCurrentSeason(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-purple-500/30 bg-white/10 text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-purple-300 mb-1">
                  Episode
                </label>
                <input
                  type="number"
                  min="1"
                  value={currentEpisode}
                  onChange={(e) => setCurrentEpisode(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-purple-500/30 bg-white/10 text-center"
                />
              </div>
            </div>
          )}

          {/* Dates: Start / Completion or Watch Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                {type === 'movie' ? 'Watch Date' : 'Started On'}
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border focus:outline-hidden"
                style={{
                  backgroundColor: palette.surfaceElevated,
                  borderColor: palette.outline,
                  color: palette.text,
                }}
              />
            </div>
            {type !== 'movie' && (
              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                  Completed On
                </label>
                <input
                  type="date"
                  value={completionDate}
                  onChange={(e) => setCompletionDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border focus:outline-hidden"
                  style={{
                    backgroundColor: palette.surfaceElevated,
                    borderColor: palette.outline,
                    color: palette.text,
                  }}
                />
              </div>
            )}
          </div>

          {/* Rating (1-5 stars) */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Rating
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((starVal) => (
                <button
                  key={starVal}
                  type="button"
                  onClick={() => setRating(starVal === rating ? 0 : starVal)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      starVal <= rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-neutral-400 dark:text-neutral-600'
                    }`}
                  />
                </button>
              ))}
              {rating > 0 && (
                <span className="text-xs font-semibold text-amber-400 ml-2">
                  {rating} / 5 stars
                </span>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
              Personal Notes & Reflections
            </label>
            <textarea
              rows={2}
              placeholder="Memorable quotes, thoughts, or feelings..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border focus:outline-hidden resize-none"
              style={{
                backgroundColor: palette.surfaceElevated,
                borderColor: palette.outline,
                color: palette.text,
              }}
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-xs font-semibold text-white shadow-xs transition-transform active:scale-98"
              style={{ backgroundColor: palette.primary }}
            >
              {editingItem ? 'Save Changes' : 'Save Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
