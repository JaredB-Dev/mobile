export interface CsvTransaction {
  tipo: string;
  monto: string;
  categoria?: string;
  descripcion?: string;
  fecha: string;
}