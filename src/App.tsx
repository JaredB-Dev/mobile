import { useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonModal,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { home, add, time, statsChart, key, buildOutline, statsChartOutline, timeOutline, homeOutline } from 'ionicons/icons';
import Inicio from './pages/Inicio';
import Historial from './pages/Historial';
import Analiticas from './pages/Analiticas';
import NuevaTransaccion from './pages/NuevaTransaccion';
import Configuracion from './pages/Configuracion';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.class.css';

import './theme/variables.css';
import { configDefaults } from 'vitest/dist/config';
import { build } from 'vite';

setupIonicReact();

const App: React.FC = () => {
  const [showNuevaTransaccion, setShowNuevaTransaccion] = useState(false);

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/inicio">
              <Inicio />
            </Route>
            <Route exact path="/historial">
              <Historial />
            </Route>
            <Route exact path="/analiticas">
              <Analiticas />
            </Route>
            <Route exact path="/configuracion">
              <Configuracion />
            </Route>
            <Route exact path="/">
              <Redirect to="/inicio" />
            </Route>
          </IonRouterOutlet>

          <IonTabBar slot="bottom" className="custom-tab-bar">
            <IonTabButton tab="inicio" href="/inicio">
              <IonIcon aria-hidden="true" icon={homeOutline} />
              <IonLabel>Inicio</IonLabel>
            </IonTabButton>

            <IonTabButton tab="historial" href="/historial">
              <IonIcon aria-hidden="true" icon={timeOutline} />
              <IonLabel>Historial</IonLabel>
            </IonTabButton>

            {/* Espaciador para el botón flotante central */}
            <IonTabButton tab="spacer" disabled className="tab-spacer"></IonTabButton>

            <IonTabButton tab="analiticas" href="/analiticas">
              <IonIcon aria-hidden="true" icon={statsChartOutline} />
              <IonLabel>Analíticas</IonLabel>
            </IonTabButton>

            <IonTabButton tab="configuracion" href="/configuracion">
              <IonIcon aria-hidden="true" icon={buildOutline} />
              <IonLabel>Configuracion</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>

      <button className="fab-central" onClick={() => setShowNuevaTransaccion(true)} aria-label="Nueva transacción">
        <IonIcon icon={add} />
      </button>

      <IonModal isOpen={showNuevaTransaccion} onDidDismiss={() => setShowNuevaTransaccion(false)}>
        <NuevaTransaccion onClose={() => setShowNuevaTransaccion(false)} />
      </IonModal>
    </IonApp>
  );
};

export default App;