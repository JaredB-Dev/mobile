import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

const DB_NAME = 'gestor_gastos';
const sqlite = new SQLiteConnection(CapacitorSQLite);
let db: SQLiteDBConnection | null = null;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  tipo TEXT NOT NULL CHECK(tipo IN ('ingreso','gasto')),
  monto REAL NOT NULL,
  categoria TEXT NOT NULL,
  icono TEXT NOT NULL,
  descripcion TEXT,
  fecha TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_transactions_fecha ON transactions(fecha);
`;

export const initDatabase = async (): Promise<SQLiteDBConnection> => {
  if (db) return db;

  // Soporte para pruebas en navegador (jeep-sqlite). En Android no hace nada.
  if (Capacitor.getPlatform() === 'web') {
    const jeepEl = document.querySelector('jeep-sqlite');
    if (jeepEl) {
      await customElements.whenDefined('jeep-sqlite');
      await sqlite.initWebStore();
    }
  }

  const ret = await sqlite.checkConnectionsConsistency();
  const isConn = (await sqlite.isConnection(DB_NAME, false)).result;

  db = ret.result && isConn
    ? await sqlite.retrieveConnection(DB_NAME, false)
    : await sqlite.createConnection(DB_NAME, false, 'no-encryption', 1, false);

  await db.open();
  await db.execute(SCHEMA);

  return db;
};

export const getDatabase = (): SQLiteDBConnection => {
  if (!db) throw new Error('La base de datos no ha sido inicializada. Llama a initDatabase() primero.');
  return db;
};