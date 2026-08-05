import { IonToolbar, IonSearchbar, IonButtons, IonButton, IonIcon, IonBadge } from '@ionic/react';
import { filterOutline } from 'ionicons/icons';

interface SearchToolbarProps {
  busqueda: string;
  onBusquedaChange: (valor: string) => void;
  filtrosActivos: number;
  onAbrirFiltros: () => void;
}

const SearchToolbar: React.FC<SearchToolbarProps> = ({
  busqueda,
  onBusquedaChange,
  filtrosActivos,
  onAbrirFiltros,
}) => {
  return (
    <IonToolbar>
      <IonSearchbar
        value={busqueda}
        onIonInput={(e) => onBusquedaChange(e.detail.value ?? '')}
        placeholder="Buscar por descripción o categoría"
        debounce={300}
      />
      <IonButtons slot="end" style={{ marginRight: '8px' }}>
        <IonButton onClick={onAbrirFiltros}>
          <IonIcon slot="icon-only" icon={filterOutline} />
          {filtrosActivos > 0 && (
            <IonBadge color="danger" style={{ position: 'absolute', top: 0, right: 0, fontSize: '0.6rem' }}>
              {filtrosActivos}
            </IonBadge>
          )}
        </IonButton>
      </IonButtons>
    </IonToolbar>
  );
};

export default SearchToolbar;