import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonFab,
  IonFabButton,
  IonIcon,
} from '@ionic/react';
import { add } from 'ionicons/icons';
import TrendChart from '../components/inicio/TrendChart';
import RecentTransactions from '../components/inicio/RecentTransactions';
import { Transaction } from '../models/Transaction';

// --- MOCK DATA: reemplazar luego por datos reales de SQLite ---
const mockTrendData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    fecha: date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
    ingresos: Math.round(Math.random() * 100),
    gastos: Math.round(Math.random() * 80),
  };
});

const mockRecentTransactions: Transaction[] = [
  { id: '1', tipo: 'gasto', monto: 45.5, categoria: 'Comida', icono: 'restaurant', descripcion: 'Almuerzo', fecha: new Date().toISOString() },
  { id: '2', tipo: 'ingreso', monto: 500, categoria: 'Salario', icono: 'cash', descripcion: 'Pago quincenal', fecha: new Date().toISOString() },
  { id: '3', tipo: 'gasto', monto: 12.0, categoria: 'Transporte', icono: 'bus', descripcion: 'Bus', fecha: new Date().toISOString() },
  { id: '4', tipo: 'gasto', monto: 89.99, categoria: 'Compras', icono: 'bag', descripcion: 'Ropa', fecha: new Date().toISOString() },
  { id: '5', tipo: 'ingreso', monto: 25, categoria: 'Extra', icono: 'gift', descripcion: 'Venta reciclaje', fecha: new Date().toISOString() },
];

const Inicio: React.FC = () => {
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
                  <h1 style={{ margin: 0, fontWeight: 'bold' }}>$0.00</h1>
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
                  <h2 style={{ margin: 0, fontWeight: 'bold' }}>$0.00</h2>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="6">
              <IonCard color="danger">
                <IonCardHeader>
                  <IonCardTitle style={{ fontSize: '1rem' }}>Gastos del mes</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <h2 style={{ margin: 0, fontWeight: 'bold' }}>$0.00</h2>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        <TrendChart data={mockTrendData} />
        <RecentTransactions transactions={mockRecentTransactions} />

        <div style={{ height: '24px' }}></div>
      </IonContent>
    </IonPage>
  );
};

export default Inicio;