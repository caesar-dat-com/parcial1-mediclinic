import { useState } from "react";

function ContactForm({ onAgregar }) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (nombre.trim() === "" || telefono.trim() === "") {
      setError("Escribe el nombre y el telefono");
      return;
    }

    onAgregar(nombre.trim(), telefono.trim());
    setNombre("");
    setTelefono("");
    setError("");
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        type="tel"
        placeholder="Telefono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
      />
      <button type="submit">Agregar</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}

export default ContactForm;
