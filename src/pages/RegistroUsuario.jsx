import { useState } from "react";
import { registrarUsuario } from "../api/usuariosApi";
import "../styles/registroUsuario.css";
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

function RegistroUsuario({ onVolverInicio, onLoginClick }) {
  const [formulario, setFormulario] = useState(datosIniciales);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const soloLetrasRegex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]+$/;
  const soloNumerosRegex = /^\d+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;

  const manejarCambio = (event) => {
    const { name, value: valueOriginal } = event.target;
    let value = valueOriginal;

    if (name === "cedula" || name === "telefono") {
      value = valueOriginal.replace(/\D/g, "");
    }

    if (name === "nombres" || name === "apellidos") {
      value = valueOriginal.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]/g, "");
    }

    setFormulario((datosActuales) => ({
      ...datosActuales,
      [name]: value,
    }));
  };

  const validarPassword = (password) => passwordRegex.test(password);

  const validarFormulario = () => {
    if (!formulario.cedula || !soloNumerosRegex.test(formulario.cedula)) {
      return "La cédula debe contener solo números.";
    }

    if (!formulario.nombres || !soloLetrasRegex.test(formulario.nombres)) {
      return "El nombre solo puede contener letras y espacios.";
    }

    if (!formulario.apellidos || !soloLetrasRegex.test(formulario.apellidos)) {
      return "El apellido solo puede contener letras y espacios.";
    }

    if (!formulario.telefono || !soloNumerosRegex.test(formulario.telefono)) {
      return "El teléfono debe contener solo números.";
    }

    if (!validarPassword(formulario.password)) {
      return "La contraseña debe tener mínimo 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial.";
    }

    return "";
  };

  const requisitosPassword = {
    minLength: formulario.password.length >= 8,
    hasUpper: /[A-Z]/.test(formulario.password),
    hasLower: /[a-z]/.test(formulario.password),
    hasNumber: /\d/.test(formulario.password),
    hasSymbol: /[@$!%?&]/.test(formulario.password),
  };

  const manejarEnvio = async (event) => {
    event.preventDefault();
    setMensaje("");
    setError("");
    setCargando(true);

    const errorValidacion = validarFormulario();
    if (errorValidacion) {
      setError(errorValidacion);
      setCargando(false);
      return;
    }

    const datosRegistro = {
      ...formulario,
      sexo: valoresSexo[formulario.sexo],
      edad: Number(formulario.edad),
    };

    try {
      const respuesta = await registrarUsuario(datosRegistro);
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

        <h2>Crear Cuenta</h2>

        <input
          name="cedula"
          placeholder="Cedula"
          value={formulario.cedula}
          onChange={manejarCambio}
          required
        />
        {formulario.cedula && (
          <p className={`registro-note ${soloNumerosRegex.test(formulario.cedula) ? "" : "error"}`}>
            Cedula: solo números, sin espacios ni símbolos.
          </p>
        )}

        <input
          name="nombres"
          placeholder="Nombres"
          value={formulario.nombres}
          onChange={manejarCambio}
          required
        />
        {formulario.nombres && (
          <p className={`registro-note ${soloLetrasRegex.test(formulario.nombres) ? "" : "error"}`}>
            Nombres: solo letras y espacios.
          </p>
        )}

        <input
          name="apellidos"
          placeholder="Apellidos"
          value={formulario.apellidos}
          onChange={manejarCambio}
          required
        />
        {formulario.apellidos && (
          <p className={`registro-note ${soloLetrasRegex.test(formulario.apellidos) ? "" : "error"}`}>
            Apellidos: solo letras y espacios.
          </p>
        )}

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
        {formulario.telefono && (
          <p className={`registro-note ${soloNumerosRegex.test(formulario.telefono) ? "" : "error"}`}>
            Teléfono: solo números, sin espacios ni símbolos.
          </p>
        )}

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
        <div className="password-requirements">
          <p>Mínimo 8 caracteres, al menos una letra mayúscula, una letra minúscula, un número y un carácter especial.</p>
          <ul>
            <li className={requisitosPassword.minLength ? "requirement-met" : "requirement-unmet"}>
              {requisitosPassword.minLength ? "✓" : "○"} 8 caracteres o más
            </li>
            <li className={requisitosPassword.hasUpper ? "requirement-met" : "requirement-unmet"}>
              {requisitosPassword.hasUpper ? "✓" : "○"} Una letra mayúscula
            </li>
            <li className={requisitosPassword.hasLower ? "requirement-met" : "requirement-unmet"}>
              {requisitosPassword.hasLower ? "✓" : "○"} Una letra minúscula
            </li>
            <li className={requisitosPassword.hasNumber ? "requirement-met" : "requirement-unmet"}>
              {requisitosPassword.hasNumber ? "✓" : "○"} Un número
            </li>
            <li className={requisitosPassword.hasSymbol ? "requirement-met" : "requirement-unmet"}>
              {requisitosPassword.hasSymbol ? "✓" : "○"} Un carácter especial (@$!%?&)
            </li>
          </ul>
        </div>

        <button className="registro-button" type="submit" disabled={cargando}>
          {cargando ? "Registrando..." : "Registrarse"}
        </button>

        <button className="registro-secondary-button" type="button" onClick={onVolverInicio}>
          Ir a la página principal
        </button>

        <p className="registro-login-text">
          ¿Ya tienes cuenta?{' '}
          <button className="registro-login-link" type="button" onClick={onLoginClick}>
            Inicia sesión aquí
          </button>
        </p>

        {mensaje && <p className="registro-message success">{mensaje}</p>}
        {error && <p className="registro-message error">{error}</p>}
      </form>
    </main>
  );
}

export default RegistroUsuario;
