# Parcial 2 — App de misiones

César Reyes · Plataformas Móviles

App en Ionic + React donde el usuario se registra, desbloquea misiones usando
los sensores del celular y gana puntos. Cada misión tiene lógica real: no hay
botones que simplemente marquen "completado".

## Cómo correrla

```bash
npm install
npm run dev
```

Para usar Firebase hay que copiar `.env.example` a `.env` y poner las llaves del
proyecto. **Si no están, la app funciona igual**: las cuentas y el progreso se
guardan en el dispositivo y la pantalla de resultados indica que el guardado es
solo local. Se hizo así para que la app sea revisable sin credenciales.

## Usuarios

Registro e inicio de sesión con correo y contraseña. Con Firebase configurado usa
Firebase Auth; sin él, cuentas locales con la misma interfaz (`useAuth` resuelve
cuál usar). El progreso queda atado a la cuenta: al volver a entrar, los puntos
siguen ahí.

## Las tres misiones

| # | Misión | Cómo se completa | Puntos |
| --- | --- | --- | --- |
| 1 | Evidencia | Tomar una foto con la cámara; se completa al guardar la imagen | 40 |
| 2 | Movimiento real | Alejarse más de 30 m del punto de partida, medido por GPS | 40 |
| 3 | Permanencia activa | Se habilita al terminar la 2. Quedarse quieto 10 s; al cumplirlos el celular vibra | 40 |

La distancia se calcula con la fórmula de haversine entre la posición inicial y
la actual (`useDistancia`), tomando el máximo alcanzado para que la misión no se
"descomplete" al devolverse.

La quietud se mide con el acelerómetro (`useQuieto`): se compara la magnitud de
la aceleración contra la gravedad y, si el usuario se mueve, el contador vuelve
a cero. La pantalla no se bloquea en ningún momento.

## Puntos, progreso y resultados

- Cada misión suma 40 puntos y se muestra el total acumulado.
- Barra de progreso con el porcentaje y el conteo de misiones completadas.
- Pantalla de resultados con puntos totales, misiones hechas, estado general y
  el JSON tal como queda guardado.

## Notificaciones locales

Al completar una misión se dispara *"Has completado una misión"*. Cuando queda
una sola pendiente se envía además *"Te falta 1 misión para completar"*.

## Ranking

Top 5 por puntaje, con el usuario marcado y su posición frente a los demás. Con
Firestore configurado se consulta la colección `progresos` ordenada por puntos;
sin él, se compara contra los jugadores guardados en el dispositivo.

## Persistencia

Se guarda en Firestore y en el almacenamiento local al mismo tiempo, con el
formato que pide el enunciado:

```json
{
  "points": 120,
  "missions": [
    { "id": 1, "completed": true }
  ]
}
```

Al abrir la app se carga primero lo local (instantáneo) y luego se reemplaza con
lo de la nube si responde.

## Organización

Una capacidad por hook, en `src/hooks/`:

| Hook | Para qué |
| --- | --- |
| `useAuth` | registro, inicio y cierre de sesión |
| `useMisiones` | estado de misiones, puntos, progreso y guardado |
| `useDistancia` | distancia recorrida desde el punto inicial |
| `useQuieto` | segundos sin moverse, por acelerómetro |
| `useRanking` | top 5 y posición del usuario |
| `useCamera` | foto con la cámara o la galería |
| `useGeolocation` | posición actual y seguimiento continuo |
| `useMotion` | acelerómetro y orientación |
| `useHaptics` | vibración |
| `useLocalNotifications` | permisos y envío de notificaciones |
| `useNetwork` | si hay conexión |
| `useDevice` | datos del equipo y batería |

En `src/lib/` están el arranque de Firebase (`firebase.ts`) y la persistencia
local (`almacen.ts`). Las pantallas en `src/vistas/` solo muestran información:
toda la lógica vive en los hooks.

## Capturas

En `capturas/`, tomadas en tamaño de celular (390×844):

1. `01-login` — pantalla de entrada
2. `02-registro` — creación de cuenta
3. `03-misiones-inicio` — las tres misiones pendientes, 0 puntos
4. `04-mision2-movimiento` — 222 m recorridos, misión 2 completada, 33 %
5. `05-mision3-contando` — conteo de los 10 segundos en curso
6. `06-mision3-completada` — misión 3 cumplida
7. `07-resultados` — 80 puntos, 2 de 3, con el JSON guardado
8. `08-ranking` — top 5 con el usuario ubicado

Las capturas se tomaron en navegador con la ubicación simulada para poder
recorrer los metros de la misión 2. La misión 1 queda pendiente en ellas porque
la cámara no se puede accionar desde un navegador sin dispositivo; en el celular
se completa al tomar la foto.
