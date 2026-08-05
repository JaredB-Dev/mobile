export interface Categoria {
  nombre: string;
  icono: string;
  color: string;
  tipo: 'ingreso' | 'gasto' | 'ambos';
}

export const CATEGORIAS: Categoria[] = [
  { nombre: 'Comida', icono: 'restaurant', color: '#FF6B6B', tipo: 'gasto' },
  { nombre: 'Transporte', icono: 'bus', color: '#4ECDC4', tipo: 'gasto' },
  { nombre: 'Compras', icono: 'bag', color: '#FFD93D', tipo: 'gasto' },
  { nombre: 'Salud', icono: 'medkit', color: '#A66DD4', tipo: 'gasto' },
  { nombre: 'Entretenimiento', icono: 'gameController', color: '#4D96FF', tipo: 'gasto' },
  { nombre: 'Servicios', icono: 'flash', color: '#F49D37', tipo: 'gasto' },
  { nombre: 'Salario', icono: 'cash', color: '#6BCB77', tipo: 'ingreso' },
  { nombre: 'Extra', icono: 'gift', color: '#8CE99A', tipo: 'ingreso' },
  { nombre: 'Otro', icono: 'ellipsisHorizontal', color: '#9DA3A4', tipo: 'ambos' },
];

export const getCategoriaColor = (nombre: string): string => {
  return CATEGORIAS.find((c) => c.nombre === nombre)?.color || '#9DA3A4';
};

export const getCategoriasPorTipo = (tipo: 'ingreso' | 'gasto'): Categoria[] => {
  return CATEGORIAS.filter((c) => c.tipo === tipo || c.tipo === 'ambos');
};