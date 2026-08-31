function SelectEstado({ estados, value, onChange }) {
  return (
    <select name="id_estado" value={value} onChange={onChange} required>
      <option value="">Selecciona un estado</option>
      {estados.map((estado) => (
        <option value={estado.id_estado} key={estado.id_estado}>
          {estado.nombre}
        </option>
      ))}
    </select>
  );
}

export default SelectEstado;
