export interface Categoria {
  nombre: string;
  icono: string; // debe existir en iconMap.ts
  color: string; // variable CSS de Ionic
}

export const CATEGORIAS: Categoria[] = [
  { nombre: 'Comida', icono: 'restaurant', color: '#FF6B6B' },
  { nombre: 'Transporte', icono: 'bus', color: '#4ECDC4' },
  { nombre: 'Compras', icono: 'bag', color: '#FFD93D' },
  { nombre: 'Salario', icono: 'cash', color: '#6BCB77' },
  { nombre: 'Salud', icono: 'medkit', color: '#A66DD4' },
  { nombre: 'Entretenimiento', icono: 'gameController', color: '#4D96FF' },
  { nombre: 'Servicios', icono: 'flash', color: '#F49D37' },
  { nombre: 'Otro', icono: 'ellipsisHorizontal', color: '#9DA3A4' },
];

export const getCategoriaColor = (nombre: string): string => {
  return CATEGORIAS.find((c) => c.nombre === nombre)?.color || '#9DA3A4';
};