import { useState } from 'react';
import { IonButton, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonTextarea } from '@ionic/react';
import PanelSensor from '../components/PanelSensor';
import { Aviso, ListaDatos, Vacio } from '../components/Datos';
import useFilesystem from '../hooks/useFilesystem';
import { buscarSensor } from '../sensores';

const SENSOR = buscarSensor('filesystem');

export default function Filesystem() {
  const { soporte, carpeta, archivos, contenido, aviso, error, escribir, leer, borrar, listar } =
    useFilesystem();
  const [nombre, setNombre] = useState('nota.txt');
  const [texto, setTexto] = useState('Hola desde el Challenge 07.');

  return (
    <PanelSensor sensor={SENSOR} soporte={soporte}>
      <IonList>
        <IonItem>
          <IonInput
            label="Nombre del archivo"
            labelPlacement="stacked"
            value={nombre}
            data-testid="nombre-archivo"
            onIonInput={(evento) => setNombre(evento.detail.value ?? '')}
          />
        </IonItem>
        <IonItem>
          <IonTextarea
            label="Contenido"
            labelPlacement="stacked"
            autoGrow
            value={texto}
            data-testid="contenido-archivo"
            onIonInput={(evento) => setTexto(evento.detail.value ?? '')}
          />
        </IonItem>
      </IonList>

      <div className="acciones">
        <IonButton expand="block" data-testid="escribir-archivo" onClick={() => escribir(nombre, texto)}>
          Escribir archivo
        </IonButton>
        <IonButton expand="block" fill="outline" data-testid="listar-archivos" onClick={listar}>
          Listar carpeta
        </IonButton>
      </div>

      <ListaDatos titulo="Carpeta" datos={{ ruta: `Directory.Data/${carpeta}`, archivos: archivos.length }} testid="datos-filesystem" />

      {archivos.length ? (
        <IonList data-testid="lista-archivos">
          <IonListHeader>Archivos</IonListHeader>
          {archivos.map((archivo) => (
            <IonItem key={archivo.nombre}>
              <IonLabel>
                <h3>{archivo.nombre}</h3>
                <p>{archivo.peso}</p>
              </IonLabel>
              <IonButton
                slot="end"
                size="small"
                fill="outline"
                data-testid={`leer-${archivo.nombre}`}
                onClick={() => leer(archivo.nombre)}
              >
                Leer
              </IonButton>
              <IonButton
                slot="end"
                size="small"
                color="danger"
                fill="clear"
                data-testid={`borrar-${archivo.nombre}`}
                onClick={() => borrar(archivo.nombre)}
              >
                Borrar
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      ) : (
        <Vacio texto="La carpeta está vacía. Escribe un archivo para verlo aquí." />
      )}

      {contenido && (
        <pre className="contenido-archivo" data-testid="texto-leido">
          {contenido.texto}
        </pre>
      )}

      <Aviso texto={aviso} testid="aviso-filesystem" />
      <Aviso texto={error} tono="danger" testid="error-filesystem" />
    </PanelSensor>
  );
}
