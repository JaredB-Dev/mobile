import { useRef, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonToggle,
  IonIcon,
  IonListHeader,
  IonAlert,
  IonToast,
  IonButton,
} from '@ionic/react';
import {
  moonOutline,
  trashOutline,
  cloudUploadOutline,
  documentTextOutline,
} from 'ionicons/icons';
import { useTheme } from '../hooks/useTheme';
import Papa, { ParseResult } from 'papaparse';
import { CsvTransaction } from '../models/CSVTransactions';
import { useTransactionsContext } from '../context/TransactionsContext';
import { TransactionService } from '../services/TransactionService';
import { parsearTransacciones } from '../utils/csvImport';

const Configuracion: React.FC = () => {
  const { refresh } = useTransactionsContext();
  const { isDark, toggleTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showConfirmBorrar, setShowConfirmBorrar] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; mensaje: string; color: string }>({
    show: false,
    mensaje: '',
    color: 'success',
  });

  const mostrarToast = (mensaje: string, color: 'success' | 'danger' = 'success') => {
    setToast({ show: true, mensaje, color });
  };

  const handleBorrarDatos = async () => {
    await TransactionService.deleteAll();
    setShowConfirmBorrar(false);
    refresh();
    mostrarToast('Todos los datos fueron eliminados', 'success');
  };

  // --- Importar CSV ---
  const handleSeleccionarArchivo = () => {
    fileInputRef.current?.click();
  };

  const handleArchivoSeleccionado = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;

    Papa.parse<CsvTransaction>(archivo, {
      header: true,
      skipEmptyLines: true,
      complete: async (resultado: ParseResult<CsvTransaction>) => {
        try {
          const transacciones = parsearTransacciones(resultado.data);
          await TransactionService.insertMany(transacciones);
          refresh();
          mostrarToast(`${transacciones.length} transacciones importadas correctamente`, 'success');
        } catch {
          mostrarToast('El archivo no tiene el formato esperado', 'danger');
        }
      },
      error: () => mostrarToast('No se pudo leer el archivo', 'danger'),
    });

    e.target.value = '';
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Configuración</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList inset>
          <IonListHeader>
            <IonLabel>Apariencia</IonLabel>
          </IonListHeader>
          <IonItem>
            <IonIcon icon={moonOutline} slot="start" />
            <IonLabel>Tema oscuro</IonLabel>
            <IonToggle checked={isDark} onIonChange={(e) => toggleTheme(e.detail.checked)} />
          </IonItem>
        </IonList>

        <IonList inset>
          <IonListHeader>
            <IonLabel>Datos</IonLabel>
          </IonListHeader>

          <IonItem button detail={false} onClick={handleSeleccionarArchivo}>
            <IonIcon icon={cloudUploadOutline} slot="start" color="primary" />
            <IonLabel>Importar datos desde CSV</IonLabel>
          </IonItem>

          <IonItem button detail={false} onClick={() => setShowConfirmBorrar(true)}>
            <IonIcon icon={trashOutline} slot="start" color="danger" />
            <IonLabel color="danger">Borrar todos los datos</IonLabel>
          </IonItem>
        </IonList>

        {/* Input de archivo oculto, se activa por código */}
        <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv,text/comma-separated-values,application/csv,text/plain"
            style={{ display: 'none' }}
            onChange={handleArchivoSeleccionado}
        />

        <div style={{ padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <IonIcon icon={documentTextOutline} color="medium" style={{ marginTop: '2px' }} />
          <p style={{ fontSize: '0.8rem', color: 'var(--ion-color-medium)', margin: 0 }}>
            El archivo CSV debe tener las columnas: <strong>tipo, monto, categoria, descripcion, fecha</strong>.
            Ejemplo: <code>gasto,45.50,Comida,Almuerzo,2026-08-01</code>
          </p>
        </div>
      </IonContent>

      <IonAlert
        isOpen={showConfirmBorrar}
        onDidDismiss={() => setShowConfirmBorrar(false)}
        header="¿Borrar todos los datos?"
        message="Esta acción eliminará permanentemente todas tus transacciones. No se puede deshacer."
        buttons={[
          { text: 'Cancelar', role: 'cancel' },
          { text: 'Borrar todo', role: 'destructive', handler: handleBorrarDatos },
        ]}
      />

      <IonToast
        isOpen={toast.show}
        onDidDismiss={() => setToast((t) => ({ ...t, show: false }))}
        message={toast.mensaje}
        duration={2500}
        color={toast.color}
        position="bottom"
      />
    </IonPage>
  );
};

export default Configuracion;