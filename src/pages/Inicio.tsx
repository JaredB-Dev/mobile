import { useState, useEffect } from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonGrid, IonRow, IonCol,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonIcon,
} from '@ionic/react';
import { arrowUpCircle, arrowDownCircle } from 'ionicons/icons';
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
              {/* Tarjeta principal: único color llamativo (acento de marca) */}
              <IonCard color="primary">
                <IonCardHeader>
                  <IonCardTitle style={{ fontSize: '0.95rem', fontWeight: 500, opacity: 0.9 }}>
                    Balance Total
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <h1 style={{ margin: 0, fontWeight: 700, fontSize: '2.1rem' }}>
                    ${resumen.balance.toFixed(2)}
                  </h1>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="6">
              {/* Tarjetas neutras: el color queda para el icono y el monto (ingreso/gasto) */}
              <IonCard>
                <IonCardContent style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <IonIcon icon={arrowUpCircle} color="success" style={{ fontSize: '1.1rem' }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--ion-color-medium)' }}>Ingresos</span>
                  </div>
                  <h2 style={{ margin: 0, fontWeight: 700, color: 'var(--ion-color-success)' }}>
                    ${resumen.ingresos.toFixed(2)}
                  </h2>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="6">
              <IonCard>
                <IonCardContent style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <IonIcon icon={arrowDownCircle} color="danger" style={{ fontSize: '1.1rem' }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--ion-color-medium)' }}>Gastos</span>
                  </div>
                  <h2 style={{ margin: 0, fontWeight: 700, color: 'var(--ion-color-danger)' }}>
                    ${resumen.gastos.toFixed(2)}
                  </h2>
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