import { IonCard, IonCardHeader, IonCardTitle, IonList } from '@ionic/react';
import { Transaction } from '../../models/Transaction';
import TransactionRow from '../shared/TransactionRow';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle style={{ fontSize: '1rem' }}>Transacciones recientes</IonCardTitle>
      </IonCardHeader>
      <IonList lines="full">
        {transactions.map((t) => (
          <TransactionRow key={t.id} transaction={t} />
        ))}
      </IonList>
    </IonCard>
  );
};

export default RecentTransactions;