import { useState } from "react";
import { cambiarPasswordUsuario } from "../../../api/usuariosApi";
import PasswordField from "../../../components/PasswordField";

const datosIniciales = {
  passwordActual: "",
  passwordNueva: "",
  passwordConfirmacion: "",
};

function CambiarPasswordForm({ idUsuario }) {
  const [formulario, setFormulario] = useState(datosIniciales);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);

  const manejarCambio = (event) => {
    const { name, value } = event.target;
    setFormulario((actuales) => ({ ...actuales, [name]: value }));
  };

  const manejarEnvio = async (event) => {
    event.preventDefault();
    setMensaje("");
    setError("");

    if (formulario.passwordNueva !== formulario.passwordConfirmacion) {
      setError("La nueva contraseña y su confirmación no coinciden.");
      return;
    }

    setGuardando(true);
    try {
      await cambiarPasswordUsuario(idUsuario, {
        password_actual: formulario.passwordActual,
        password_nueva: formulario.passwordNueva,
      });
      setMensaje("Contraseña actualizada correctamente.");
      setFormulario(datosIniciales);
    } catch (err) {
      setError(err.response?.data?.mensaje || "No se pudo actualizar la contraseña.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form className="admin-form" onSubmit={manejarEnvio}>
      <div className="admin-form-grid">
        <label>
          Contraseña actual
          <input
            name="passwordActual"
            type="password"
            value={formulario.passwordActual}
            onChange={manejarCambio}
            required
          />
        </label>
        <label>
          Nueva contraseña
          <PasswordField
            name="passwordNueva"
            value={formulario.passwordNueva}
            onChange={manejarCambio}
            autoComplete="new-password"
          />
        </label>
        <label>
          Confirmar nueva contraseña
          <input
            name="passwordConfirmacion"
            type="password"
            minLength="8"
            value={formulario.passwordConfirmacion}
            onChange={manejarCambio}
            autoComplete="new-password"
            required
          />
        </label>
      </div>
      {mensaje && <p className="admin-alert admin-alert-success">{mensaje}</p>}
      {error && <p className="admin-alert admin-alert-error">{error}</p>}
      <div className="admin-form-actions">
        <button type="submit" className="admin-primary-button" disabled={guardando}>
          {guardando ? "Guardando..." : "Actualizar contraseña"}
        </button>
      </div>
    </form>
  );
}

export default CambiarPasswordForm;
