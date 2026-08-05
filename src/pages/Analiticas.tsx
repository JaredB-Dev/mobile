import { useState, useMemo, useEffect } from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSegment, IonSegmentButton, IonLabel,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonIcon, IonActionSheet, IonItem, IonInput,
} from '@ionic/react';
import { downloadOutline } from 'ionicons/icons';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { getCategoriaColor } from '../data/categorias';
import { TransactionService } from '../services/TransactionService';
import { useTransactionsContext } from '../context/TransactionsContext';

type Periodo = 'semana' | 'mes' | 'anio' | 'personalizado';

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
  const { version } = useTransactionsContext();
  const [periodo, setPeriodo] = useState<Periodo>('mes');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [showExportar, setShowExportar] = useState(false);
  const [distribucion, setDistribucion] = useState<{ categoria: string; monto: number }[]>([]);
  const [comparativa, setComparativa] = useState<{ mes: string; ingresos: number; gastos: number }[]>([]);

  const { inicioActual, finActual, inicioAnterior, finAnterior } = useMemo(
    () => calcularRangos(periodo, fechaDesde, fechaHasta),
    [periodo, fechaDesde, fechaHasta]
  );

  useEffect(() => {
    const cargar = async () => {
      const dist = await TransactionService.getDistribucionPorCategoria(inicioActual.toISOString(), finActual.toISOString());
      setDistribucion(dist);

      const labels = etiquetaPeriodo(periodo);
      const actual = await TransactionService.getTotalesPorTipo(inicioActual.toISOString(), finActual.toISOString());
      const data = [{ mes: labels.actual, ...actual }];

      if (periodo !== 'personalizado') {
        const anterior = await TransactionService.getTotalesPorTipo(inicioAnterior.toISOString(), finAnterior.toISOString());
        data.unshift({ mes: labels.anterior, ...anterior });
      }
      setComparativa(data);
    };
    cargar();
  }, [inicioActual, finActual, inicioAnterior, finAnterior, periodo, version]);

  const totalGastos = useMemo(() => distribucion.reduce((sum, d) => sum + d.monto, 0), [distribucion]);

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
            <IonSegmentButton value="semana"><IonLabel>Semana</IonLabel></IonSegmentButton>
            <IonSegmentButton value="mes"><IonLabel>Mes</IonLabel></IonSegmentButton>
            <IonSegmentButton value="anio"><IonLabel>Año</IonLabel></IonSegmentButton>
            <IonSegmentButton value="personalizado"><IonLabel>Personal.</IonLabel></IonSegmentButton>
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

        <IonCard>
          <IonCardHeader><IonCardTitle style={{ fontSize: '1rem' }}>Distribución de gastos</IonCardTitle></IonCardHeader>
          <IonCardContent>
            {distribucion.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--ion-color-medium)' }}>Sin gastos en este período.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={distribucion} dataKey="monto" nameKey="categoria" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2}>
                    {distribucion.map((d) => <Cell key={d.categoria} fill={getCategoriaColor(d.categoria)} />)}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => {
                      if (typeof value === 'number' && typeof name === 'string') {
                        return [`$${value.toFixed(2)} (${((value / totalGastos) * 100).toFixed(0)}%)`, name];
                      }
                      return [String(value ?? ''), String(name ?? '')];
                    }}
                    labelStyle={{ color: '#333' }}
                  />
                  <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: '0.75rem' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader><IonCardTitle style={{ fontSize: '1rem' }}>Comparativa</IonCardTitle></IonCardHeader>
          <IonCardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={comparativa} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(value) => (typeof value === 'number' ? `$${value.toFixed(2)}` : value ?? '')}
                  labelStyle={{ color: '#333' }}
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