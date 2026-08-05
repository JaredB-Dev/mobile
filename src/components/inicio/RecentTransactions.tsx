import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonNote,
} from '@ionic/react';
import { Transaction } from '../../models/Transaction';
import { getIcon } from '../../utils/iconMap';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const formatFecha = (isoString: string) => {
  const date = new Date(isoString);
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
};

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle style={{ fontSize: '1rem' }}>Transacciones recientes</IonCardTitle>
      </IonCardHeader>
      <IonList lines="full">
        {transactions.map((t) => {
          const esIngreso = t.tipo === 'ingreso';
          return (
            <IonItem key={t.id} button detail={false}>
              <div
                slot="start"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: esIngreso ? 'var(--ion-color-success-tint)' : 'var(--ion-color-danger-tint)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IonIcon
                  icon={getIcon(t.icono)}
                  style={{
                    fontSize: '18px',
                    color: 'var(--ion-color-light)',
                  }}
                />
              </div>
              <IonLabel>
                <h3>{t.categoria}</h3>
                <p>{t.descripcion}</p>
              </IonLabel>
              <IonNote
                slot="end"
                color={esIngreso ? 'success' : 'danger'}
                style={{ fontWeight: 'bold' }}
              >
                {esIngreso ? '+' : '-'}${t.monto.toFixed(2)}
                <div style={{ fontSize: '0.7rem', color: 'var(--ion-color-medium)', textAlign: 'right' }}>
                  {formatFecha(t.fecha)}
                </div>
              </IonNote>
            </IonItem>
          );
        })}
      </IonList>
    </IonCard>
  );
};

export default RecentTransactions;