import { IonItem, IonIcon, IonLabel } from '@ionic/react';
import { Transaction } from '../../models/Transaction';
import { getIcon } from '../../utils/iconMap';
import { formatDia } from '../../utils/dateFormat';

interface TransactionRowProps {
  transaction: Transaction;
  onClick?: () => void;
}

const TransactionRow: React.FC<TransactionRowProps> = ({ transaction: t, onClick }) => {
  const esIngreso = t.tipo === 'ingreso';

  return (
    <IonItem button detail={false} onClick={onClick}>
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
          style={{ fontSize: '18px', color: 'var(--ion-color-light)' }}
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
        <div style={{ fontSize: '0.7rem', color: 'var(--ion-color-medium)' }}>
          {formatDia(t.fecha)}
        </div>
      </div>
    </IonItem>
  );
};

export default TransactionRow;