import { useState, useMemo } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonButton,
  IonIcon,
  IonList,
  IonListHeader,
  IonLabel,
  IonItemSliding,
  IonItem,
  IonItemOptions,
  IonItemOption,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonButtons,
  IonAlert,
  IonBadge,
} from '@ionic/react';
import { filterOutline, close, createOutline, trashOutline } from 'ionicons/icons';
import { Transaction } from '../models/Transaction';
import { CATEGORIAS } from '../data/categorias';
import { getIcon } from '../utils/iconMap';

// --- MOCK DATA: reemplazar por lectura real de SQLite ---
const generarMock = (): Transaction[] => {
  const categorias = CATEGORIAS.map((c) => c.nombre);
  const items: Transaction[] = [];
  for (let i = 0; i < 40; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));
    const categoria = categorias[Math.floor(Math.random() * categorias.length)];
    const esIngreso = categoria === 'Salario';
    items.push({
      id: String(i),
      tipo: esIngreso ? 'ingreso' : 'gasto',
      monto: Math.round(Math.random() * 200 + 5),
      categoria,
      icono: CATEGORIAS.find((c) => c.nombre === categoria)?.icono || 'ellipsisHorizontal',
      descripcion: esIngreso ? 'Pago recibido' : 'Compra / pago',
      fecha: date.toISOString(),
    });
  }
  return items.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
};

const mockData = generarMock();
// --- FIN MOCK DATA ---

interface Filtros {
  categoria: string | null;
  montoMin: string;
  montoMax: string;
  fechaDesde: string | null;
  fechaHasta: string | null;
}

const filtrosVacios: Filtros = {
  categoria: null,
  montoMin: '',
  montoMax: '',
  fechaDesde: null,
  fechaHasta: null,
};

const formatMes = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
};

const formatDia = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
};

