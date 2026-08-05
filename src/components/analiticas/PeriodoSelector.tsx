import { IonSegment, IonSegmentButton, IonLabel, IonItem, IonInput } from '@ionic/react';
import { Periodo } from '../../utils/periodos';

interface PeriodoSelectorProps {
  periodo: Periodo;
  onPeriodoChange: (periodo: Periodo) => void;
  fechaDesde: string;
  fechaHasta: string;
  onFechaDesdeChange: (valor: string) => void;
  onFechaHastaChange: (valor: string) => void;
}

const PeriodoSelector: React.FC<PeriodoSelectorProps> = ({
  periodo, onPeriodoChange, fechaDesde, fechaHasta, onFechaDesdeChange, onFechaHastaChange,
}) => {
  return (
    <>
      <div style={{ padding: '0 16px', paddingTop: '12px' }}>
        <IonSegment value={periodo} onIonChange={(e) => onPeriodoChange(e.detail.value as Periodo)}>
          <IonSegmentButton value="semana"><IonLabel>Semana</IonLabel></IonSegmentButton>
          <IonSegmentButton value="mes"><IonLabel>Mes</IonLabel></IonSegmentButton>
          <IonSegmentButton value="anio"><IonLabel>Año</IonLabel></IonSegmentButton>
          <IonSegmentButton value="personalizado"><IonLabel>Personal.</IonLabel></IonSegmentButton>
        </IonSegment>
      </div>

      {periodo === 'personalizado' && (
        <div style={{ display: 'flex', gap: '8px', padding: '12px 16px 0' }}>
          <IonItem style={{ flex: 1 }}>
            <IonInput label="Desde" type="date" value={fechaDesde} onIonInput={(e) => onFechaDesdeChange(e.detail.value ?? '')} />
          </IonItem>
          <IonItem style={{ flex: 1 }}>
            <IonInput label="Hasta" type="date" value={fechaHasta} onIonInput={(e) => onFechaHastaChange(e.detail.value ?? '')} />
          </IonItem>
        </div>
      )}
    </>
  );
};

export default PeriodoSelector;