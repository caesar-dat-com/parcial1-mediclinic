# Challenge 01 - Repaso React

## Enunciado (Clase 01 - Refuerzo React)

Build a React app that allows you to list, add, and delete contacts, simulating initial
data loading, using the basic concepts that will later be used in Ionic.

The app must:

- Display a loader on startup
- Load an initial contact list
- Allow users to add contacts with name and phone
- Allow users to delete contacts
- Divide the app into components

## Checklist

- [x] Loader visible mientras "cargan" los datos iniciales
- [x] Lista de contactos precargada
- [x] Formulario para agregar contacto (nombre + telefono)
- [x] Boton/accion para eliminar contacto
- [x] App dividida en componentes (no todo en App.jsx)

## Como correrlo

```bash
npm install
npm run dev
```

## Estructura

```
src/
  App.jsx                    estado de contactos y carga inicial
  components/
    Loader.jsx               spinner mientras carga
    ContactForm.jsx          formulario de nombre + telefono
    ContactList.jsx          recorre la lista
    ContactItem.jsx          un contacto y su boton eliminar
  data/
    contactos.js             datos precargados
```

La carga inicial se simula con un `setTimeout` de 1.5s dentro de un `useEffect`,
para imitar una peticion a un servidor.

## Notas

Esta rama corresponde al Challenge 1 del Corte 1, registrado en la planilla del curso
como "Repaso React".
