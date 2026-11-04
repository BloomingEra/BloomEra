import React from 'react';
import {
  Sprout,
  Coins,
  Heart,
  Target,
  BookOpen,
  StickyNote,
  Package,
  Film,
  Tv,
  Sparkles,
  Calendar,
  Layers,
  Bookmark,
  Star,
  Clapperboard,
  Video,
  LucideProps,
} from 'lucide-react';

interface ModuleIconProps extends LucideProps {
  name: string;
}

export const ModuleIcon: React.FC<ModuleIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'Sprout':
      return <Sprout {...props} />;
    case 'Coins':
      return <Coins {...props} />;
    case 'Heart':
      return <Heart {...props} />;
    case 'Target':
      return <Target {...props} />;
    case 'BookOpen':
      return <BookOpen {...props} />;
    case 'StickyNote':
      return <StickyNote {...props} />;
    case 'Package':
      return <Package {...props} />;
    case 'Film':
      return <Film {...props} />;
    case 'Tv':
      return <Tv {...props} />;
    case 'Bookmark':
      return <Bookmark {...props} />;
    case 'Star':
      return <Star {...props} />;
    case 'Clapperboard':
      return <Clapperboard {...props} />;
    case 'Video':
      return <Video {...props} />;
    case 'Calendar':
      return <Calendar {...props} />;
    case 'Layers':
      return <Layers {...props} />;
    default:
      return <Sparkles {...props} />;
  }
};
