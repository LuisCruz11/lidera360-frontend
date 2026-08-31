import SelectEstado from "./SelectEstado";
import { nombreCompleto } from "./utils";

function InscripcionFormModal({ datos }) {
  const { formularios, cambiarFormulario, guardarInscripcion, cerrarModal, guardando, estados, clientes, talleres, obtenerTipo, modoModal } =
    datos;
  const valores = formularios.inscripcion;
  const editando = modoModal === "editar";

  return (
    <form className="admin-form" onSubmit={guardarInscripcion}>
      <div className="admin-form-grid">
        <label className="admin-form-full">
          Cliente
          <select
            name="cliente_cedula"
            value={valores.cliente_cedula}
            onChange={(event) => cambiarFormulario("inscripcion", event)}
            disabled={editando}
            required
          >
            <option value="">Selecciona un cliente</option>
            {clientes.map((cliente) => (
              <option value={cliente.cedula} key={cliente.cedula}>
                {nombreCompleto(cliente)} - {cliente.cedula}
              </option>
            ))}
          </select>
        </label>
        <label className="admin-form-full">
          Taller
          <select
            name="id_taller"
            value={valores.id_taller}
            onChange={(event) => cambiarFormulario("inscripcion", event)}
            disabled={editando}
            required
          >
            <option value="">Selecciona un taller</option>
            {talleres.map((taller) => (
              <option value={taller.id_taller} key={taller.id_taller}>
                {taller.nombre} - {obtenerTipo(taller.id_tipo_taller)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Estado
          <SelectEstado estados={estados} value={valores.id_estado} onChange={(event) => cambiarFormulario("inscripcion", event)} />
        </label>
        <label>
          Fecha inscripción
          <input
            name="fecha_inscripcion"
            type="date"
            value={valores.fecha_inscripcion}
            onChange={(event) => cambiarFormulario("inscripcion", event)}
            required
          />
        </label>
      </div>
      <div className="admin-form-actions">
        <button type="button" onClick={cerrarModal}>Cancelar</button>
        <button type="submit" className="admin-primary-button" disabled={guardando}>
          {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Inscribir cliente"}
        </button>
      </div>
    </form>
  );
}

export default InscripcionFormModal;
