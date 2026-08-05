import { useState, useMemo, useEffect } from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonIcon, IonActionSheet,
} from '@ionic/react';
import { downloadOutline } from 'ionicons/icons';
import { TransactionService } from '../services/TransactionService';
import { useTransactionsContext } from '../context/TransactionsContext';
import { Periodo, calcularRangos, etiquetaPeriodo } from '../utils/periodos';
import PeriodoSelector from '../components/analiticas/PeriodoSelector';
import DistribucionPieChart from '../components/analiticas/DistribucionPieChart';
import ComparativaBarChart from '../components/analiticas/ComparativaBarChart';

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
        <PeriodoSelector
          periodo={periodo}
          onPeriodoChange={setPeriodo}
          fechaDesde={fechaDesde}
          fechaHasta={fechaHasta}
          onFechaDesdeChange={setFechaDesde}
          onFechaHastaChange={setFechaHasta}
        />

        <DistribucionPieChart distribucion={distribucion} />
        <ComparativaBarChart comparativa={comparativa} />

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