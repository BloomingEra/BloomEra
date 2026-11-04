import { ThemeId } from '../types/bloom';

export type ThemeMotif = 'bow' | 'botanical' | 'celestial' | 'tiramisu' | 'luxe' | 'ocean' | 'starlight' | 'terracotta';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  subtitle: string;
  tagline: string;
  previewColor: string;
  accentColor: string;
  isPremium: boolean;
  motif: ThemeMotif;
  fontFamily: {
    display: string;
    body: string;
    fontClass: string;
  };
  cardStyle: {
    radius: string;
    border: string;
    shadow: string;
    badgeRadius: string;
    dividerStyle: 'ribbon-stitch' | 'botanical-vine' | 'starlight-dash' | 'editorial-double' | 'luxury-gold' | 'ocean-wave';
  };
  buttonStyle: {
    radius: string;
  };
  decorations: {
    cornerMotif: 'bow' | 'leaf' | 'star' | 'coffee' | 'sparkle' | 'seashell' | 'gold-star';
    iconStyle: string;
    quoteSymbol: string;
  };
  soundProfile: {
    tapFreq: number;
    bloomNotes: number[];
  };
  light: {
    bg: string;
    surface: string;
    surfaceElevated: string;
    primary: string;
    primaryContainer: string;
    onPrimary: string;
    onPrimaryContainer: string;
    secondary: string;
    outline: string;
    text: string;
    textMuted: string;
    cardBorder: string;
    gradientHeader: string;
    accentGlow: string;
  };
  dark: {
    bg: string;
    surface: string;
    surfaceElevated: string;
    primary: string;
    primaryContainer: string;
    onPrimary: string;
    onPrimaryContainer: string;
    secondary: string;
    outline: string;
    text: string;
    textMuted: string;
    cardBorder: string;
    gradientHeader: string;
    accentGlow: string;
  };
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  'blush-bow': {
    id: 'blush-bow',
    name: 'Blush Bow',
    subtitle: 'Cute, feminine & elegant luxury journal',
    tagline: 'Soft pink gradients, silk ribbons, delicate bows & sparkles',
    previewColor: '#F48BA5',
    accentColor: '#C84C6D',
    isPremium: false,
    motif: 'bow',
    fontFamily: {
      display: "'Cormorant Garamond', Georgia, serif",
      body: "'Plus Jakarta Sans', system-ui, sans-serif",
      fontClass: 'font-serif-cormorant',
    },
    cardStyle: {
      radius: 'rounded-[28px]',
      border: 'border border-pink-200/60 dark:border-pink-900/40',
      shadow: 'shadow-[0_4px_24px_-6px_rgba(244,139,165,0.18)]',
      badgeRadius: 'rounded-full',
      dividerStyle: 'ribbon-stitch',
    },
    buttonStyle: {
      radius: 'rounded-full',
    },
    decorations: {
      cornerMotif: 'bow',
      iconStyle: 'stroke-[1.6]',
      quoteSymbol: '🎀',
    },
    soundProfile: {
      tapFreq: 440,
      bloomNotes: [698.46, 880.0, 1046.5], // F5, A5, C6 (graceful, melodic)
    },
    light: {
      bg: '#FFF7F9',
      surface: '#FFFFFF',
      surfaceElevated: '#FFF0F4',
      primary: '#C84C6D',
      primaryContainer: '#FCE4EC',
      onPrimary: '#FFFFFF',
      onPrimaryContainer: '#4C1021',
      secondary: '#E27396',
      outline: '#F3D2DC',
      text: '#2D1B22',
      textMuted: '#7D6169',
      cardBorder: '#F5E1E6',
      gradientHeader: 'from-pink-100/90 via-rose-50/70 to-pink-50/40',
      accentGlow: 'rgba(244, 139, 165, 0.25)',
    },
    dark: {
      bg: '#180E13',
      surface: '#24151D',
      surfaceElevated: '#311C27',
      primary: '#F48BA5',
      primaryContainer: '#511929',
      onPrimary: '#3A0917',
      onPrimaryContainer: '#FFD9E2',
      secondary: '#D35D7A',
      outline: '#4A2A38',
      text: '#FDF0F3',
      textMuted: '#B998A2',
      cardBorder: '#3A222E',
      gradientHeader: 'from-pink-950/60 via-rose-950/40 to-neutral-900/30',
      accentGlow: 'rgba(244, 139, 165, 0.2)',
    },
  },

  'sage-garden': {
    id: 'sage-garden',
    name: 'Sage Garden',
    subtitle: 'Calming botanical & natural paper',
    tagline: 'Tiny leaves, botanical line art, organic shapes & matcha mist',
    previewColor: '#7A9A8B',
    accentColor: '#3F6E58',
    isPremium: false,
    motif: 'botanical',
    fontFamily: {
      display: "'Fraunces', Georgia, serif",
      body: "'Plus Jakarta Sans', system-ui, sans-serif",
      fontClass: 'font-serif-fraunces',
    },
    cardStyle: {
      radius: 'rounded-2xl',
      border: 'border border-emerald-200/60 dark:border-emerald-900/40',
      shadow: 'shadow-[0_4px_20px_-6px_rgba(122,154,139,0.18)]',
      badgeRadius: 'rounded-xl',
      dividerStyle: 'botanical-vine',
    },
    buttonStyle: {
      radius: 'rounded-xl',
    },
    decorations: {
      cornerMotif: 'leaf',
      iconStyle: 'stroke-[1.5]',
      quoteSymbol: '🌿',
    },
    soundProfile: {
      tapFreq: 330,
      bloomNotes: [523.25, 659.25, 783.99], // C5, E5, G5 (earthy peaceful chord)
    },
    light: {
      bg: '#F6F9F7',
      surface: '#FFFFFF',
      surfaceElevated: '#EEF5F1',
      primary: '#3F6E58',
      primaryContainer: '#DFEEE5',
      onPrimary: '#FFFFFF',
      onPrimaryContainer: '#0C2D1F',
      secondary: '#6E9884',
      outline: '#CFE0D7',
      text: '#1C2921',
      textMuted: '#586E63',
      cardBorder: '#DCE7E1',
      gradientHeader: 'from-emerald-100/80 via-teal-50/60 to-emerald-50/30',
      accentGlow: 'rgba(122, 154, 139, 0.25)',
    },
    dark: {
      bg: '#0F1612',
      surface: '#17221C',
      surfaceElevated: '#203028',
      primary: '#85BBA2',
      primaryContainer: '#1F3C2E',
      onPrimary: '#0C271C',
      onPrimaryContainer: '#D5F0E3',
      secondary: '#5E8B75',
      outline: '#2F463B',
      text: '#EAF4EF',
      textMuted: '#95ADA1',
      cardBorder: '#283930',
      gradientHeader: 'from-emerald-950/60 via-teal-950/40 to-neutral-900/30',
      accentGlow: 'rgba(133, 187, 162, 0.2)',
    },
  },

  'lavender-dream': {
    id: 'lavender-dream',
    name: 'Lavender Dream',
    subtitle: 'Dreamy celestial & magical starlight',
    tagline: 'Stars, crescent moons, soft clouds, sparkles & violet gradients',
    previewColor: '#B084A8',
    accentColor: '#7E4C76',
    isPremium: true,
    motif: 'celestial',
    fontFamily: {
      display: "'Outfit', system-ui, sans-serif",
      body: "'Plus Jakarta Sans', system-ui, sans-serif",
      fontClass: 'font-sans-outfit',
    },
    cardStyle: {
      radius: 'rounded-[24px]',
      border: 'border border-purple-200/60 dark:border-purple-900/40',
      shadow: 'shadow-[0_4px_24px_-6px_rgba(176,132,168,0.22)]',
      badgeRadius: 'rounded-2xl',
      dividerStyle: 'starlight-dash',
    },
    buttonStyle: {
      radius: 'rounded-2xl',
    },
    decorations: {
      cornerMotif: 'star',
      iconStyle: 'stroke-[1.6]',
      quoteSymbol: '✨',
    },
    soundProfile: {
      tapFreq: 520,
      bloomNotes: [659.25, 830.61, 987.77, 1318.51], // E5, G#5, B5, E6 (celestial dream chime)
    },
    light: {
      bg: '#FAF7FB',
      surface: '#FFFFFF',
      surfaceElevated: '#F5ECF6',
      primary: '#7E4C76',
      primaryContainer: '#F3E2F2',
      onPrimary: '#FFFFFF',
      onPrimaryContainer: '#351130',
      secondary: '#A56C9C',
      outline: '#E5D0E3',
      text: '#2A1C28',
      textMuted: '#745B71',
      cardBorder: '#ECDCF0',
      gradientHeader: 'from-purple-100/85 via-fuchsia-50/60 to-indigo-50/40',
      accentGlow: 'rgba(176, 132, 168, 0.28)',
    },
    dark: {
      bg: '#150E14',
      surface: '#21151F',
      surfaceElevated: '#2F1F2D',
      primary: '#CF99C6',
      primaryContainer: '#4C2445',
      onPrimary: '#340F2E',
      onPrimaryContainer: '#F9DDF6',
      secondary: '#A3689A',
      outline: '#412B3E',
      text: '#F5ECF3',
      textMuted: '#B39AB0',
      cardBorder: '#372335',
      gradientHeader: 'from-purple-950/60 via-fuchsia-950/40 to-neutral-900/30',
      accentGlow: 'rgba(207, 153, 198, 0.22)',
    },
  },

  tiramisu: {
    id: 'tiramisu',
    name: 'Tiramisu',
    subtitle: 'Warm espresso, editorial & cafe paper',
    tagline: 'Warm beige surfaces, coffee line art, rich crema & crisp borders',
    previewColor: '#C88A58',
    accentColor: '#8C4D20',
    isPremium: true,
    motif: 'tiramisu',
    fontFamily: {
      display: "'Playfair Display', Georgia, serif",
      body: "'Plus Jakarta Sans', system-ui, sans-serif",
      fontClass: 'font-serif-playfair',
    },
    cardStyle: {
      radius: 'rounded-xl',
      border: 'border border-amber-900/15 dark:border-amber-700/25',
      shadow: 'shadow-[0_3px_16px_-4px_rgba(140,77,32,0.12)]',
      badgeRadius: 'rounded-md',
      dividerStyle: 'editorial-double',
    },
    buttonStyle: {
      radius: 'rounded-lg',
    },
    decorations: {
      cornerMotif: 'coffee',
      iconStyle: 'stroke-[1.65]',
      quoteSymbol: '☕',
    },
    soundProfile: {
      tapFreq: 290,
      bloomNotes: [440.0, 554.37, 659.25], // A4, C#5, E5 (warm acoustic jazz chord)
    },
    light: {
      bg: '#FAF6F0',
      surface: '#FFFFFF',
      surfaceElevated: '#F5ECE1',
      primary: '#8C4D20',
      primaryContainer: '#F8E9DA',
      onPrimary: '#FFFFFF',
      onPrimaryContainer: '#3B1A05',
      secondary: '#B57038',
      outline: '#EAD7C4',
      text: '#2C1E14',
      textMuted: '#735845',
      cardBorder: '#EDE0D2',
      gradientHeader: 'from-amber-100/80 via-orange-50/50 to-stone-50/40',
      accentGlow: 'rgba(140, 77, 32, 0.22)',
    },
    dark: {
      bg: '#14100D',
      surface: '#1F1914',
      surfaceElevated: '#2A221C',
      primary: '#E5A574',
      primaryContainer: '#4A2A14',
      onPrimary: '#301605',
      onPrimaryContainer: '#FFDDC4',
      secondary: '#BE7D47',
      outline: '#3E3127',
      text: '#F7EFE8',
      textMuted: '#B29D8F',
      cardBorder: '#352920',
      gradientHeader: 'from-amber-950/60 via-stone-900/40 to-neutral-900/30',
      accentGlow: 'rgba(229, 165, 116, 0.2)',
    },
  },

  'midnight-luxe': {
    id: 'midnight-luxe',
    name: 'Midnight Luxe',
    subtitle: 'A premium dark luxury theme',
    tagline: 'Deep dark surfaces, gold & silver accents, subtle stars & elegant luxury lines',
    previewColor: '#D4AF37',
    accentColor: '#C5A059',
    isPremium: true,
    motif: 'luxe',
    fontFamily: {
      display: "'Playfair Display', Georgia, serif",
      body: "'Plus Jakarta Sans', system-ui, sans-serif",
      fontClass: 'font-serif-playfair',
    },
    cardStyle: {
      radius: 'rounded-2xl',
      border: 'border border-amber-500/25 dark:border-amber-400/20',
      shadow: 'shadow-[0_4px_24px_-4px_rgba(212,175,55,0.18)]',
      badgeRadius: 'rounded-full',
      dividerStyle: 'luxury-gold',
    },
    buttonStyle: {
      radius: 'rounded-xl',
    },
    decorations: {
      cornerMotif: 'gold-star',
      iconStyle: 'stroke-[1.6]',
      quoteSymbol: '✦',
    },
    soundProfile: {
      tapFreq: 490,
      bloomNotes: [659.25, 830.61, 987.77, 1318.51], // Luxe crystal chime
    },
    light: {
      bg: '#F9F8F6',
      surface: '#FFFFFF',
      surfaceElevated: '#F5F1E8',
      primary: '#997328',
      primaryContainer: '#FDF6E2',
      onPrimary: '#FFFFFF',
      onPrimaryContainer: '#3B2A06',
      secondary: '#C5A059',
      outline: '#E6DCC4',
      text: '#1C1917',
      textMuted: '#78716C',
      cardBorder: '#EDE4CE',
      gradientHeader: 'from-amber-100/80 via-stone-100/60 to-yellow-50/40',
      accentGlow: 'rgba(212, 175, 55, 0.22)',
    },
    dark: {
      bg: '#0A0B0E',
      surface: '#12141C',
      surfaceElevated: '#1A1D27',
      primary: '#D4AF37',
      primaryContainer: '#332811',
      onPrimary: '#0A0B0E',
      onPrimaryContainer: '#FFF0BD',
      secondary: '#E5E7EB',
      outline: '#38352A',
      text: '#F9FAFB',
      textMuted: '#9CA3AF',
      cardBorder: '#2B281F',
      gradientHeader: 'from-neutral-950 via-stone-900 to-black',
      accentGlow: 'rgba(212, 175, 55, 0.28)',
    },
  },

  'ocean-breeze': {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    subtitle: 'A refreshing coastal aesthetic',
    tagline: 'Waves, seashell line art, bubbles, soft clouds & calm aqua surfaces',
    previewColor: '#0EA5E9',
    accentColor: '#0284C7',
    isPremium: true,
    motif: 'ocean',
    fontFamily: {
      display: "'Outfit', system-ui, sans-serif",
      body: "'Plus Jakarta Sans', system-ui, sans-serif",
      fontClass: 'font-sans-outfit',
    },
    cardStyle: {
      radius: 'rounded-[24px]',
      border: 'border border-sky-200/60 dark:border-sky-900/40',
      shadow: 'shadow-[0_4px_22px_-6px_rgba(14,165,233,0.18)]',
      badgeRadius: 'rounded-xl',
      dividerStyle: 'ocean-wave',
    },
    buttonStyle: {
      radius: 'rounded-xl',
    },
    decorations: {
      cornerMotif: 'seashell',
      iconStyle: 'stroke-[1.6]',
      quoteSymbol: '🌊',
    },
    soundProfile: {
      tapFreq: 380,
      bloomNotes: [523.25, 659.25, 783.99, 1046.5], // Ocean chime
    },
    light: {
      bg: '#F0F8FA',
      surface: '#FFFFFF',
      surfaceElevated: '#E6F3F7',
      primary: '#0284C7',
      primaryContainer: '#DEF1F7',
      onPrimary: '#FFFFFF',
      onPrimaryContainer: '#033B54',
      secondary: '#0D9488',
      outline: '#BAE3EF',
      text: '#0F242C',
      textMuted: '#4F6B76',
      cardBorder: '#D3EAF1',
      gradientHeader: 'from-sky-100/90 via-cyan-50/60 to-blue-50/40',
      accentGlow: 'rgba(14, 165, 233, 0.22)',
    },
    dark: {
      bg: '#091318',
      surface: '#0F1D24',
      surfaceElevated: '#152731',
      primary: '#38BDF8',
      primaryContainer: '#103B4C',
      onPrimary: '#08212C',
      onPrimaryContainer: '#CEF1FF',
      secondary: '#2DD4BF',
      outline: '#1C4152',
      text: '#F0F9FF',
      textMuted: '#8BA3AE',
      cardBorder: '#173442',
      gradientHeader: 'from-sky-950/70 via-cyan-950/50 to-neutral-900/40',
      accentGlow: 'rgba(56, 189, 248, 0.22)',
    },
  },

  // Aliases for backward compatibility with existing saved states
  get sakura() {
    return this['blush-bow'];
  },
  get sage() {
    return this['sage-garden'];
  },
  get mauve() {
    return this['lavender-dream'];
  },
  get buttercream() {
    return this.tiramisu;
  },
  get obsidian() {
    return this['midnight-luxe'];
  },
  get 'midnight-starlight'() {
    return this['midnight-luxe'];
  },
  get terracotta() {
    return this['ocean-breeze'];
  },
  get 'terracotta-sol'() {
    return this['ocean-breeze'];
  },
};

export const THEME_LIST: ThemeConfig[] = [
  THEMES['blush-bow'],
  THEMES['sage-garden'],
  THEMES['lavender-dream'],
  THEMES['tiramisu'],
  THEMES['midnight-luxe'],
  THEMES['ocean-breeze'],
];
