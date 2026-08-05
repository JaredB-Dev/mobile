import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon } from '@ionic/react';
import { close } from 'ionicons/icons';

interface NuevaTransaccionProps {
  onClose: () => void;
}

const NuevaTransaccion: React.FC<NuevaTransaccionProps> = ({ onClose }) => {
  const handleGuardar = () => {
    // Aquí luego irá la lógica de guardar en SQLite
    console.log('Transacción guardada');
    onClose(); // cierra el modal y vuelve a donde estaba el usuario
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Nueva Transacción</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <p>Aquí irá el formulario para registrar ingresos y gastos.</p>
        <IonButton expand="block" onClick={handleGuardar}>
          Guardar transacción
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default NuevaTransaccion;