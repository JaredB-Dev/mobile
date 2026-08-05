import { IonSegment, IonSegmentButton, IonIcon, IonLabel } from '@ionic/react';
import { cashOutline, cardOutline } from 'ionicons/icons';

interface TipoSelectorProps {
  tipo: 'ingreso' | 'gasto';
  onTipoChange: (tipo: 'ingreso' | 'gasto') => void;
}

const TipoSelector: React.FC<TipoSelectorProps> = ({ tipo, onTipoChange }) => {
  return (
    <IonSegment value={tipo} onIonChange={(e) => onTipoChange(e.detail.value as 'ingreso' | 'gasto')}>
      <IonSegmentButton
        value="gasto"
        style={{
          '--background': 'var(--ion-color-danger-tint)',
          '--background-checked': 'var(--ion-color-danger-tint)',
          '--color': 'var(--ion-color-danger-shade)',
          '--color-checked': 'var(--ion-color-danger-shade)',
          '--indicator-color': 'transparent',
          opacity: tipo === 'gasto' ? 1 : 0.55,
        } as React.CSSProperties}
      >
        <IonIcon icon={cardOutline} />
        <IonLabel>Gasto</IonLabel>
      </IonSegmentButton>

      <IonSegmentButton
        value="ingreso"
        style={{
          '--background': 'var(--ion-color-success-tint)',
          '--background-checked': 'var(--ion-color-success-tint)',
          '--color': 'var(--ion-color-success-shade)',
          '--color-checked': 'var(--ion-color-success-shade)',
          '--indicator-color': 'transparent',
          opacity: tipo === 'ingreso' ? 1 : 0.55,
        } as React.CSSProperties}
      >
        <IonIcon icon={cashOutline} />
        <IonLabel>Ingreso</IonLabel>
      </IonSegmentButton>
    </IonSegment>
  );
};

export default TipoSelector;