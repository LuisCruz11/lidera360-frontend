import { Icono } from "../utils/Icono";

export function Perfil({ nombreCliente, usuario, cliente, nivelActual, obtenerIniciales, renderEncabezado }) {
  const estadoUsuario =
    cliente?.estado || (usuario.activo === true ? "Activo" : usuario.activo === false ? "Inactivo" : "");
  const camposPerfil = [
    { etiqueta: "Cédula", valor: cliente?.cedula || usuario.cedula_cliente },
    { etiqueta: "Correo", valor: cliente?.correo },
    { etiqueta: "Teléfono", valor: cliente?.telefono },
    { etiqueta: "Edad", valor: cliente?.edad },
    { etiqueta: "Estado", valor: estadoUsuario },
    { etiqueta: "Nivel actual", valor: nivelActual },
  ].filter((campo) => campo.valor !== undefined && campo.valor !== null && campo.valor !== "");

  return (
    <>
      {renderEncabezado("Perfil", "Información personal")}
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
      </section>
    </>
  );
}
