import { normalizar } from "./utils";
import PasswordField from "../../../../components/PasswordField";
import { MENSAJE_CEDULA, MENSAJE_NOMBRE, MENSAJE_TELEFONO, PATTERN_CEDULA, PATTERN_SOLO_LETRAS, PATTERN_TELEFONO } from "../../../../utils/validaciones";

function PersonalFormModal({ datos }) {
  const { formularios, cambiarFormulario, guardarPersonal, cerrarModal, guardando, roles, modoModal } = datos;
  const valores = formularios.personal;
  const editando = modoModal === "editar";

  return (
    <form className="admin-form" onSubmit={guardarPersonal}>
      <div className="admin-form-grid">
        <label>
          Cédula
          <input
            name="cedula"
            value={valores.cedula}
            onChange={(event) => cambiarFormulario("personal", event)}
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
            onChange={(event) => cambiarFormulario("personal", event)}
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
            onChange={(event) => cambiarFormulario("personal", event)}
            pattern={PATTERN_SOLO_LETRAS}
            title={MENSAJE_NOMBRE}
            required
          />
        </label>
        <label>
          Rol
          <select name="id_rol" value={valores.id_rol} onChange={(event) => cambiarFormulario("personal", event)} required>
            <option value="">Selecciona un rol</option>
            {roles
              .filter((rol) => !normalizar(rol.nombre).includes("cliente"))
              .map((rol) => (
                <option value={rol.id_rol} key={rol.id_rol}>
                  {rol.nombre}
                </option>
              ))}
          </select>
        </label>
        <label>
          Correo
          <input name="correo" type="email" value={valores.correo} onChange={(event) => cambiarFormulario("personal", event)} required />
        </label>
        <label>
          Teléfono
          <input
            name="telefono"
            value={valores.telefono}
            onChange={(event) => cambiarFormulario("personal", event)}
            pattern={PATTERN_TELEFONO}
            title={MENSAJE_TELEFONO}
            minLength={7}
            maxLength={10}
            required
          />
        </label>
        {!editando && (
          <>
            <label>
              Usuario
              <input name="username" value={valores.username} onChange={(event) => cambiarFormulario("personal", event)} required />
            </label>
            <label>
              Contraseña
              <PasswordField
                name="password"
                value={valores.password}
                onChange={(event) => cambiarFormulario("personal", event)}
                autoComplete="new-password"
              />
            </label>
            <label className="admin-check">
              <input name="activo" type="checkbox" checked={valores.activo} onChange={(event) => cambiarFormulario("personal", event)} />
              Usuario activo
            </label>
          </>
        )}
      </div>
      {editando && <p className="admin-form-hint">El usuario y la contraseña no se modifican desde este formulario.</p>}
      <div className="admin-form-actions">
        <button type="button" onClick={cerrarModal}>Cancelar</button>
        <button type="submit" className="admin-primary-button" disabled={guardando}>
          {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Crear personal"}
        </button>
      </div>
    </form>
  );
}

export default PersonalFormModal;
