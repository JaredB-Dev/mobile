import { useState, useEffect } from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonCol,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
} from '@ionic/react';
import TrendChart from '../components/inicio/TrendChart';
import RecentTransactions from '../components/inicio/RecentTransactions';
import { Transaction } from '../models/Transaction';
import { TransactionService } from '../services/TransactionService';
import { useTransactionsContext } from '../context/TransactionsContext';

const Inicio: React.FC = () => {
  const { version } = useTransactionsContext();
  const [resumen, setResumen] = useState({ balance: 0, ingresos: 0, gastos: 0 });
  const [trendData, setTrendData] = useState<{ fecha: string; ingresos: number; gastos: number }[]>([]);
  const [recientes, setRecientes] = useState<Transaction[]>([]);

  useEffect(() => {
    const cargar = async () => {
      const [resumenData, tendencia, ultimas] = await Promise.all([
        TransactionService.getResumen(),
        TransactionService.getTendencia(30),
        TransactionService.getRecent(5),
      ]);
      setResumen(resumenData);
      setTrendData(tendencia);
      setRecientes(ultimas);
    };
    cargar();
  }, [version]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Balanze</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Inicio</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonGrid>
          <IonRow>
            <IonCol size="12">
              <IonCard color="primary">
                <IonCardHeader>
                  <IonCardTitle>Balance Total</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <h1 style={{ margin: 0, fontWeight: 'bold' }}>${resumen.balance.toFixed(2)}</h1>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="6">
              <IonCard color="success">
                <IonCardHeader>
                  <IonCardTitle style={{ fontSize: '1rem' }}>Ingresos del mes</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <h2 style={{ margin: 0, fontWeight: 'bold' }}>${resumen.ingresos.toFixed(2)}</h2>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="6">
              <IonCard color="danger">
                <IonCardHeader>
                  <IonCardTitle style={{ fontSize: '1rem' }}>Gastos del mes</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <h2 style={{ margin: 0, fontWeight: 'bold' }}>${resumen.gastos.toFixed(2)}</h2>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        <TrendChart data={trendData} />
        <RecentTransactions transactions={recientes} />

        <div style={{ height: '24px' }}></div>
      </IonContent>
    </IonPage>
  );
};

export default Inicio;