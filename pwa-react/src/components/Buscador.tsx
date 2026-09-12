interface Props {
  texto: string;
  onBuscar: (texto: string) => void;
}

function Buscador({ texto, onBuscar }: Props) {
  return (
    <input
      className="buscador"
      type="search"
      value={texto}
      placeholder="Buscar por nombre, apellido o CC"
      onChange={(e) => onBuscar(e.target.value)}
    />
  );
}

export default Buscador;
