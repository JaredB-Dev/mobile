import { useState, useEffect, useMemo } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonAlert } from '@ionic/react';
import { Transaction } from '../models/Transaction';
import { TransactionService } from '../services/TransactionService';
import { useTransactionsContext } from '../context/TransactionsContext';
import { formatMes } from '../utils/dateFormat';
import SearchToolbar from '../components/historial/SearchToolbar';
import FiltrosModal, { Filtros, filtrosVacios } from '../components/historial/FiltrosModal';
import TransactionListGroup from '../components/historial/TransactionListGroup';

const Historial: React.FC = () => {
  const { version, refresh } = useTransactionsContext();
  const [busqueda, setBusqueda] = useState('');
  const [filtros, setFiltros] = useState<Filtros>(filtrosVacios);
  const [showFiltros, setShowFiltros] = useState(false);
  const [transaccionAEliminar, setTransaccionAEliminar] = useState<string | null>(null);
  const [transacciones, setTransacciones] = useState<Transaction[]>([]);

  useEffect(() => {
    const cargar = async () => {
      const resultado = await TransactionService.buscar({
        busqueda,
        categoria: filtros.categoria,
        montoMin: filtros.montoMin ? Number(filtros.montoMin) : undefined,
        montoMax: filtros.montoMax ? Number(filtros.montoMax) : undefined,
        fechaDesde: filtros.fechaDesde,
        fechaHasta: filtros.fechaHasta,
      });
      setTransacciones(resultado);
    };
    cargar();
  }, [busqueda, filtros, version]);

  const filtrosActivos = useMemo(() => {
    let count = 0;
    if (filtros.categoria) count++;
    if (filtros.montoMin) count++;
    if (filtros.montoMax) count++;
    if (filtros.fechaDesde) count++;
    if (filtros.fechaHasta) count++;
    return count;
  }, [filtros]);

  const grupos = useMemo(() => {
    const map = new Map<string, Transaction[]>();
    transacciones.forEach((t) => {
      const clave = formatMes(t.fecha);
      if (!map.has(clave)) map.set(clave, []);
      map.get(clave)!.push(t);
    });
    return Array.from(map.entries());
  }, [transacciones]);

  const handleEliminar = async () => {
    if (transaccionAEliminar) {
      await TransactionService.remove(transaccionAEliminar);
      setTransaccionAEliminar(null);
      refresh();
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Historial</IonTitle>
        </IonToolbar>
        <SearchToolbar
          busqueda={busqueda}
          onBusquedaChange={setBusqueda}
          filtrosActivos={filtrosActivos}
          onAbrirFiltros={() => setShowFiltros(true)}
        />
      </IonHeader>

      <IonContent>
        {grupos.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--ion-color-medium)' }}>
            No se encontraron transacciones con esos filtros.
          </div>
        )}

        {grupos.map(([mes, items]) => (
          <TransactionListGroup
            key={mes}
            mes={mes}
            items={items}
            onEditar={(id) => console.log('Editar', id)}
            onEliminar={(id) => setTransaccionAEliminar(id)}
          />
        ))}

        <div style={{ height: '24px' }}></div>
      </IonContent>

      <FiltrosModal
        isOpen={showFiltros}
        filtros={filtros}
        onClose={() => setShowFiltros(false)}
        onFiltrosChange={setFiltros}
      />

      <IonAlert
        isOpen={transaccionAEliminar !== null}
        onDidDismiss={() => setTransaccionAEliminar(null)}
        header="¿Eliminar transacción?"
        message="Esta acción no se puede deshacer."
        buttons={[
          { text: 'Cancelar', role: 'cancel' },
          { text: 'Eliminar', role: 'destructive', handler: handleEliminar },
        ]}
      />
    </IonPage>
  );
};

export default Historial;