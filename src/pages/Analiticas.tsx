import { useState, useMemo } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonActionSheet,
  IonItem,
  IonInput,
} from '@ionic/react';
import { downloadOutline } from 'ionicons/icons';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { CATEGORIAS, getCategoriaColor } from '../data/categorias';
import { Transaction } from '../models/Transaction';

// --- MOCK DATA: transacciones individuales de los últimos 14 meses ---
const generarMockTransacciones = (): Transaction[] => {
  const categorias = CATEGORIAS.filter((c) => c.nombre !== 'Salario').map((c) => c.nombre);
  const items: Transaction[] = [];
  for (let i = 0; i < 400; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 420)); // hasta 14 meses atrás
    const categoria = categorias[Math.floor(Math.random() * categorias.length)];
    items.push({
      id: String(i),
      tipo: 'gasto',
      monto: Math.round(Math.random() * 80 + 5),
      categoria,
      icono: CATEGORIAS.find((c) => c.nombre === categoria)?.icono || 'ellipsisHorizontal',
      descripcion: 'Gasto',
      fecha: date.toISOString(),
    });
  }
  // También agregamos algunos ingresos (Salario) para la comparativa
  for (let i = 0; i < 14; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    date.setDate(1);
    items.push({
      id: `ingreso-${i}`,
      tipo: 'ingreso',
      monto: 1200,
      categoria: 'Salario',
      icono: 'cash',
      descripcion: 'Salario mensual',
      fecha: date.toISOString(),
    });
  }
  return items;
};

const todasLasTransacciones = generarMockTransacciones();
// --- FIN MOCK DATA ---

type Periodo = 'semana' | 'mes' | 'anio' | 'personalizado';

