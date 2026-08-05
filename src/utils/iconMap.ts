import {
  restaurant,
  bus,
  bag,
  cash,
  medkit,
  gameController,
  flash,
  gift,
  ellipsisHorizontal,
  filterOutline,
  searchOutline,
  createOutline,
  trashOutline,
  downloadOutline,
} from 'ionicons/icons';

export const iconMap: Record<string, string> = {
  restaurant,
  bus,
  bag,
  cash,
  medkit,
  gameController,
  flash,
  gift,
  ellipsisHorizontal,
  filterOutline,
  searchOutline,
  createOutline,
  trashOutline,
  downloadOutline,
};

export const getIcon = (nombre: string): string => {
  return iconMap[nombre] || ellipsisHorizontal;
};