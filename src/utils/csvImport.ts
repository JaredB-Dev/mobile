import { Transaction } from '../models/Transaction';

// Convierte filas crudas del CSV a objetos Transaction, validando el formato
export const parsearTransacciones = (filas: any[]): Transaction[] => {
  return filas.map((fila, index) => {
    const tipo = fila.tipo?.trim().toLowerCase();
    const monto = Number(fila.monto);

    if (tipo !== 'ingreso' && tipo !== 'gasto') {
      throw new Error(`Fila ${index + 1}: tipo inválido "${fila.tipo}"`);
    }
    if (isNaN(monto)) {
      throw new Error(`Fila ${index + 1}: monto inválido "${fila.monto}"`);
    }
    if (!fila.fecha) {
      throw new Error(`Fila ${index + 1}: falta la fecha`);
    }

    return {
      id: `csv-${Date.now()}-${index}`,
      tipo,
      monto,
      categoria: fila.categoria?.trim() || 'Otro',
      descripcion: fila.descripcion?.trim() || '',
      icono: 'ellipsisHorizontal',
      fecha: new Date(fila.fecha).toISOString(),
    };
  });
};