# Challenge 02 - PWA

## Enunciado (Clase 02 - PWA)

Based on the React app from the Challenge 01:

- Add one image to your parent component
- Transform it into a PWA using Hybrid Strategy
- Add a custom icon
- Deploy the PWA in Netlify
- Add the Netlify Link to the Readme.md and describe how to install the app in the cellphone

## Checklist

- [x] Imagen agregada en el componente padre
- [x] Conversion a PWA con Hybrid Strategy (manifest + service worker)
- [x] Icono personalizado
- [ ] Deploy en Netlify funcionando
- [ ] Enlace de Netlify en este README
- [x] Instrucciones de instalacion en el celular en este README

## Enlace de despliegue

<!-- Pegar aqui la URL de Netlify -->

## Que se agrego sobre el Challenge 01

- Imagen de portada en `App.jsx`, que es el componente padre.
- `public/manifest.json` con nombre, colores e iconos.
- `public/sw.js`, el service worker escrito a mano.
- Iconos propios generados con `scripts/generar-imagenes.py`.

## Estrategia hibrida

El service worker no usa una sola tecnica para todo, elige segun lo que se pide:

- **Abrir la app (navegacion)** - network first. Asi siempre se ve la version
  mas nueva, y si no hay internet responde el cache.
- **JS, CSS e imagenes** - cache first. Vite les pone un hash en el nombre,
  no cambian, conviene servirlos de una.
- **Otros dominios** - se dejan pasar. No tiene sentido guardar lo que no es mio.

Eso es lo "hibrido": network first para el HTML y cache first para los archivos.

## Como correrlo

```bash
npm install
npm run dev
```

El service worker solo se registra en produccion, para que el cache no estorbe
mientras uno trabaja. Para probar la PWA de verdad:

```bash
npm run build
npm run preview
```

## Como instalar la app en el celular

**Android (Chrome)**

1. Abrir el enlace de Netlify en Chrome.
2. Tocar el menu de los tres puntos, arriba a la derecha.
3. Elegir **Instalar aplicacion** o **Agregar a la pantalla principal**.
4. Confirmar. Queda el icono en el escritorio y abre sin la barra del navegador.

A veces Chrome muestra solo una barra abajo que dice "Instalar"; con tocarla basta.

**iPhone (Safari)**

1. Abrir el enlace en Safari. En iPhone tiene que ser Safari, en Chrome no
   aparece la opcion.
2. Tocar el boton de compartir, el cuadrito con la flecha hacia arriba.
3. Bajar y elegir **Agregar a inicio**.
4. Tocar **Agregar**.

Una vez instalada abre sin internet, porque el service worker ya guardo lo necesario.

## Notas

Parte del Challenge 01, no es un proyecto nuevo. En la planilla del curso figura como "PWA".
