export type Periodo = 'semana' | 'mes' | 'anio' | 'personalizado';

export const calcularRangos = (periodo: Periodo, fechaDesde?: string, fechaHasta?: string) => {
  const ahora = new Date();
  let inicioActual: Date, finActual: Date, inicioAnterior: Date, finAnterior: Date;

  switch (periodo) {
    case 'semana': {
      const diaSemana = ahora.getDay();
      inicioActual = new Date(ahora);
      inicioActual.setDate(ahora.getDate() - diaSemana);
      inicioActual.setHours(0, 0, 0, 0);
      finActual = new Date();
      inicioAnterior = new Date(inicioActual);
      inicioAnterior.setDate(inicioActual.getDate() - 7);
      finAnterior = new Date(inicioActual);
      finAnterior.setMilliseconds(-1);
      break;
    }
    case 'anio': {
      inicioActual = new Date(ahora.getFullYear(), 0, 1);
      finActual = new Date();
      inicioAnterior = new Date(ahora.getFullYear() - 1, 0, 1);
      finAnterior = new Date(ahora.getFullYear(), 0, 1);
      finAnterior.setMilliseconds(-1);
      break;
    }
    case 'personalizado': {
      inicioActual = fechaDesde ? new Date(fechaDesde) : new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      finActual = fechaHasta ? new Date(fechaHasta) : new Date();
      inicioAnterior = inicioActual;
      finAnterior = inicioActual;
      break;
    }
    case 'mes':
    default: {
      inicioActual = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      finActual = new Date();
      inicioAnterior = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);
      finAnterior = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      finAnterior.setMilliseconds(-1);
      break;
    }
  }
  return { inicioActual, finActual, inicioAnterior, finAnterior };
};

export const etiquetaPeriodo = (periodo: Periodo) => {
  switch (periodo) {
    case 'semana': return { actual: 'Esta semana', anterior: 'Semana anterior' };
    case 'anio': return { actual: 'Este año', anterior: 'Año anterior' };
    case 'personalizado': return { actual: 'Rango seleccionado', anterior: '' };
    case 'mes':
    default: return { actual: 'Este mes', anterior: 'Mes anterior' };
  }
};