import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Navigate, Route } from 'react-router-dom';
import Home from './pages/Home';
import Geolocation from './pages/Geolocation';
import Camera from './pages/Camera';
import Motion from './pages/Motion';
import Device from './pages/Device';
import Haptics from './pages/Haptics';
import Filesystem from './pages/Filesystem';
import LocalNotifications from './pages/LocalNotifications';
import PushNotifications from './pages/PushNotifications';

// Una ruta por sensor, más la Home con los ocho botones.
export default function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route path="/" element={<Home />} />
          <Route path="/sensor/geolocation" element={<Geolocation />} />
          <Route path="/sensor/camera" element={<Camera />} />
          <Route path="/sensor/motion" element={<Motion />} />
          <Route path="/sensor/device" element={<Device />} />
          <Route path="/sensor/haptics" element={<Haptics />} />
          <Route path="/sensor/filesystem" element={<Filesystem />} />
          <Route path="/sensor/local-notifications" element={<LocalNotifications />} />
          <Route path="/sensor/push-notifications" element={<PushNotifications />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
}
