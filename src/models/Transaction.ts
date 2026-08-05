export interface Transaction {
  id: string;
  tipo: 'ingreso' | 'gasto';
  monto: number;
  categoria: string;
  icono: string; // nombre del ícono de ionicons
  descripcion: string;
  fecha: string;
}