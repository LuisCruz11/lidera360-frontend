import { useState } from "react";
import { restablecerPassword } from "../api/usuariosApi";
import PasswordField from "../components/PasswordField";
import "../styles/loginUsuario.css";
import logo from "../assets/images/logo.png";

function RestablecerPassword({ token, onIrLogin, onSolicitarOtro }) {
  const [formulario, setFormulario] = useState({ passwordNueva: "", passwordConfirmacion: "" });
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [listo, setListo] = useState(false);

  const manejarCambio = (event) => {
    const { name, value } = event.target;
    setFormulario((actuales) => ({ ...actuales, [name]: value }));
  };

  const manejarEnvio = async (event) => {
    event.preventDefault();
    setError("");

    if (formulario.passwordNueva !== formulario.passwordConfirmacion) {
      setError("La nueva contraseña y su confirmación no coinciden.");
      return;
    }

    setGuardando(true);
    try {
      await restablecerPassword(token, formulario.passwordNueva);
      setListo(true);
    } catch (err) {
      setError(err.response?.data?.mensaje || "No se pudo restablecer la contraseña.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-header">
        <img src={logo} alt="Lidera360" className="login-logo" />
        <h1>Lidera360</h1>
        <p>Portal del Participante</p>
      </section>

      {listo ? (
        <section className="login-card">
          <h2>Contraseña actualizada</h2>
          <p className="login-message success">Tu contraseña se restableció correctamente.</p>
          <button className="login-button" type="button" onClick={onIrLogin}>
            Iniciar sesión
          </button>
        </section>
      ) : (
        <form className="login-card" onSubmit={manejarEnvio}>
          <h2>Crear nueva contraseña</h2>

          <label className="login-label">
            Nueva contraseña
            <PasswordField
              name="passwordNueva"
              value={formulario.passwordNueva}
              onChange={manejarCambio}
              autoComplete="new-password"
            />
          </label>

          <label className="login-label">
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

          <button className="login-button" type="submit" disabled={guardando}>
            {guardando ? "Guardando..." : "Restablecer contraseña"}
          </button>

          {error && (
            <>
              <p className="login-message error">{error}</p>
              <button className="login-secondary-button" type="button" onClick={onSolicitarOtro}>
                Solicitar un nuevo enlace
              </button>
            </>
          )}
        </form>
      )}
    </main>
  );
}

export default RestablecerPassword;
