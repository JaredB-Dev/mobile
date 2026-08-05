import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonContent, IonItem, IonSelect, IonSelectOption, IonInput,
} from '@ionic/react';
import { close } from 'ionicons/icons';
import { CATEGORIAS } from '../../data/categorias';

export interface Filtros {
  categoria: string | null;
  montoMin: string;
  montoMax: string;
  fechaDesde: string | null;
  fechaHasta: string | null;
}

export const filtrosVacios: Filtros = {
  categoria: null,
  montoMin: '',
  montoMax: '',
  fechaDesde: null,
  fechaHasta: null,
};

interface FiltrosModalProps {
  isOpen: boolean;
  filtros: Filtros;
  onClose: () => void;
  onFiltrosChange: (filtros: Filtros) => void;
}

const FiltrosModal: React.FC<FiltrosModalProps> = ({ isOpen, filtros, onClose, onFiltrosChange }) => {
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} initialBreakpoint={0.6} breakpoints={[0, 0.6, 0.9]}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Filtros</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>
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
            onIonChange={(e) => onFiltrosChange({ ...filtros, categoria: e.detail.value })}
          >
            {CATEGORIAS.map((c) => (
              <IonSelectOption key={c.nombre} value={c.nombre}>{c.nombre}</IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonInput label="Monto mínimo" type="number" placeholder="0" value={filtros.montoMin}
            onIonInput={(e) => onFiltrosChange({ ...filtros, montoMin: e.detail.value ?? '' })} />
        </IonItem>

        <IonItem>
          <IonInput label="Monto máximo" type="number" placeholder="Sin límite" value={filtros.montoMax}
            onIonInput={(e) => onFiltrosChange({ ...filtros, montoMax: e.detail.value ?? '' })} />
        </IonItem>

        <IonItem>
          <IonInput label="Desde" type="date" value={filtros.fechaDesde ?? ''}
            onIonInput={(e) => onFiltrosChange({ ...filtros, fechaDesde: e.detail.value || null })} />
        </IonItem>

        <IonItem lines="none">
          <IonInput label="Hasta" type="date" value={filtros.fechaHasta ?? ''}
            onIonInput={(e) => onFiltrosChange({ ...filtros, fechaHasta: e.detail.value || null })} />
        </IonItem>

        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <IonButton fill="outline" expand="block" style={{ flex: 1 }} onClick={() => onFiltrosChange(filtrosVacios)}>
            Limpiar
          </IonButton>
          <IonButton expand="block" style={{ flex: 1 }} onClick={onClose}>
            Aplicar
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default FiltrosModal;