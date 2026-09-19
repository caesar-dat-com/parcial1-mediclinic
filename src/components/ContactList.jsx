import ContactItem from "./ContactItem";

function ContactList({ contactos, onEliminar }) {
  if (contactos.length === 0) {
    return <p className="vacio">No hay contactos todavia.</p>;
  }

  return (
    <ul className="lista">
      {contactos.map((contacto) => (
        <ContactItem
          key={contacto.id}
          contacto={contacto}
          onEliminar={onEliminar}
        />
      ))}
    </ul>
  );
}

export default ContactList;
