import React from 'react';
import {
  Droplets,
  Accessibility,
  Trash2,
  Zap,
  Armchair,
  DoorClosed,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';
import type { IssueCategory } from '../types/issue';

interface CategoryIconProps {
  category: IssueCategory;
  className?: string;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  category,
  className = 'w-4 h-4',
  size = 16,
}) => {
  switch (category) {
    case 'water_plumbing':
      return <Droplets className={className} size={size} />;
    case 'accessibility':
      return <Accessibility className={className} size={size} />;
    case 'waste_sanitation':
      return <Trash2 className={className} size={size} />;
    case 'electrical_lighting':
      return <Zap className={className} size={size} />;
    case 'furniture_fixtures':
      return <Armchair className={className} size={size} />;
    case 'doors_hardware':
      return <DoorClosed className={className} size={size} />;
    case 'structural_safety':
      return <AlertTriangle className={className} size={size} />;
    default:
      return <HelpCircle className={className} size={size} />;
  }
};
