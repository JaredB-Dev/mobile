import { getDatabase } from './database';
import { Transaction } from '../models/Transaction';

export const TransactionService = {
  async getAll(): Promise<Transaction[]> {
    const db = getDatabase();
    const result = await db.query('SELECT * FROM transactions ORDER BY fecha DESC;');
    return (result.values as Transaction[]) || [];
  },

  async getRecent(limit = 5): Promise<Transaction[]> {
    const db = getDatabase();
    const result = await db.query('SELECT * FROM transactions ORDER BY fecha DESC LIMIT ?;', [limit]);
    return (result.values as Transaction[]) || [];
  },

  async buscar(filtros: {
    busqueda?: string;
    categoria?: string | null;
    montoMin?: number;
    montoMax?: number;
    fechaDesde?: string | null;
    fechaHasta?: string | null;
  }): Promise<Transaction[]> {
    const db = getDatabase();
    const condiciones: string[] = [];
    const valores: any[] = [];

    if (filtros.busqueda) {
      condiciones.push('(descripcion LIKE ? OR categoria LIKE ?)');
      valores.push(`%${filtros.busqueda}%`, `%${filtros.busqueda}%`);
    }
    if (filtros.categoria) {
      condiciones.push('categoria = ?');
      valores.push(filtros.categoria);
    }
    if (filtros.montoMin != null) {
      condiciones.push('monto >= ?');
      valores.push(filtros.montoMin);
    }
    if (filtros.montoMax != null) {
      condiciones.push('monto <= ?');
      valores.push(filtros.montoMax);
    }
    if (filtros.fechaDesde) {
      condiciones.push('fecha >= ?');
      valores.push(filtros.fechaDesde);
    }
    if (filtros.fechaHasta) {
      condiciones.push('fecha <= ?');
      valores.push(filtros.fechaHasta);
    }

    const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';
    const result = await db.query(`SELECT * FROM transactions ${where} ORDER BY fecha DESC;`, valores);
    return (result.values as Transaction[]) || [];
  },

  async insert(t: Transaction): Promise<void> {
    const db = getDatabase();
    await db.run(
      `INSERT INTO transactions (id, tipo, monto, categoria, icono, descripcion, fecha) VALUES (?, ?, ?, ?, ?, ?, ?);`,
      [t.id, t.tipo, t.monto, t.categoria, t.icono, t.descripcion, t.fecha]
    );
  },

  async insertMany(items: Transaction[]): Promise<void> {
    if (items.length === 0) return;
    const db = getDatabase();
    await db.executeSet(
      items.map((t) => ({
        statement: `INSERT INTO transactions (id, tipo, monto, categoria, icono, descripcion, fecha) VALUES (?, ?, ?, ?, ?, ?, ?);`,
        values: [t.id, t.tipo, t.monto, t.categoria, t.icono, t.descripcion, t.fecha],
      }))
    );
  },

  async update(t: Transaction): Promise<void> {
    const db = getDatabase();
    await db.run(
      `UPDATE transactions SET tipo=?, monto=?, categoria=?, icono=?, descripcion=?, fecha=? WHERE id=?;`,
      [t.tipo, t.monto, t.categoria, t.icono, t.descripcion, t.fecha, t.id]
    );
  },

  async remove(id: string): Promise<void> {
    const db = getDatabase();
    await db.run('DELETE FROM transactions WHERE id=?;', [id]);
  },

  async deleteAll(): Promise<void> {
    const db = getDatabase();
    await db.run('DELETE FROM transactions;');
  },

  // --- Para Inicio: balance total + ingresos/gastos del mes actual ---
  async getResumen(): Promise<{ balance: number; ingresos: number; gastos: number }> {
    const db = getDatabase();
    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1).toISOString();

    const totalRes = await db.query(
      `SELECT COALESCE(SUM(CASE WHEN tipo='ingreso' THEN monto ELSE -monto END), 0) as balance FROM transactions;`
    );
    const mesRes = await db.query(
      `SELECT tipo, SUM(monto) as total FROM transactions WHERE fecha >= ? GROUP BY tipo;`,
      [inicioMes]
    );

    const balance = (totalRes.values?.[0]?.balance as number) || 0;
    let ingresos = 0, gastos = 0;
    (mesRes.values || []).forEach((row: any) => {
      if (row.tipo === 'ingreso') ingresos = row.total;
      if (row.tipo === 'gasto') gastos = row.total;
    });

    return { balance, ingresos, gastos };
  },

  // --- Para Inicio: tendencia diaria de los últimos N días (rellena días vacíos con 0) ---
  async getTendencia(dias: number): Promise<{ fecha: string; ingresos: number; gastos: number }[]> {
    const db = getDatabase();
    const hoy = new Date();
    const desde = new Date();
    desde.setDate(hoy.getDate() - (dias - 1));
    desde.setHours(0, 0, 0, 0);

    const result = await db.query(`SELECT tipo, monto, fecha FROM transactions WHERE fecha >= ?;`, [desde.toISOString()]);
    const rows = (result.values || []) as { tipo: string; monto: number; fecha: string }[];

    const mapa = new Map<string, { ingresos: number; gastos: number }>();
    for (let i = 0; i < dias; i++) {
      const d = new Date(desde);
      d.setDate(desde.getDate() + i);
      const clave = d.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
      mapa.set(clave, { ingresos: 0, gastos: 0 });
    }

    rows.forEach((r) => {
      const clave = new Date(r.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
      const actual = mapa.get(clave);
      if (actual) {
        if (r.tipo === 'ingreso') actual.ingresos += r.monto;
        else actual.gastos += r.monto;
      }
    });

    return Array.from(mapa.entries()).map(([fecha, v]) => ({ fecha, ...v }));
  },

  // --- Para Analíticas: distribución de gastos por categoría en un rango ---
  async getDistribucionPorCategoria(desde: string, hasta: string): Promise<{ categoria: string; monto: number }[]> {
    const db = getDatabase();
    const result = await db.query(
      `SELECT categoria, SUM(monto) as monto FROM transactions
       WHERE tipo = 'gasto' AND fecha BETWEEN ? AND ?
       GROUP BY categoria;`,
      [desde, hasta]
    );
    return (result.values || []) as { categoria: string; monto: number }[];
  },

  // --- Para Analíticas: totales de ingresos/gastos en un rango (para comparativas) ---
  async getTotalesPorTipo(desde: string, hasta: string): Promise<{ ingresos: number; gastos: number }> {
    const db = getDatabase();
    const result = await db.query(
      `SELECT tipo, SUM(monto) as total FROM transactions WHERE fecha BETWEEN ? AND ? GROUP BY tipo;`,
      [desde, hasta]
    );
    let ingresos = 0, gastos = 0;
    (result.values || []).forEach((row: any) => {
      if (row.tipo === 'ingreso') ingresos = row.total;
      if (row.tipo === 'gasto') gastos = row.total;
    });
    return { ingresos, gastos };
  },
};