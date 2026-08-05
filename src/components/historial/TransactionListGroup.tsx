import { IonList, IonListHeader, IonLabel, IonItemSliding, IonItemOptions, IonItemOption, IonIcon } from '@ionic/react';
import { createOutline, trashOutline } from 'ionicons/icons';
import { Transaction } from '../../models/Transaction';
import TransactionRow from '../shared/TransactionRow';

interface TransactionListGroupProps {
  mes: string;
  items: Transaction[];
  onEditar: (id: string) => void;
  onEliminar: (id: string) => void;
}

const TransactionListGroup: React.FC<TransactionListGroupProps> = ({ mes, items, onEditar, onEliminar }) => {
  return (
    <IonList inset>
      <IonListHeader>
        <IonLabel style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{mes}</IonLabel>
      </IonListHeader>

      {items.map((t) => (
        <IonItemSliding key={t.id}>
          <TransactionRow transaction={t} />
          <IonItemOptions side="end">
            <IonItemOption color="primary" onClick={() => onEditar(t.id)}>
              <IonIcon slot="icon-only" icon={createOutline} />
            </IonItemOption>
            <IonItemOption color="danger" onClick={() => onEliminar(t.id)}>
              <IonIcon slot="icon-only" icon={trashOutline} />
            </IonItemOption>
          </IonItemOptions>
        </IonItemSliding>
      ))}
    </IonList>
  );
};

export default TransactionListGroup;