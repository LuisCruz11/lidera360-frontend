import { useState } from "react";
import CambiarPasswordForm from "../CambiarPasswordForm";
import { EncabezadoPanel } from "./PanelComponentes";
import { obtenerIniciales } from "./utils";

function ContactoForm({ cliente, guardando, onGuardar }) {
  const [editando, setEditando] = useState(false);
  const [formulario, setFormulario] = useState({ correo: "", telefono: "" });

  const abrir = () => {
    setFormulario({ correo: cliente?.correo || "", telefono: cliente?.telefono || "" });
    setEditando(true);
  };

  const manejarCambio = (event) => {
    const { name, value } = event.target;
    setFormulario((actuales) => ({ ...actuales, [name]: value }));
  };

  const manejarEnvio = async (event) => {
    event.preventDefault();
    const guardado = await onGuardar({ correo: formulario.correo.trim(), telefono: formulario.telefono.trim() });
    if (guardado) setEditando(false);
  };

  if (!editando) {
    return (
      <button type="button" className="cliente-password-boton cliente-editar-contacto" onClick={abrir} disabled={!cliente}>
        Editar datos de contacto
      </button>
    );
  }

  return (
    <form className="cliente-password-form cliente-contacto-form" onSubmit={manejarEnvio}>
      <label>
        Correo
        <input name="correo" type="email" value={formulario.correo} onChange={manejarCambio} required />
      </label>
      <label>
        Teléfono
        <input
          name="telefono"
          inputMode="numeric"
          pattern="\d{7,10}"
          title="Solo números, entre 7 y 10 dígitos"
          value={formulario.telefono}
          onChange={manejarCambio}
          required
        />
      </label>
      <div className="cliente-contacto-acciones">
        <button type="submit" className="cliente-password-boton" disabled={guardando}>
          {guardando ? "Guardando..." : "Guardar"}
        </button>
        <button type="button" className="cliente-boton-secundario" onClick={() => setEditando(false)} disabled={guardando}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

function PerfilPanel({ datos }) {
  const { cliente, usuario, nombreCliente, nivelActual, programaCompletado, guardandoContacto, guardarContacto } = datos;

  const estadoUsuario =
    cliente?.estado || (usuario.activo === true ? "Activo" : usuario.activo === false ? "Inactivo" : "");
  const camposPerfil = [
    { etiqueta: "Cédula", valor: cliente?.cedula || usuario.cedula_cliente },
    { etiqueta: "Correo", valor: cliente?.correo },
    { etiqueta: "Teléfono", valor: cliente?.telefono },
    { etiqueta: "Edad", valor: cliente?.edad },
    { etiqueta: "Estado", valor: estadoUsuario },
    { etiqueta: "Nivel actual", valor: programaCompletado ? `${nivelActual} (programa completado)` : nivelActual },
  ].filter((campo) => campo.valor !== undefined && campo.valor !== null && campo.valor !== "");

  return (
    <>
      <EncabezadoPanel titulo="Perfil" subtitulo="Información personal" />
      <section className="cliente-perfil-card">
        <div className="cliente-perfil-main">
          <span className="cliente-avatar cliente-avatar-large">{obtenerIniciales(nombreCliente)}</span>
          <div>
            <h3>{nombreCliente}</h3>
            <p>{usuario.username}</p>
          </div>
        </div>
        {camposPerfil.length > 0 && (
          <div className="cliente-perfil-grid">
            {camposPerfil.map((campo) => (
              <div key={campo.etiqueta}>
                <span>{campo.etiqueta}</span>
                <strong>{campo.valor}</strong>
              </div>
            ))}
          </div>
        )}
        <ContactoForm cliente={cliente} guardando={guardandoContacto} onGuardar={guardarContacto} />
      </section>
      {usuario.id_usuario && <CambiarPasswordForm idUsuario={usuario.id_usuario} />}
    </>
  );
}

export default PerfilPanel;
