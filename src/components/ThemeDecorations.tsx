import React from 'react';
import { useBloom } from '../context/BloomContext';
import { ThemeId } from '../types/bloom';

/**
 * Aesthetic decorative elements & subtle background doodles customized for each of BloomEra's 6 distinct themes:
 * - Blush Bow: Tiny bows, ribbon outlines, small hearts, delicate sparkles, subtle floral doodles.
 * - Sage Garden: Botanical leaves, tiny flowers, branch outlines, organic curves, minimal nature doodles.
 * - Lavender Dream: Crescent moons, stars, clouds, tiny sparkles, dreamy abstract shapes.
 * - Tiramisu: Coffee cup outlines, coffee beans, minimal botanical line art, paper patterns, abstract curves.
 * - Midnight Luxe: Tiny stars, celestial lines, moon details, fine gold decorative outlines, geometric patterns.
 * - Ocean Breeze: Wave outlines, shells, tiny bubbles, seashell line art, minimal coastal elements.
 */

export const ThemeCardCorner: React.FC<{ className?: string; themeId?: ThemeId }> = ({
  className = '',
  themeId,
}) => {
  const { currentTheme, state } = useBloom();
  const motif = themeId ? getMotifByTheme(themeId) : currentTheme.motif;
  const isDark = state.darkMode;
  const color = isDark ? currentTheme.dark.primary : currentTheme.light.primary;
  const opacity = isDark ? 0.45 : 0.55;

  if (motif === 'bow') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`w-4 h-4 pointer-events-none select-none ${className}`}
        style={{ opacity }}
        aria-hidden="true"
      >
        <circle cx="12" cy="11" r="1.8" fill={color} fillOpacity={0.3} />
        <path d="M10.2 11C8.5 8.5 4 8 3.5 11C3 13.5 8.5 13 10.2 11Z" />
        <path d="M13.8 11C15.5 8.5 20 8 20.5 11C21 13.5 15.5 13 13.8 11Z" />
        <path d="M11 12.8C9.5 15.5 8 19 6.5 20.5" />
        <path d="M13 12.8C14.5 15.5 16 19 17.5 20.5" />
      </svg>
    );
  }

  if (motif === 'botanical') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`w-4 h-4 pointer-events-none select-none ${className}`}
        style={{ opacity }}
        aria-hidden="true"
      >
        <path d="M4 20C9 18 14 13 18 5" />
        <path d="M11 15C9.5 13 9 10.5 11 9C13 10.5 12.5 13 11 15Z" fill={color} fillOpacity={0.2} />
        <path d="M15 11C13.5 9 13.5 6.5 15.5 5C17.5 6.5 16.5 9 15 11Z" fill={color} fillOpacity={0.2} />
        <path d="M7 19C7 17 8 15 9.5 14.5" />
      </svg>
    );
  }

  if (motif === 'celestial') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`w-4 h-4 pointer-events-none select-none ${className}`}
        style={{ opacity }}
        aria-hidden="true"
      >
        <path d="M15 3C11 3.5 8 7 8 11.5C8 16 11.5 19.5 16 19.5C17.5 19.5 19 19 20 18C15 17 12 13 13 8C13.5 6 14.5 4.5 15 3Z" fill={color} fillOpacity={0.2} />
        <path d="M5 8L6 5L7 8L10 9L7 10L6 13L5 10L2 9L5 8Z" fill={color} fillOpacity={0.4} strokeWidth="0.8" />
      </svg>
    );
  }

  if (motif === 'tiramisu') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`w-4 h-4 pointer-events-none select-none ${className}`}
        style={{ opacity }}
        aria-hidden="true"
      >
        <path d="M5 9H17V15C17 17.2 15.2 19 13 19H9C6.8 19 5 17.2 5 15V9Z" />
        <path d="M17 11H19C20.1 11 21 11.9 21 13C21 14.1 20.1 15 19 15H17" />
        <path d="M8 5C8 6 9 6.5 9 7.5" />
        <path d="M11 4C11 5.2 12 5.8 12 7" />
        <path d="M14 5C14 6 15 6.5 15 7.5" />
      </svg>
    );
  }

  if (motif === 'luxe') {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`w-4 h-4 pointer-events-none select-none ${className}`}
        style={{ opacity }}
        aria-hidden="true"
      >
        <path d="M12 2L13.8 9.2L21 11L13.8 12.8L12 20L10.2 12.8L3 11L10.2 9.2L12 2Z" fill={color} fillOpacity={0.3} />
        <circle cx="12" cy="11" r="1.2" fill={color} />
        <circle cx="20" cy="4" r="0.8" fill={color} />
        <circle cx="4" cy="18" r="0.8" fill={color} />
      </svg>
    );
  }

  // Ocean Breeze
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`w-4 h-4 pointer-events-none select-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <path d="M4 17C7 15 10 15 13 17C16 19 19 19 22 17" />
      <path d="M12 4C15.5 4 18 7 18 10.5C18 14 15 15.5 12 15.5C9 15.5 6 14 6 10.5C6 7 8.5 4 12 4Z" fill={color} fillOpacity={0.15} />
      <path d="M12 4V15.5" strokeDasharray="1 1.5" />
      <circle cx="19" cy="6" r="1.2" fill={color} fillOpacity={0.4} />
      <circle cx="21" cy="9" r="0.8" fill={color} fillOpacity={0.3} />
    </svg>
  );
};

export const ThemeDivider: React.FC<{ label?: string }> = ({ label }) => {
  const { currentTheme, state } = useBloom();
  const isDark = state.darkMode;
  const color = isDark ? currentTheme.dark.primary : currentTheme.light.primary;
  const borderColor = isDark ? currentTheme.dark.cardBorder : currentTheme.light.cardBorder;

  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-[1px]" style={{ backgroundColor: borderColor }} />
      <div
        className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide uppercase"
        style={{ color }}
      >
        <ThemeCardCorner className="w-3.5 h-3.5" />
        {label && <span>{label}</span>}
      </div>
      <div className="flex-1 h-[1px]" style={{ backgroundColor: borderColor }} />
    </div>
  );
};

function getMotifByTheme(id: ThemeId): string {
  switch (id) {
    case 'blush-bow':
      return 'bow';
    case 'sage-garden':
      return 'botanical';
    case 'lavender-dream':
      return 'celestial';
    case 'tiramisu':
      return 'tiramisu';
    case 'midnight-luxe':
      return 'luxe';
    case 'ocean-breeze':
      return 'ocean';
    default:
      return 'bow';
  }
}

/**
 * Fullscreen Theme-Specific Background Doodles
 * Low-contrast, high legibility, carefully positioned across screen borders, corners, and headers.
 */
export const ThemeBackgroundAmbiance: React.FC = () => {
  const { currentTheme, state } = useBloom();
  const motif = currentTheme.motif;
  const isDark = state.darkMode;
  const strokeColor = isDark ? currentTheme.dark.primary : currentTheme.light.primary;
  const doodleOpacity = isDark ? 0.08 : 0.09;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Soft Top Radial Background Glow */}
      <div
        className="absolute -top-20 -left-20 w-80 h-80 rounded-full blur-3xl transition-all duration-700 pointer-events-none"
        style={{
          backgroundColor: currentTheme.accentColor,
          opacity: isDark ? 0.12 : 0.18,
        }}
      />
      <div
        className="absolute top-1/3 -right-24 w-72 h-72 rounded-full blur-3xl transition-all duration-700 pointer-events-none"
        style={{
          backgroundColor: currentTheme.previewColor,
          opacity: isDark ? 0.08 : 0.14,
        }}
      />
      <div
        className="absolute bottom-12 -left-16 w-60 h-60 rounded-full blur-3xl transition-all duration-700 pointer-events-none"
        style={{
          backgroundColor: currentTheme.accentColor,
          opacity: isDark ? 0.05 : 0.09,
        }}
      />

      {/* Theme 1: Blush Bow Doodles (Tiny bows, ribbon outlines, small hearts, delicate sparkles, floral doodles) */}
      {motif === 'bow' && (
        <>
          {/* Top-Right Big Ribbon & Sparkles */}
          <svg
            className="absolute -right-8 top-10 w-52 h-52 transition-opacity duration-700"
            style={{ opacity: doodleOpacity, color: strokeColor }}
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            {/* Main Bow */}
            <path d="M50 48C40 30 18 32 16 50C14 65 38 62 48 52" />
            <path d="M50 48C60 30 82 32 84 50C86 65 62 62 52 52" />
            <circle cx="50" cy="50" r="5" fill="currentColor" fillOpacity="0.2" />
            <path d="M46 54C42 68 34 82 26 88" />
            <path d="M54 54C58 68 66 82 74 88" />
            {/* Sparkles */}
            <path d="M22 25L24 18L26 25L33 27L26 29L24 36L22 29L15 27L22 25Z" fill="currentColor" fillOpacity="0.25" stroke="none" />
            <path d="M78 20L79 15L80 20L85 21L80 22L79 27L78 22L73 21L78 20Z" fill="currentColor" fillOpacity="0.25" stroke="none" />
          </svg>

          {/* Left-Middle Tiny Hearts & Mini Floral Sprig */}
          <svg
            className="absolute -left-6 top-72 w-36 h-36 transition-opacity duration-700"
            style={{ opacity: doodleOpacity * 0.9, color: strokeColor }}
            viewBox="0 0 80 80"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            {/* Mini Heart */}
            <path d="M25 25 C25 20, 30 15, 36 18 C42 15, 47 20, 47 25 C47 34, 36 42, 36 42 C36 42, 25 34, 25 25 Z" fill="currentColor" fillOpacity="0.2" />
            {/* Tiny Sparkle */}
            <path d="M58 48L60 42L62 48L68 50L62 52L60 58L58 52L52 50L58 48Z" fill="currentColor" fillOpacity="0.3" stroke="none" />
            {/* Mini floral petal */}
            <circle cx="20" cy="60" r="2.5" />
            <circle cx="20" cy="54" r="2" fill="currentColor" fillOpacity="0.2" />
            <circle cx="20" cy="66" r="2" fill="currentColor" fillOpacity="0.2" />
            <circle cx="14" cy="60" r="2" fill="currentColor" fillOpacity="0.2" />
            <circle cx="26" cy="60" r="2" fill="currentColor" fillOpacity="0.2" />
          </svg>

          {/* Bottom-Right Soft Ribbon Tail & Heart */}
          <svg
            className="absolute right-4 bottom-28 w-40 h-40 transition-opacity duration-700"
            style={{ opacity: doodleOpacity * 0.85, color: strokeColor }}
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
          >
            <path d="M30 65C45 55 60 70 75 60C85 52 90 40 92 35" strokeDasharray="3 3" />
            <path d="M60 20 C60 16, 64 12, 69 15 C74 12, 78 16, 78 20 C78 27, 69 33, 69 33 C69 33, 60 27, 60 20 Z" fill="currentColor" fillOpacity="0.2" />
            <path d="M20 75L21.5 70L23 75L28 76.5L23 78L21.5 83L20 78L15 76.5L20 75Z" fill="currentColor" fillOpacity="0.3" stroke="none" />
          </svg>
        </>
      )}

      {/* Theme 2: Sage Garden Doodles (Botanical leaves, tiny flowers, branch outlines, organic curves) */}
      {motif === 'botanical' && (
        <>
          {/* Top-Right Graceful Botanical Stem */}
          <svg
            className="absolute -right-8 top-8 w-56 h-56 transition-opacity duration-700"
            style={{ opacity: doodleOpacity, color: strokeColor }}
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <path d="M90 90C70 70 50 40 45 10" />
            <path d="M60 55C50 45 52 35 62 30C72 35 70 45 60 55Z" fill="currentColor" fillOpacity="0.15" />
            <path d="M52 35C42 28 45 18 55 15C65 20 62 30 52 35Z" fill="currentColor" fillOpacity="0.15" />
            <path d="M72 75C62 65 65 55 75 50C85 55 82 65 72 75Z" fill="currentColor" fillOpacity="0.15" />
            {/* Tiny wildflowers */}
            <circle cx="25" cy="25" r="3" fill="currentColor" fillOpacity="0.2" />
            <circle cx="25" cy="18" r="1.5" />
            <circle cx="25" cy="32" r="1.5" />
            <circle cx="18" cy="25" r="1.5" />
            <circle cx="32" cy="25" r="1.5" />
          </svg>

          {/* Left-Middle Curving Branch & Leaves */}
          <svg
            className="absolute -left-6 top-80 w-44 h-44 transition-opacity duration-700"
            style={{ opacity: doodleOpacity * 0.9, color: strokeColor }}
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
          >
            <path d="M10 80C30 75 45 60 55 40C62 25 70 15 85 10" />
            <path d="M35 68C30 60 32 52 40 50C48 53 45 62 35 68Z" fill="currentColor" fillOpacity="0.2" />
            <path d="M50 48C45 40 48 32 56 30C64 33 60 42 50 48Z" fill="currentColor" fillOpacity="0.2" />
            <circle cx="75" cy="65" r="2" fill="currentColor" />
            <circle cx="82" cy="72" r="1.5" />
          </svg>

          {/* Bottom-Right Organic Wave Leaf */}
          <svg
            className="absolute right-6 bottom-24 w-36 h-36 transition-opacity duration-700"
            style={{ opacity: doodleOpacity * 0.85, color: strokeColor }}
            viewBox="0 0 80 80"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <path d="M15 70C30 55 50 45 70 30" />
            <path d="M35 55C30 45 34 38 42 40C48 45 42 52 35 55Z" fill="currentColor" fillOpacity="0.2" />
            <circle cx="65" cy="55" r="2.5" fill="currentColor" fillOpacity="0.3" />
          </svg>
        </>
      )}

      {/* Theme 3: Lavender Dream Doodles (Crescent moons, stars, clouds, tiny sparkles, dreamy abstract shapes) */}
      {motif === 'celestial' && (
        <>
          {/* Top-Right Crescent Moon & Stars */}
          <svg
            className="absolute -right-6 top-10 w-52 h-52 transition-opacity duration-700"
            style={{ opacity: doodleOpacity, color: strokeColor }}
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <path d="M60 20C45 22 35 36 35 52C35 68 48 80 65 80C72 80 78 78 82 74C65 72 52 58 55 40C57 30 62 24 60 20Z" fill="currentColor" fillOpacity="0.2" />
            <path d="M25 35L27 28L29 35L36 37L29 39L27 46L25 39L18 37L25 35Z" fill="currentColor" fillOpacity="0.4" stroke="none" />
            <path d="M40 78L41 74L42 78L46 79L42 80L41 84L40 80L36 79L40 78Z" fill="currentColor" fillOpacity="0.4" stroke="none" />
          </svg>

          {/* Left-Middle Dreamy Cloud & Star Doodles */}
          <svg
            className="absolute -left-6 top-72 w-48 h-48 transition-opacity duration-700"
            style={{ opacity: doodleOpacity * 0.9, color: strokeColor }}
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            {/* Dream Cloud Outline */}
            <path d="M20 55C15 55 10 50 10 44C10 38 15 34 20 34C22 26 30 20 40 20C50 20 58 26 60 34C66 34 70 38 70 44C70 50 66 55 60 55Z" fill="currentColor" fillOpacity="0.1" />
            {/* Floating Sparkles */}
            <circle cx="32" cy="72" r="1.5" fill="currentColor" />
            <circle cx="50" cy="65" r="2" fill="currentColor" />
            <path d="M68 68L70 63L72 68L77 70L72 72L70 77L68 72L63 70L68 68Z" fill="currentColor" fillOpacity="0.3" stroke="none" />
          </svg>

          {/* Bottom-Right Shooting Star & Orbit Spark */}
          <svg
            className="absolute right-6 bottom-24 w-40 h-40 transition-opacity duration-700"
            style={{ opacity: doodleOpacity * 0.85, color: strokeColor }}
            viewBox="0 0 80 80"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
          >
            <path d="M10 60C30 50 50 40 70 20" strokeDasharray="2 3" />
            <path d="M68 20L71 14L74 20L80 23L74 26L71 32L68 26L62 23L68 20Z" fill="currentColor" fillOpacity="0.4" stroke="none" />
            <circle cx="25" cy="55" r="1.5" fill="currentColor" />
          </svg>
        </>
      )}

      {/* Theme 4: Tiramisu Doodles (Coffee cup outlines, coffee beans, vintage cafe patterns, botanical lines) */}
      {motif === 'tiramisu' && (
        <>
          {/* Top-Right Coffee Cup Stamp & Warm Steam */}
          <svg
            className="absolute -right-6 top-10 w-52 h-52 transition-opacity duration-700"
            style={{ opacity: doodleOpacity, color: strokeColor }}
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <circle cx="50" cy="50" r="38" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="32" />
            <path d="M35 55C35 65 42 70 50 70C58 70 65 65 65 55H35Z" fill="currentColor" fillOpacity="0.15" />
            <path d="M65 58H71C74 58 76 60 76 63C76 66 74 68 71 68H65" />
            <path d="M44 45C44 40 47 38 47 34" />
            <path d="M50 45C50 39 53 37 53 32" />
            <path d="M56 45C56 40 59 38 59 34" />
          </svg>

          {/* Left-Middle Coffee Beans & Editorial Rules */}
          <svg
            className="absolute -left-6 top-72 w-40 h-40 transition-opacity duration-700"
            style={{ opacity: doodleOpacity * 0.9, color: strokeColor }}
            viewBox="0 0 80 80"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            {/* Coffee Bean 1 */}
            <ellipse cx="30" cy="30" rx="8" ry="12" transform="rotate(-30 30 30)" fill="currentColor" fillOpacity="0.15" />
            <path d="M26 22C28 26 32 34 34 38" />
            {/* Coffee Bean 2 */}
            <ellipse cx="52" cy="46" rx="6" ry="9" transform="rotate(25 52 46)" fill="currentColor" fillOpacity="0.15" />
            <path d="M49 40C52 44 52 48 55 52" />
            {/* Minimal paper dash */}
            <path d="M15 65H65" strokeDasharray="2 3" />
          </svg>

          {/* Bottom-Right Vintage Seal Detail */}
          <svg
            className="absolute right-6 bottom-24 w-36 h-36 transition-opacity duration-700"
            style={{ opacity: doodleOpacity * 0.85, color: strokeColor }}
            viewBox="0 0 80 80"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
          >
            <circle cx="40" cy="40" r="28" strokeDasharray="4 2" />
            <path d="M30 40H50" />
            <circle cx="40" cy="40" r="3" fill="currentColor" fillOpacity="0.3" />
          </svg>
        </>
      )}

      {/* Theme 5: Midnight Luxe Doodles (Celestial lines, tiny stars, gold decorative outlines, geometric luxury) */}
      {motif === 'luxe' && (
        <>
          {/* Top-Right Luxury Gold Filigree & Diamond Starburst */}
          <svg
            className="absolute -right-6 top-10 w-56 h-56 transition-opacity duration-700"
            style={{ opacity: doodleOpacity, color: strokeColor }}
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <circle cx="50" cy="50" r="38" strokeDasharray="4 4" />
            <path d="M50 15L53 45L80 50L53 55L50 85L47 55L20 50L47 45L50 15Z" fill="currentColor" fillOpacity="0.18" />
            <circle cx="50" cy="50" r="4" fill="currentColor" fillOpacity="0.5" />
            <circle cx="28" cy="28" r="1.5" fill="currentColor" />
            <circle cx="72" cy="72" r="1.5" fill="currentColor" />
            <circle cx="75" cy="25" r="1.5" fill="currentColor" />
          </svg>

          {/* Left-Middle Geometric Hexagram & Luxury Orbit */}
          <svg
            className="absolute -left-6 top-72 w-44 h-44 transition-opacity duration-700"
            style={{ opacity: doodleOpacity * 0.9, color: strokeColor }}
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
          >
            <polygon points="50,15 80,32 80,68 50,85 20,68 20,32" strokeDasharray="2 3" />
            <path d="M50 25L52 48L72 50L52 52L50 75L48 52L28 50L48 48L50 25Z" fill="currentColor" fillOpacity="0.25" stroke="none" />
            <circle cx="85" cy="50" r="2" fill="currentColor" />
            <circle cx="15" cy="50" r="2" fill="currentColor" />
          </svg>

          {/* Bottom-Right Fine Astrological Star & Lines */}
          <svg
            className="absolute right-6 bottom-24 w-38 h-38 transition-opacity duration-700"
            style={{ opacity: doodleOpacity * 0.85, color: strokeColor }}
            viewBox="0 0 80 80"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.1"
          >
            <path d="M40 10L42 38L70 40L42 42L40 70L38 42L10 40L38 38L40 10Z" fill="currentColor" fillOpacity="0.2" />
            <circle cx="40" cy="40" r="2" fill="currentColor" />
          </svg>
        </>
      )}

      {/* Theme 6: Ocean Breeze Doodles (Wave outlines, shells, tiny bubbles, seashell line art, minimal coastal) */}
      {motif === 'ocean' && (
        <>
          {/* Top-Right Rolling Waves & Rising Bubbles */}
          <svg
            className="absolute -right-8 top-10 w-60 h-60 transition-opacity duration-700"
            style={{ opacity: doodleOpacity, color: strokeColor }}
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <path d="M10 60C25 50 40 70 55 60C70 50 85 70 100 60" />
            <path d="M10 75C25 65 40 85 55 75C70 65 85 85 100 75" />
            <circle cx="45" cy="35" r="7" fill="currentColor" fillOpacity="0.15" />
            <circle cx="68" cy="25" r="4" fill="currentColor" fillOpacity="0.2" />
            <circle cx="30" cy="48" r="3" fill="currentColor" fillOpacity="0.2" />
            <circle cx="78" cy="40" r="2" fill="currentColor" fillOpacity="0.25" />
          </svg>

          {/* Left-Middle Seashell Spiral Line Art & Foam */}
          <svg
            className="absolute -left-6 top-72 w-44 h-44 transition-opacity duration-700"
            style={{ opacity: doodleOpacity * 0.9, color: strokeColor }}
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            {/* Delicate Nautilus Shell Spiral */}
            <path d="M50 20C68 20 82 34 82 52C82 70 68 84 50 84C32 84 18 70 18 52C18 38 28 27 42 27C54 27 64 36 64 48C64 58 56 66 46 66C38 66 32 60 32 52C32 46 36 42 42 42" />
            <circle cx="85" cy="35" r="3" fill="currentColor" fillOpacity="0.2" />
            <circle cx="20" cy="25" r="2" fill="currentColor" fillOpacity="0.25" />
          </svg>

          {/* Bottom-Right Gentle Tide Crest */}
          <svg
            className="absolute right-6 bottom-24 w-40 h-40 transition-opacity duration-700"
            style={{ opacity: doodleOpacity * 0.85, color: strokeColor }}
            viewBox="0 0 80 80"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <path d="M5 45C20 38 35 52 50 45C65 38 75 48 80 45" />
            <circle cx="35" cy="25" r="4" fill="currentColor" fillOpacity="0.15" />
            <circle cx="55" cy="20" r="2.5" fill="currentColor" fillOpacity="0.2" />
          </svg>
        </>
      )}
    </div>
  );
};

/**
 * Empty state doodle tailored to the active theme motif
 */
export const EmptyStateThemeDoodle: React.FC<{ className?: string }> = ({ className = 'w-16 h-16' }) => {
  const { currentTheme, state } = useBloom();
  const motif = currentTheme.motif;
  const isDark = state.darkMode;
  const color = isDark ? currentTheme.dark.primary : currentTheme.light.primary;

  if (motif === 'bow') {
    return (
      <svg viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.5" className={`${className} mx-auto`} style={{ opacity: 0.85 }}>
        <circle cx="32" cy="30" r="4" fill={color} fillOpacity={0.3} />
        <path d="M28 30C22 20 8 20 6 30C4 40 22 36 28 30Z" fill={color} fillOpacity={0.15} />
        <path d="M36 30C42 20 56 20 58 30C60 40 42 36 36 30Z" fill={color} fillOpacity={0.15} />
        <path d="M30 34C26 44 20 54 14 58" />
        <path d="M34 34C38 44 44 54 50 58" />
        <path d="M16 14L17.5 9L19 14L24 15.5L19 17L17.5 22L16 17L11 15.5L16 14Z" fill={color} fillOpacity={0.4} stroke="none" />
      </svg>
    );
  }

  if (motif === 'botanical') {
    return (
      <svg viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.5" className={`${className} mx-auto`} style={{ opacity: 0.85 }}>
        <path d="M12 56C24 48 38 32 48 10" />
        <path d="M30 38C24 30 24 22 32 18C40 22 38 30 30 38Z" fill={color} fillOpacity={0.2} />
        <path d="M40 26C34 18 36 12 44 10C52 14 48 22 40 26Z" fill={color} fillOpacity={0.2} />
        <circle cx="20" cy="50" r="2.5" fill={color} />
      </svg>
    );
  }

  if (motif === 'celestial') {
    return (
      <svg viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.5" className={`${className} mx-auto`} style={{ opacity: 0.85 }}>
        <path d="M38 12C28 14 22 24 22 34C22 44 30 52 40 52C45 52 49 50 52 48C40 46 32 38 34 26C35 19 39 15 38 12Z" fill={color} fillOpacity={0.2} />
        <path d="M16 22L17.5 17L19 22L24 23.5L19 25L17.5 30L16 25L11 23.5L16 22Z" fill={color} fillOpacity={0.4} stroke="none" />
        <circle cx="48" cy="22" r="1.5" fill={color} />
      </svg>
    );
  }

  if (motif === 'tiramisu') {
    return (
      <svg viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.5" className={`${className} mx-auto`} style={{ opacity: 0.85 }}>
        <ellipse cx="32" cy="34" rx="14" ry="20" transform="rotate(-20 32 34)" fill={color} fillOpacity={0.2} />
        <path d="M26 22C30 28 34 38 38 46" strokeWidth="1.8" />
        <path d="M18 56H46" strokeDasharray="3 3" />
      </svg>
    );
  }

  if (motif === 'luxe') {
    return (
      <svg viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.5" className={`${className} mx-auto`} style={{ opacity: 0.85 }}>
        <path d="M32 6L35 28L57 32L35 36L32 58L29 36L7 32L29 28L32 6Z" fill={color} fillOpacity={0.25} />
        <circle cx="32" cy="32" r="3" fill={color} />
        <circle cx="50" cy="14" r="1.5" fill={color} />
        <circle cx="14" cy="50" r="1.5" fill={color} />
      </svg>
    );
  }

    // Ocean
    return (
      <svg viewBox="0 0 64 64" fill="none" stroke={color} strokeWidth="1.5" className={`${className} mx-auto`} style={{ opacity: 0.85 }}>
        <path d="M10 42C20 36 30 48 40 42C50 36 60 46 64 42" />
        <path d="M32 12C40 12 46 18 46 25C46 32 40 35 32 35C24 35 18 32 18 25C18 18 24 12 32 12Z" fill={color} fillOpacity={0.15} />
        <circle cx="48" cy="18" r="2" fill={color} fillOpacity={0.4} />
        <circle cx="52" cy="26" r="1.5" fill={color} fillOpacity="0.3" />
      </svg>
    );
  };

/**
 * Clean doodle vignette thumbnail used inside theme gallery cards and previews
 */
export const ThemeDoodleVignette: React.FC<{
  themeId: ThemeId;
  className?: string;
  color?: string;
}> = ({ themeId, className = 'w-full h-8', color }) => {
  const motif = getMotifByTheme(themeId);
  const strokeColor = color || '#E11D48';

  if (motif === 'bow') {
    return (
      <svg viewBox="0 0 160 32" fill="none" stroke={strokeColor} strokeWidth="1.2" className={className} aria-hidden="true">
        {/* Bow */}
        <circle cx="80" cy="16" r="2" fill={strokeColor} fillOpacity={0.4} />
        <path d="M78 16C72 10 62 10 60 16C58 22 72 20 78 16Z" fill={strokeColor} fillOpacity={0.15} />
        <path d="M82 16C88 10 98 10 100 16C102 22 88 20 82 16Z" fill={strokeColor} fillOpacity={0.15} />
        <path d="M79 18C76 24 72 28 68 30" />
        <path d="M81 18C84 24 88 28 92 30" />
        {/* Sparkles & Hearts */}
        <path d="M40 12L41 8L42 12L46 13L42 14L41 18L40 14L36 13L40 12Z" fill={strokeColor} fillOpacity={0.5} stroke="none" />
        <path d="M120 12C118 10 115 10 114 12C113 14 116 17 118 19C120 17 123 14 122 12C121 10 118 10 116 12" fill={strokeColor} fillOpacity={0.3} strokeWidth="0.8" />
        <circle cx="25" cy="18" r="1.2" fill={strokeColor} fillOpacity={0.4} />
        <circle cx="138" cy="16" r="1.2" fill={strokeColor} fillOpacity={0.4} />
      </svg>
    );
  }

  if (motif === 'botanical') {
    return (
      <svg viewBox="0 0 160 32" fill="none" stroke={strokeColor} strokeWidth="1.2" className={className} aria-hidden="true">
        {/* Organic Stem */}
        <path d="M30 24C60 20 100 12 130 14" strokeLinecap="round" />
        {/* Leaf pairs */}
        <path d="M60 21C58 16 62 12 68 14C72 18 68 22 60 21Z" fill={strokeColor} fillOpacity={0.2} />
        <path d="M90 17C88 12 92 8 98 10C102 14 98 18 90 17Z" fill={strokeColor} fillOpacity={0.2} />
        <path d="M75 19C77 24 82 26 86 24C88 20 83 18 75 19Z" fill={strokeColor} fillOpacity={0.2} />
        <path d="M105 15C107 20 112 22 116 20C118 16 113 14 105 15Z" fill={strokeColor} fillOpacity={0.2} />
        {/* Little wildflowers */}
        <circle cx="45" cy="15" r="1.8" fill={strokeColor} fillOpacity={0.3} />
        <circle cx="140" cy="18" r="1.5" fill={strokeColor} fillOpacity={0.3} />
      </svg>
    );
  }

  if (motif === 'celestial') {
    return (
      <svg viewBox="0 0 160 32" fill="none" stroke={strokeColor} strokeWidth="1.2" className={className} aria-hidden="true">
        {/* Moon */}
        <path d="M82 6C76 7 72 12 72 18C72 24 76 28 82 28C84 28 86 27 88 26C81 25 77 20 78 14C79 10 82 8 82 6Z" fill={strokeColor} fillOpacity={0.25} />
        {/* Stars */}
        <path d="M50 14L51.5 10L53 14L57 15.5L53 17L51.5 21L50 17L46 15.5L50 14Z" fill={strokeColor} fillOpacity={0.5} stroke="none" />
        <path d="M110 12L111 8L112 12L116 13L112 14L111 18L110 14L106 13L110 12Z" fill={strokeColor} fillOpacity={0.5} stroke="none" />
        <circle cx="32" cy="18" r="1.2" fill={strokeColor} fillOpacity={0.4} />
        <circle cx="132" cy="14" r="1.2" fill={strokeColor} fillOpacity={0.4} />
      </svg>
    );
  }

  if (motif === 'tiramisu') {
    return (
      <svg viewBox="0 0 160 32" fill="none" stroke={strokeColor} strokeWidth="1.2" className={className} aria-hidden="true">
        {/* Coffee cup */}
        <path d="M72 13H86V19C86 22 83 25 79 25H79C75 25 72 22 72 19V13Z" />
        <path d="M86 15H89C90.5 15 91 16 91 17.5C91 19 90.5 20 89 20H86" />
        <path d="M75 8C76 10 75 11 76 12" strokeDasharray="1 1.5" />
        <path d="M81 7C82 9 81 10 82 12" strokeDasharray="1 1.5" />
        <path d="M68 27H90" strokeLinecap="round" />
        {/* Coffee beans */}
        <ellipse cx="45" cy="18" rx="4" ry="6" transform="rotate(-25 45 18)" fill={strokeColor} fillOpacity={0.2} />
        <path d="M43 14C45 17 46 20 47 22" strokeWidth="1" />
        <ellipse cx="118" cy="17" rx="4" ry="6" transform="rotate(30 118 17)" fill={strokeColor} fillOpacity={0.2} />
        <path d="M117 13C118 16 119 19 119 21" strokeWidth="1" />
      </svg>
    );
  }

  if (motif === 'luxe') {
    return (
      <svg viewBox="0 0 160 32" fill="none" stroke={strokeColor} strokeWidth="1.2" className={className} aria-hidden="true">
        {/* Fine gold starlight */}
        <path d="M80 4L82 13L91 16L82 19L80 28L78 19L69 16L78 13L80 4Z" fill={strokeColor} fillOpacity={0.3} />
        <line x1="30" y1="16" x2="60" y2="16" strokeDasharray="2 3" strokeOpacity={0.5} />
        <line x1="100" y1="16" x2="130" y2="16" strokeDasharray="2 3" strokeOpacity={0.5} />
        <circle cx="80" cy="16" r="1.5" fill={strokeColor} />
        <circle cx="45" cy="16" r="1.5" fill={strokeColor} />
        <circle cx="115" cy="16" r="1.5" fill={strokeColor} />
      </svg>
    );
  }

  // Ocean
  return (
    <svg viewBox="0 0 160 32" fill="none" stroke={strokeColor} strokeWidth="1.2" className={className} aria-hidden="true">
      {/* Wave curls */}
      <path d="M25 20C40 14 55 24 70 18C85 12 100 22 115 16C130 10 140 18 145 15" strokeLinecap="round" />
      {/* Shell */}
      <path d="M80 8C84 8 87 11 87 14C87 18 84 20 80 20C76 20 73 18 73 14C73 11 76 8 80 8Z" fill={strokeColor} fillOpacity={0.2} />
      <path d="M80 8V20" strokeDasharray="1 1.5" />
      {/* Bubbles */}
      <circle cx="95" cy="10" r="1.8" fill={strokeColor} fillOpacity={0.35} />
      <circle cx="102" cy="14" r="1.2" fill={strokeColor} fillOpacity={0.35} />
      <circle cx="60" cy="12" r="1.5" fill={strokeColor} fillOpacity={0.35} />
    </svg>
  );
};
