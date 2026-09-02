import SelectEstado from "./SelectEstado";
import PasswordField from "../../../../components/PasswordField";
import { MENSAJE_CEDULA, MENSAJE_NOMBRE, MENSAJE_TELEFONO, PATTERN_CEDULA, PATTERN_SOLO_LETRAS, PATTERN_TELEFONO } from "../../../../utils/validaciones";

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
            pattern={PATTERN_CEDULA}
            title={MENSAJE_CEDULA}
            minLength={6}
            maxLength={10}
            required
          />
        </label>
        <label>
          Nombres
          <input
            name="nombres"
            value={valores.nombres}
            onChange={(event) => cambiarFormulario("cliente", event)}
            pattern={PATTERN_SOLO_LETRAS}
            title={MENSAJE_NOMBRE}
            required
          />
        </label>
        <label>
          Apellidos
          <input
            name="apellidos"
            value={valores.apellidos}
            onChange={(event) => cambiarFormulario("cliente", event)}
            pattern={PATTERN_SOLO_LETRAS}
            title={MENSAJE_NOMBRE}
            required
          />
        </label>
        <label>
          Correo
          <input name="correo" type="email" value={valores.correo} onChange={(event) => cambiarFormulario("cliente", event)} />
        </label>
        <label>
          Teléfono
          <input
            name="telefono"
            value={valores.telefono}
            onChange={(event) => cambiarFormulario("cliente", event)}
            pattern={PATTERN_TELEFONO}
            title={MENSAJE_TELEFONO}
            minLength={7}
            maxLength={10}
          />
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
          <input
            name="edad"
            type="number"
            min="1"
            max="120"
            value={valores.edad}
            onChange={(event) => cambiarFormulario("cliente", event)}
            required
          />
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
        {!editando && (
          <>
            <label>
              Usuario
              <input name="username" value={valores.username} onChange={(event) => cambiarFormulario("cliente", event)} required />
            </label>
            <label>
              Contraseña
              <PasswordField
                name="password"
                value={valores.password}
                onChange={(event) => cambiarFormulario("cliente", event)}
                autoComplete="new-password"
              />
            </label>
          </>
        )}
      </div>
      {editando && <p className="admin-form-hint">El usuario y la contraseña no se modifican desde este formulario.</p>}
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
