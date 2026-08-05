import { IonItem, IonInput, IonSelect, IonSelectOption, IonTextarea } from '@ionic/react';
import { Categoria } from '../../data/categorias';

interface TransaccionFormProps {
  monto: string;
  categoria: string | null;
  categoriasDisponibles: Categoria[];
  descripcion: string;
  fecha: string;
  onMontoChange: (valor: string) => void;
  onCategoriaChange: (valor: string) => void;
  onDescripcionChange: (valor: string) => void;
  onFechaChange: (valor: string) => void;
}

const TransaccionForm: React.FC<TransaccionFormProps> = ({
  monto, categoria, categoriasDisponibles, descripcion, fecha,
  onMontoChange, onCategoriaChange, onDescripcionChange, onFechaChange,
}) => {
  return (
    <>
      <IonItem style={{ marginTop: '16px' }}>
        <IonInput
          label="Monto"
          labelPlacement="stacked"
          type="number"
          placeholder="0.00"
          value={monto}
          onIonInput={(e) => onMontoChange(e.detail.value ?? '')}
        />
      </IonItem>

      <IonItem>
        <IonSelect
          label="Categoría"
          labelPlacement="stacked"
          placeholder="Selecciona una categoría"
          value={categoria}
          onIonChange={(e) => onCategoriaChange(e.detail.value)}
        >
          {categoriasDisponibles.map((c) => (
            <IonSelectOption key={c.nombre} value={c.nombre}>
              {c.nombre}
            </IonSelectOption>
          ))}
        </IonSelect>
      </IonItem>

      <IonItem>
        <IonTextarea
          label="Descripción (opcional)"
          labelPlacement="stacked"
          placeholder="Ej. Almuerzo con amigos"
          value={descripcion}
          onIonInput={(e) => onDescripcionChange(e.detail.value ?? '')}
          autoGrow
        />
      </IonItem>

      <IonItem lines="none">
        <IonInput
          label="Fecha"
          labelPlacement="stacked"
          type="date"
          value={fecha}
          onIonInput={(e) => onFechaChange(e.detail.value ?? fecha)}
        />
      </IonItem>
    </>
  );
};

export default TransaccionForm;