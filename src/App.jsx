import { useState, useEffect } from "react";
import Loader from "./components/Loader";
import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactList";
import { contactosIniciales } from "./data/contactos";
import portada from "./assets/contactos.png";
import "./App.css";

function App() {
  const [contactos, setContactos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // simulo la carga inicial de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setContactos(contactosIniciales);
      setCargando(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  function agregarContacto(nombre, telefono) {
    const nuevo = { id: Date.now(), nombre, telefono };
    setContactos([...contactos, nuevo]);
  }

  function eliminarContacto(id) {
    setContactos(contactos.filter((c) => c.id !== id));
  }

  return (
    <div className="app">
      <img className="portada" src={portada} alt="Tres contactos" />
      <h1>Contactos</h1>

      {cargando ? (
        <Loader />
      ) : (
        <>
          <ContactForm onAgregar={agregarContacto} />
          <ContactList contactos={contactos} onEliminar={eliminarContacto} />
        </>
      )}
    </div>
  );
}

export default App;