// Devuelve el rango [inicio, fin] del período actual y del período anterior (para comparar)
const calcularRangos = (periodo: Periodo, fechaDesde?: string, fechaHasta?: string) => {
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
      // Para "personalizado" no calculamos período anterior comparable
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

const enRango = (fechaISO: string, inicio: Date, fin: Date) => {
  const fecha = new Date(fechaISO);
  return fecha >= inicio && fecha <= fin;
};

const etiquetaPeriodo = (periodo: Periodo) => {
  switch (periodo) {
    case 'semana': return { actual: 'Esta semana', anterior: 'Semana anterior' };
    case 'anio': return { actual: 'Este año', anterior: 'Año anterior' };
    case 'personalizado': return { actual: 'Rango seleccionado', anterior: '' };
    case 'mes':
    default: return { actual: 'Este mes', anterior: 'Mes anterior' };
  }
};

const Analiticas: React.FC = () => {
  const [periodo, setPeriodo] = useState<Periodo>('mes');
  const [fechaDesde, setFechaDesde] = useState<string>('');
  const [fechaHasta, setFechaHasta] = useState<string>('');
  const [showExportar, setShowExportar] = useState(false);

  const { inicioActual, finActual, inicioAnterior, finAnterior } = useMemo(
    () => calcularRangos(periodo, fechaDesde, fechaHasta),
    [periodo, fechaDesde, fechaHasta]
  );

  // Distribución por categoría del período actual (solo gastos)
  const distribucion = useMemo(() => {
    const mapa = new Map<string, number>();
    todasLasTransacciones
      .filter((t) => t.tipo === 'gasto' && enRango(t.fecha, inicioActual, finActual))
      .forEach((t) => {
        mapa.set(t.categoria, (mapa.get(t.categoria) || 0) + t.monto);
      });
    return Array.from(mapa.entries()).map(([categoria, monto]) => ({ categoria, monto }));
  }, [inicioActual, finActual]);

  const totalGastos = useMemo(() => distribucion.reduce((sum, d) => sum + d.monto, 0), [distribucion]);

  // Comparativa: período actual vs período anterior
  const comparativa = useMemo(() => {
    const sumar = (tipo: 'ingreso' | 'gasto', inicio: Date, fin: Date) =>
      todasLasTransacciones
        .filter((t) => t.tipo === tipo && enRango(t.fecha, inicio, fin))
        .reduce((sum, t) => sum + t.monto, 0);

    const labels = etiquetaPeriodo(periodo);
    const data = [
      { mes: labels.actual, ingresos: sumar('ingreso', inicioActual, finActual), gastos: sumar('gasto', inicioActual, finActual) },
    ];
    if (periodo !== 'personalizado') {
      data.unshift({
        mes: labels.anterior,
        ingresos: sumar('ingreso', inicioAnterior, finAnterior),
        gastos: sumar('gasto', inicioAnterior, finAnterior),
      });
    }
    return data;
  }, [periodo, inicioActual, finActual, inicioAnterior, finAnterior]);

  const exportarCSV = () => {
    const encabezado = 'Categoria,Monto\n';
    const filas = distribucion.map((d) => `${d.categoria},${d.monto}`).join('\n');
    const csv = encabezado + filas;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte-${periodo}-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Analíticas</IonTitle>
          <IonButton slot="end" fill="clear" onClick={() => setShowExportar(true)}>
            <IonIcon slot="icon-only" icon={downloadOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div style={{ padding: '0 16px', paddingTop: '12px' }}>
          <IonSegment value={periodo} onIonChange={(e) => setPeriodo(e.detail.value as Periodo)}>
            <IonSegmentButton value="semana">
              <IonLabel>Semana</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="mes">
              <IonLabel>Mes</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="anio">
              <IonLabel>Año</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="personalizado">
              <IonLabel>Personal.</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>

        {periodo === 'personalizado' && (
          <div style={{ display: 'flex', gap: '8px', padding: '12px 16px 0' }}>
            <IonItem style={{ flex: 1 }}>
              <IonInput label="Desde" type="date" value={fechaDesde} onIonInput={(e) => setFechaDesde(e.detail.value ?? '')} />
            </IonItem>
            <IonItem style={{ flex: 1 }}>
              <IonInput label="Hasta" type="date" value={fechaHasta} onIonInput={(e) => setFechaHasta(e.detail.value ?? '')} />
            </IonItem>
          </div>
        )}

        {/* Distribución por categoría */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle style={{ fontSize: '1rem' }}>Distribución de gastos</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {distribucion.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--ion-color-medium)' }}>Sin gastos en este período.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={distribucion} dataKey="monto" nameKey="categoria" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2}>
                    {distribucion.map((d) => (
                      <Cell key={d.categoria} fill={getCategoriaColor(d.categoria)} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => {
                      if (typeof value === "number" && typeof name === "string") {
                        return [
                          `$${value.toFixed(2)} (${((value / totalGastos) * 100).toFixed(0)}%)`,
                          name,
                        ];
                      }

                      return [String(value ?? ""), String(name ?? "")];
                    }}
                    labelStyle={{ color: "#333" }}
                  />
                  <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: '0.75rem' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </IonCardContent>
        </IonCard>

        {/* Comparativa */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle style={{ fontSize: '1rem' }}>Comparativa</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={comparativa} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                    formatter={(value) => {
                        if (typeof value === "number") {
                        return `$${value.toFixed(2)}`;
                        }

                        return value ?? "";
                    }}
                    labelStyle={{ color: "#333" }}
                />
                <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                <Bar dataKey="ingresos" fill="var(--ion-color-success)" radius={[6, 6, 0, 0]} name="Ingresos" />
                <Bar dataKey="gastos" fill="var(--ion-color-danger)" radius={[6, 6, 0, 0]} name="Gastos" />
              </BarChart>
            </ResponsiveContainer>
          </IonCardContent>
        </IonCard>

        <div style={{ height: '24px' }}></div>
      </IonContent>

      <IonActionSheet
        isOpen={showExportar}
        onDidDismiss={() => setShowExportar(false)}
        header="Exportar reporte"
        buttons={[
          { text: 'Descargar CSV', handler: exportarCSV },
          { text: 'Descargar PDF', handler: () => console.log('PDF: pendiente de implementar') },
          { text: 'Cancelar', role: 'cancel' },
        ]}
      />
    </IonPage>
  );
};

export default Analiticas;