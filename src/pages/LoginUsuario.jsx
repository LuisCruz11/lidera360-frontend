import { useState } from "react";
import { loginUsuario } from "../api/usuariosApi";
import "../styles/loginUsuario.css";
import logo from "../assets/images/logo.png";

const datosIniciales = {
  username: "",
  password: "",
};

function LoginUsuario({ onVolverInicio, onLoginExito, onRegistroClick }) {
  const [formulario, setFormulario] = useState(datosIniciales);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const manejarCambio = (event) => {
    const { name, value } = event.target;

    setFormulario((datosActuales) => ({
      ...datosActuales,
      [name]: value,
    }));
  };

  const manejarEnvio = async (event) => {
    event.preventDefault();
    setMensaje("");
    setError("");
    setCargando(true);

    try {
      const respuesta = await loginUsuario(formulario);
      const usuario = respuesta.data;
      localStorage.setItem("usuario", JSON.stringify(usuario));
      localStorage.setItem("token", usuario.id_usuario);
      setMensaje("Iniciando sesión...");
      setFormulario(datosIniciales);
      setTimeout(() => {
        onLoginExito(usuario);
      }, 500);
    } catch (err) {
      const mensajeError = err.response?.data?.mensaje || "No se pudo iniciar sesión";
      setError(mensajeError);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-header">
        <img src={logo} alt="Lidera360" className="login-logo" />
        <h1>Lidera360</h1>
        <p>Portal del Participante</p>
      </section>

      <form className="login-card" onSubmit={manejarEnvio}>
        <button className="login-back" type="button" onClick={onVolverInicio}>
          Volver
        </button>

        <h2>Iniciar Sesión</h2>

        <input
          name="username"
          placeholder="Usuario"
          value={formulario.username}
          onChange={manejarCambio}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={formulario.password}
          onChange={manejarCambio}
          minLength="8"
          required
        />

        <button className="login-button" type="submit" disabled={cargando}>
          {cargando ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>

        <button className="login-secondary-button" type="button" onClick={onVolverInicio}>
          Ir a la página principal
        </button>

        <p className="login-register-text">
          ¿No tienes cuenta?{' '}
          <button className="login-register-link" type="button" onClick={onRegistroClick}>
            Regístrate aquí
          </button>
        </p>

        {mensaje && <p className="login-message success">{mensaje}</p>}
        {error && <p className="login-message error">{error}</p>}
      </form>
    </main>
  );
}

export default LoginUsuario;