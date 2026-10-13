import { useState } from "react";
import { solicitarRecuperacionPassword } from "../api/usuariosApi";
import "../styles/loginUsuario.css";
import logo from "../assets/images/logo.png";

function RecuperarPassword({ onVolverLogin }) {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const manejarEnvio = async (event) => {
    event.preventDefault();
    setMensaje("");
    setError("");
    setEnviando(true);
    try {
      const respuesta = await solicitarRecuperacionPassword(correo.trim());
      setMensaje(respuesta.data?.mensaje || "Revisa tu correo para continuar.");
      setCorreo("");
    } catch (err) {
      setError(err.response?.data?.mensaje || "No se pudo procesar la solicitud. Intenta de nuevo más tarde.");
    } finally {
      setEnviando(false);
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
        <button className="login-back" type="button" onClick={onVolverLogin}>
          ← Volver a iniciar sesión
        </button>
        <h2>Recuperar contraseña</h2>
        <p className="login-ayuda">
          Escribe el correo registrado en tu cuenta. Te enviaremos un enlace para crear una nueva contraseña.
        </p>

        <input
          name="correo"
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(event) => setCorreo(event.target.value)}
          autoComplete="email"
          required
        />

        <button className="login-button" type="submit" disabled={enviando}>
          {enviando ? "Enviando..." : "Enviar enlace"}
        </button>

        {mensaje && <p className="login-message success">{mensaje}</p>}
        {error && <p className="login-message error">{error}</p>}
      </form>
    </main>
  );
}

export default RecuperarPassword;
