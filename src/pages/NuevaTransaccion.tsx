import { useState, useEffect } from 'react';
import {
  IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonToast,
} from '@ionic/react';
import { close } from 'ionicons/icons';
import { getCategoriasPorTipo } from '../data/categorias';
import { TransactionService } from '../services/TransactionService';
import { useTransactionsContext } from '../context/TransactionsContext';
import { Transaction } from '../models/Transaction';
import TipoSelector from '../components/nuevaTransaccion/TipoSelector';
import TransaccionForm from '../components/nuevaTransaccion/TransaccionForm';

interface NuevaTransaccionProps {
  onClose: () => void;
}

const hoyISO = () => new Date().toISOString().split('T')[0];

const NuevaTransaccion: React.FC<NuevaTransaccionProps> = ({ onClose }) => {
  const { refresh } = useTransactionsContext();

  const [tipo, setTipo] = useState<'ingreso' | 'gasto'>('gasto');
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState<string | null>(null);
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState(hoyISO());
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const categoriasDisponibles = getCategoriasPorTipo(tipo);

  // Si cambia el tipo y la categoría elegida ya no aplica, se resetea
  useEffect(() => {
    if (categoria && !categoriasDisponibles.some((c) => c.nombre === categoria)) {
      setCategoria(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipo]);

  const handleGuardar = async () => {
    const montoNum = Number(monto);
    if (!montoNum || montoNum <= 0) {
      setError('Ingresa un monto válido');
      return;
    }
    if (!categoria) {
      setError('Selecciona una categoría');
      return;
    }

    const catInfo = categoriasDisponibles.find((c) => c.nombre === categoria);

    const nuevaTransaccion: Transaction = {
      id: crypto.randomUUID(),
      tipo,
      monto: montoNum,
      categoria,
      icono: catInfo?.icono || 'ellipsisHorizontal',
      descripcion: descripcion.trim(),
      fecha: new Date(fecha).toISOString(),
    };

    setGuardando(true);
    try {
      await TransactionService.insert(nuevaTransaccion);
      refresh();
      onClose();
    } catch (e) {
      console.error(e);
      setError('No se pudo guardar la transacción');
      setGuardando(false);
    }
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
        <TipoSelector tipo={tipo} onTipoChange={setTipo} />

        <TransaccionForm
          monto={monto}
          categoria={categoria}
          categoriasDisponibles={categoriasDisponibles}
          descripcion={descripcion}
          fecha={fecha}
          onMontoChange={setMonto}
          onCategoriaChange={setCategoria}
          onDescripcionChange={setDescripcion}
          onFechaChange={setFecha}
        />

        <IonButton expand="block" style={{ marginTop: '24px' }} onClick={handleGuardar} disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar transacción'}
        </IonButton>

        <IonToast isOpen={!!error} message={error} duration={2500} color="danger" onDidDismiss={() => setError('')} />
      </IonContent>
    </IonPage>
  );
};

export default NuevaTransaccion;