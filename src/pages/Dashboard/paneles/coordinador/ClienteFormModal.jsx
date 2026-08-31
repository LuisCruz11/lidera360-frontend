import SelectEstado from "./SelectEstado";

function ClienteFormModal({ datos }) {
  const { formularios, cambiarFormulario, guardarCliente, cerrarModal, guardando, estados, tiposTaller, modoModal } = datos;
  const valores = formularios.cliente;
  const editando = modoModal === "editar";

  return (
    <form className="admin-form" onSubmit={guardarCliente}>
      <div className="admin-form-grid">
        <label>
          Cédula
          <input
            name="cedula"
            value={valores.cedula}
            onChange={(event) => cambiarFormulario("cliente", event)}
            disabled={editando}
            required
          />
        </label>
        <label>
          Nombres
          <input name="nombres" value={valores.nombres} onChange={(event) => cambiarFormulario("cliente", event)} required />
        </label>
        <label>
          Apellidos
          <input name="apellidos" value={valores.apellidos} onChange={(event) => cambiarFormulario("cliente", event)} required />
        </label>
        <label>
          Correo
          <input name="correo" type="email" value={valores.correo} onChange={(event) => cambiarFormulario("cliente", event)} />
        </label>
        <label>
          Teléfono
          <input name="telefono" value={valores.telefono} onChange={(event) => cambiarFormulario("cliente", event)} />
        </label>
        <label>
          Sexo
          <select name="sexo" value={valores.sexo} onChange={(event) => cambiarFormulario("cliente", event)} required>
            <option value="M">M</option>
            <option value="F">F</option>
            <option value="Otro">Otro</option>
          </select>
        </label>
        <label>
          Edad
          <input name="edad" type="number" min="1" value={valores.edad} onChange={(event) => cambiarFormulario("cliente", event)} required />
        </label>
        <label>
          Estado
          <SelectEstado estados={estados} value={valores.id_estado} onChange={(event) => cambiarFormulario("cliente", event)} />
        </label>
        <label>
          Nivel
          <select
            name="id_tipo_taller"
            value={valores.id_tipo_taller}
            onChange={(event) => cambiarFormulario("cliente", event)}
            required
          >
            <option value="">Selecciona un nivel</option>
            {tiposTaller.map((tipo) => (
              <option value={tipo.id_tipo_taller} key={tipo.id_tipo_taller}>
                {tipo.nombre}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="admin-form-actions">
        <button type="button" onClick={cerrarModal}>Cancelar</button>
        <button type="submit" className="admin-primary-button" disabled={guardando}>
          {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Crear cliente"}
        </button>
      </div>
    </form>
  );
}

export default ClienteFormModal;