const Historial: React.FC = () => {
  const [busqueda, setBusqueda] = useState('');
  const [filtros, setFiltros] = useState<Filtros>(filtrosVacios);
  const [showFiltros, setShowFiltros] = useState(false);
  const [transaccionAEliminar, setTransaccionAEliminar] = useState<string | null>(null);
  const [transacciones, setTransacciones] = useState<Transaction[]>(mockData);

  const filtrosActivos = useMemo(() => {
    let count = 0;
    if (filtros.categoria) count++;
    if (filtros.montoMin) count++;
    if (filtros.montoMax) count++;
    if (filtros.fechaDesde) count++;
    if (filtros.fechaHasta) count++;
    return count;
  }, [filtros]);

  const transaccionesFiltradas = useMemo(() => {
    return transacciones.filter((t) => {
      const coincideBusqueda =
        busqueda.trim() === '' ||
        t.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
        t.categoria.toLowerCase().includes(busqueda.toLowerCase());

      const coincideCategoria = !filtros.categoria || t.categoria === filtros.categoria;
      const coincideMontoMin = !filtros.montoMin || t.monto >= Number(filtros.montoMin);
      const coincideMontoMax = !filtros.montoMax || t.monto <= Number(filtros.montoMax);
      const coincideFechaDesde = !filtros.fechaDesde || t.fecha >= filtros.fechaDesde;
      const coincideFechaHasta = !filtros.fechaHasta || t.fecha <= filtros.fechaHasta;

      return (
        coincideBusqueda &&
        coincideCategoria &&
        coincideMontoMin &&
        coincideMontoMax &&
        coincideFechaDesde &&
        coincideFechaHasta
      );
    });
  }, [transacciones, busqueda, filtros]);

  // Agrupa las transacciones filtradas por mes
  const grupos = useMemo(() => {
    const map = new Map<string, Transaction[]>();
    transaccionesFiltradas.forEach((t) => {
      const clave = formatMes(t.fecha);
      if (!map.has(clave)) map.set(clave, []);
      map.get(clave)!.push(t);
    });
    return Array.from(map.entries());
  }, [transaccionesFiltradas]);

  const handleEliminar = () => {
    if (transaccionAEliminar) {
      setTransacciones((prev) => prev.filter((t) => t.id !== transaccionAEliminar));
      setTransaccionAEliminar(null);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Historial</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={busqueda}
            onIonInput={(e) => setBusqueda(e.detail.value ?? '')}
            placeholder="Buscar por descripción o categoría"
            debounce={300}
          />
          <IonButtons slot="end" style={{ marginRight: '8px' }}>
            <IonButton onClick={() => setShowFiltros(true)}>
              <IonIcon slot="icon-only" icon={filterOutline} />
              {filtrosActivos > 0 && (
                <IonBadge color="danger" style={{ position: 'absolute', top: 0, right: 0, fontSize: '0.6rem' }}>
                  {filtrosActivos}
                </IonBadge>
              )}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {grupos.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--ion-color-medium)' }}>
            No se encontraron transacciones con esos filtros.
          </div>
        )}

        {grupos.map(([mes, items]) => (
          <IonList key={mes} inset>
            <IonListHeader>
              <IonLabel style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{mes}</IonLabel>
            </IonListHeader>

            {items.map((t) => {
              const esIngreso = t.tipo === 'ingreso';
              return (
                <IonItemSliding key={t.id}>
                  <IonItem button detail={false}>
                    <div
                      slot="start"
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: esIngreso ? 'var(--ion-color-success-tint)' : 'var(--ion-color-danger-tint)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IonIcon
                        icon={getIcon(t.icono)}
                        style={{ fontSize: '17px', color: 'var(--ion-color-light)' }}
                      />
                    </div>
                    <IonLabel>
                      <h3>{t.categoria}</h3>
                      <p>{t.descripcion}</p>
                    </IonLabel>
                    <div slot="end" style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold', color: esIngreso ? 'var(--ion-color-success)' : 'var(--ion-color-danger)' }}>
                        {esIngreso ? '+' : '-'}${t.monto.toFixed(2)}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--ion-color-medium)' }}>{formatDia(t.fecha)}</div>
                    </div>
                  </IonItem>

                  <IonItemOptions side="end">
                    <IonItemOption color="primary" onClick={() => console.log('Editar', t.id)}>
                      <IonIcon slot="icon-only" icon={createOutline} />
                    </IonItemOption>
                    <IonItemOption color="danger" onClick={() => setTransaccionAEliminar(t.id)}>
                      <IonIcon slot="icon-only" icon={trashOutline} />
                    </IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
              );
            })}
          </IonList>
        ))}

        <div style={{ height: '24px' }}></div>
      </IonContent>

      {/* Modal de filtros */}
      <IonModal isOpen={showFiltros} onDidDismiss={() => setShowFiltros(false)} initialBreakpoint={0.6} breakpoints={[0, 0.6, 0.9]}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Filtros</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowFiltros(false)}>
                <IonIcon icon={close} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonItem>
            <IonSelect
              label="Categoría"
              placeholder="Todas"
              value={filtros.categoria}
              onIonChange={(e) => setFiltros((f) => ({ ...f, categoria: e.detail.value }))}
            >
              {CATEGORIAS.map((c) => (
                <IonSelectOption key={c.nombre} value={c.nombre}>
                  {c.nombre}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonInput
              label="Monto mínimo"
              type="number"
              placeholder="0"
              value={filtros.montoMin}
              onIonInput={(e) => setFiltros((f) => ({ ...f, montoMin: e.detail.value ?? '' }))}
            />
          </IonItem>

          <IonItem>
            <IonInput
              label="Monto máximo"
              type="number"
              placeholder="Sin límite"
              value={filtros.montoMax}
              onIonInput={(e) => setFiltros((f) => ({ ...f, montoMax: e.detail.value ?? '' }))}
            />
          </IonItem>

          <IonItem>
            <IonInput
              label="Desde"
              type="date"
              value={filtros.fechaDesde ?? ''}
              onIonInput={(e) => setFiltros((f) => ({ ...f, fechaDesde: e.detail.value || null }))}
            />
          </IonItem>

          <IonItem lines="none">
            <IonInput
              label="Hasta"
              type="date"
              value={filtros.fechaHasta ?? ''}
              onIonInput={(e) => setFiltros((f) => ({ ...f, fechaHasta: e.detail.value || null }))}
            />
          </IonItem>

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <IonButton fill="outline" expand="block" style={{ flex: 1 }} onClick={() => setFiltros(filtrosVacios)}>
              Limpiar
            </IonButton>
            <IonButton expand="block" style={{ flex: 1 }} onClick={() => setShowFiltros(false)}>
              Aplicar
            </IonButton>
          </div>
        </IonContent>
      </IonModal>

      {/* Confirmación de borrado */}
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