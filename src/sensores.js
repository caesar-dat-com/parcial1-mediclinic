// Catálogo de los ocho sensores vistos en la Clase 08 (Sensors).
// Lo usan la Home para pintar un botón por sensor, las rutas y las pruebas.
// A propósito no importa iconos aquí para que las pruebas de Playwright
// puedan leer este archivo sin arrastrar dependencias del navegador.

export const SENSORES = [
  {
    slug: 'geolocation',
    titulo: 'Geolocation',
    plugin: '@capacitor/geolocation',
    hook: 'useGeolocation',
    resumen: 'Posición actual del dispositivo y seguimiento de los cambios.',
  },
  {
    slug: 'camera',
    titulo: 'Camera',
    plugin: '@capacitor/camera',
    hook: 'useCamera',
    resumen: 'Tomar una foto con la cámara o elegir una imagen de la galería.',
  },
  {
    slug: 'motion',
    titulo: 'Motion',
    plugin: '@capacitor/motion',
    hook: 'useMotion',
    resumen: 'Acelerómetro y orientación con los eventos accel y orientation.',
  },
  {
    slug: 'device',
    titulo: 'Device',
    plugin: '@capacitor/device',
    hook: 'useDevice',
    resumen: 'Información del equipo, identificador, idioma y batería.',
  },
  {
    slug: 'haptics',
    titulo: 'Haptics',
    plugin: '@capacitor/haptics',
    hook: 'useHaptics',
    resumen: 'Vibración, impacto, notificación y selección.',
  },
  {
    slug: 'filesystem',
    titulo: 'Filesystem',
    plugin: '@capacitor/filesystem',
    hook: 'useFilesystem',
    resumen: 'Escribir, leer, listar y borrar archivos en el dispositivo.',
  },
  {
    slug: 'local-notifications',
    titulo: 'Local Notifications',
    plugin: '@capacitor/local-notifications',
    hook: 'useLocalNotifications',
    resumen: 'Programar y cancelar notificaciones locales.',
  },
  {
    slug: 'push-notifications',
    titulo: 'Push Notifications',
    plugin: '@capacitor/push-notifications',
    hook: 'usePushNotifications',
    resumen: 'Registro del dispositivo y manejo de notificaciones push.',
  },
];

export const RUTAS = SENSORES.map((sensor) => `/sensor/${sensor.slug}`);

export function buscarSensor(slug) {
  return SENSORES.find((sensor) => sensor.slug === slug);
}
