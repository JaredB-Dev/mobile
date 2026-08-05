import { IonSegment, IonSegmentButton, IonIcon, IonLabel } from '@ionic/react';
import { cashOutline, cardOutline } from 'ionicons/icons';

interface TipoSelectorProps {
  tipo: 'ingreso' | 'gasto';
  onTipoChange: (tipo: 'ingreso' | 'gasto') => void;
}

const TipoSelector: React.FC<TipoSelectorProps> = ({ tipo, onTipoChange }) => {
  return (
    <IonSegment value={tipo} onIonChange={(e) => onTipoChange(e.detail.value as 'ingreso' | 'gasto')}>
      <IonSegmentButton value="gasto">
        <IonIcon icon={cardOutline} />
        <IonLabel>Gasto</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="ingreso">
        <IonIcon icon={cashOutline} />
        <IonLabel>Ingreso</IonLabel>
      </IonSegmentButton>
    </IonSegment>
  );
};

export default TipoSelector;