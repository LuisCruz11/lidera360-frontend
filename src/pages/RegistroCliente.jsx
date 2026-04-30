import { useState } from "react";
import { registrarClienteUsuario } from "../api/usuariosApi";
import "../styles/registroCliente.css";
import logo from "../assets/images/logo.png";

const datosIniciales = {
  cedula: "",
  nombres: "",
  apellidos: "",
  correo: "",
  telefono: "",
  sexo: "",
  edad: "",
  username: "",
  password: "",
};

const valoresSexo = {
  Masculino: "M",
  Femenino: "F",
  Otro: "Otro",
};

function RegistroCliente({ onVolverInicio }) {
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

    const datosRegistro = {
      ...formulario,
      sexo: valoresSexo[formulario.sexo],
      edad: Number(formulario.edad),
    };

    try {
      const respuesta = await registrarClienteUsuario(datosRegistro);
      setMensaje(respuesta.data.mensaje);
      setFormulario(datosIniciales);
    } catch (err) {
      const mensajeError = err.response?.data?.mensaje || "No se pudo registrar el usuario";
      setError(mensajeError);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="registro-page">
      <section className="registro-header">
        <img src={logo} alt="Lidera360" className="registro-logo" />
        <h1>Lidera360</h1>
        <p>Portal del Participante</p>
      </section>

      <form className="registro-card" onSubmit={manejarEnvio}>
        <button className="registro-back" type="button" onClick={onVolverInicio}>
          Volver
        </button>

        <h2>Crear Cuenta</h2>

        <input
          name="cedula"
          placeholder="Cedula"
          value={formulario.cedula}
          onChange={manejarCambio}
          required
        />

        <input
          name="nombres"
          placeholder="Nombres"
          value={formulario.nombres}
          onChange={manejarCambio}
          required
        />

        <input
          name="apellidos"
          placeholder="Apellidos"
          value={formulario.apellidos}
          onChange={manejarCambio}
          required
        />

        <input
          name="correo"
          type="email"
          placeholder="Correo electronico"
          value={formulario.correo}
          onChange={manejarCambio}
          required
        />

        <input
          name="telefono"
          placeholder="Telefono"
          value={formulario.telefono}
          onChange={manejarCambio}
          required
        />

        <select name="sexo" value={formulario.sexo} onChange={manejarCambio} required>
          <option value="">Sexo</option>
          <option value="Masculino">Masculino</option>
          <option value="Femenino">Femenino</option>
          <option value="Otro">Otro</option>
        </select>

        <input
          name="edad"
          type="number"
          placeholder="Edad"
          value={formulario.edad}
          onChange={manejarCambio}
          min="1"
          required
        />

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
          placeholder="Contrasena"
          value={formulario.password}
          onChange={manejarCambio}
          minLength="8"
          required
        />

        <button className="registro-button" type="submit" disabled={cargando}>
          {cargando ? "Registrando..." : "Registrarse"}
        </button>

        {mensaje && <p className="registro-message success">{mensaje}</p>}
        {error && <p className="registro-message error">{error}</p>}
      </form>
    </main>
  );
}

export default RegistroCliente;
