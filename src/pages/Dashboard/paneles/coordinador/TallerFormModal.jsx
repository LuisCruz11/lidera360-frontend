import SelectEstado from "./SelectEstado";
import { nombreCompleto } from "./utils";

function TallerFormModal({ datos }) {
  const { formularios, cambiarFormulario, guardarTaller, cerrarModal, guardando, estados, tiposTaller, personalPorRolNombre, modoModal } =
    datos;
  const valores = formularios.taller;
  const editando = modoModal === "editar";

  return (
    <form className="admin-form" onSubmit={guardarTaller}>
      <div className="admin-form-grid">
        <label className="admin-form-full">
          Nombre
          <input name="nombre" value={valores.nombre} onChange={(event) => cambiarFormulario("taller", event)} required />
        </label>
        <label>
          Tipo
          <select name="id_tipo_taller" value={valores.id_tipo_taller} onChange={(event) => cambiarFormulario("taller", event)} required>
            <option value="">Selecciona un tipo</option>
            {tiposTaller.map((tipo) => (
              <option value={tipo.id_tipo_taller} key={tipo.id_tipo_taller}>
                {tipo.nombre}
              </option>
            ))}
          </select>
        </label>
        <label>
          Estado
          <SelectEstado estados={estados} value={valores.id_estado} onChange={(event) => cambiarFormulario("taller", event)} />
        </label>
        <label>
          Fecha inicio
          <input
            name="fecha_inicio"
            type="date"
            value={valores.fecha_inicio}
            onChange={(event) => cambiarFormulario("taller", event)}
            required
          />
        </label>
        <label>
          Fecha fin
          <input name="fecha_fin" type="date" value={valores.fecha_fin} onChange={(event) => cambiarFormulario("taller", event)} required />
        </label>
        <label>
          Coach
          <select name="coach" value={valores.coach} onChange={(event) => cambiarFormulario("taller", event)}>
            <option value="">Selecciona un coach</option>
            {personalPorRolNombre("coach").map((persona) => (
              <option value={persona.cedula} key={`coach-${persona.cedula}`}>
                {nombreCompleto(persona)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Coordinador
          <select name="coordinador" value={valores.coordinador} onChange={(event) => cambiarFormulario("taller", event)}>
            <option value="">Selecciona un coordinador</option>
            {personalPorRolNombre("coordinador").map((persona) => (
              <option value={persona.cedula} key={`coord-${persona.cedula}`}>
                {nombreCompleto(persona)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="admin-form-actions">
        <button type="button" onClick={cerrarModal}>Cancelar</button>
        <button type="submit" className="admin-primary-button" disabled={guardando}>
          {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Crear taller"}
        </button>
      </div>
    </form>
  );
}

export default TallerFormModal;
