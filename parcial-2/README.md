# Parcial 2 — Plataformas Móviles

App en Ionic + React (Vite, TypeScript) que recoge lo visto en el segundo
corte: sensores del equipo, almacenamiento local, mapas, consumo de APIs y
base de datos en la nube.

La navegación se hace con un `IonSegment` en la cabecera, así que todo corre en
una sola pantalla y se puede ver cada parte sin cambiar de ruta.

## Cómo correrla

```bash
npm install
npm run dev
```

Para la parte de Supabase hay que copiar `.env.example` a `.env` y poner las
dos llaves del proyecto. Si no están, la app sigue funcionando: la pestaña
*Nube* avisa que falta configurarla y el resto trabaja con la base local.

## Qué hay en cada pestaña

- **Sensores**: ubicación por GPS, cámara (foto o galería), acelerómetro en
  vivo, datos del equipo con nivel de batería, vibración y una notificación
  local de prueba.
- **Local**: formulario que guarda registros en IndexedDB con Dexie. Funciona
  sin internet y marca cuántos quedan pendientes por subir.
- **Mapa**: mapa de Leaflet centrado en la posición actual, con seguimiento
  continuo. Si no hay permiso de ubicación muestra Cali por defecto.
- **API**: peticiones GET, POST, PUT y DELETE con axios contra una API pública.
- **Nube**: tabla de Supabase con lectura, escritura y borrado, suscrita a
  cambios en tiempo real, más un botón que sube a la nube lo que se guardó
  localmente.

## Organización del código

Cada capacidad del dispositivo está en su propio hook dentro de `src/hooks/`,
y las pantallas en `src/vistas/` solo se encargan de mostrar la información:

| Hook | Para qué sirve |
| --- | --- |
| `useNetwork` | si hay conexión y de qué tipo |
| `useGeolocation` | posición actual y seguimiento continuo |
| `useCamera` | tomar foto o escogerla de la galería |
| `useMotion` | acelerómetro y orientación |
| `useDevice` | datos del equipo y batería |
| `useHaptics` | vibración y respuesta táctil |
| `useLocalNotifications` | permisos y envío de notificaciones locales |
| `useRegistrosLocales` | CRUD sobre IndexedDB con Dexie |
| `useSupabaseTabla` | CRUD y tiempo real sobre una tabla de Supabase |
| `useApi` | peticiones HTTP con axios |

En `src/lib/` está la base local (`db.ts`) y el cliente de Supabase
(`supabase.ts`), que se crea una sola vez para toda la app.

## Detalles de implementación

- Los iconos de Leaflet se cargan por URL: con Vite no se resuelven las rutas
  relativas que trae la librería por defecto y los marcadores salen rotos.
- `useSupabaseTabla` se suscribe al canal de Realtime y vuelve a consultar
  cuando llega un cambio, así la lista se actualiza sola.
- En Dexie el campo `sincronizado` es un número (0 o 1) porque IndexedDB no
  indexa booleanos.

## Capturas

Están en `capturas/`, tomadas en tamaño de celular.
