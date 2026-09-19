function ContactItem({ contacto, onEliminar }) {
  return (
    <li className="item">
      <div>
        <strong>{contacto.nombre}</strong>
        <span>{contacto.telefono}</span>
      </div>
      <button onClick={() => onEliminar(contacto.id)}>Eliminar</button>
    </li>
  );
}

export default ContactItem;
