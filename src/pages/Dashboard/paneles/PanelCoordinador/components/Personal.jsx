import { useMemo } from "react";
import { IconoAdmin } from "../utils/IconoAdmin";
import { normalizar, crearMapa } from "../utils/helpers";

export function Personal({
  personal,
  busqueda,
  setBusqueda,
  abrirModal,
  obtenerRol,
  usuarios,
  cargando,
  renderBadgeEstado,
  renderAccionEliminar,
}) {
  const personalFiltrado = useMemo(() => {
    const texto = normalizar(busqueda);
    if (!texto) return personal;
    return personal.filter((persona) =>
      [persona.cedula, persona.nombres, persona.apellidos, persona.correo, obtenerRol(persona.id_rol)].some((valor) =>
        normalizar(valor).includes(texto)
      )
    );
  }, [busqueda, obtenerRol, personal]);

  const renderVacio = (texto) => <p className="admin-empty">{cargando ? "Cargando información..." : texto}</p>;

  const nombreCompleto = (persona = {}) =>
    `${persona.nombres || ""} ${persona.apellidos || ""}`.trim() || persona.username || persona.cedula || "Sin nombre";

  const usuarioPorPersonal = useMemo(
    () => new Map(usuarios.filter((item) => item.cedula_personal).map((item) => [String(item.cedula_personal), item])),
    [usuarios]
  );

  return (
    <>
      <header className="admin-header admin-header-actions">
        <h2>Personal</h2>
        <div className="admin-actions">
          <label className="admin-search">
            <IconoAdmin tipo="search" />
            <input value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="Buscar personal..." />
          </label>
          <button type="button" className="admin-primary-button" onClick={() => abrirModal("personal")}>
            <IconoAdmin tipo="plus" />
            Nuevo Personal
          </button>
        </div>
      </header>

      <section className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Contacto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {personalFiltrado.map((persona) => {
              const usuarioPersonal = usuarioPorPersonal.get(String(persona.cedula));
              return (
                <tr key={persona.cedula}>
                  <td>{nombreCompleto(persona)}</td>
                  <td>{usuarioPersonal?.username || "Sin usuario"}</td>
                  <td>{renderBadgeEstado(obtenerRol(persona.id_rol))}</td>
                  <td>
                    <strong>{persona.correo || "Sin correo"}</strong>
                    <span>{persona.telefono || "Sin teléfono"}</span>
                  </td>
                  <td className="admin-table-actions">{renderAccionEliminar("personal", persona.cedula, "Eliminar personal")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {personalFiltrado.length === 0 && renderVacio("No hay personal para mostrar.")}
      </section>
    </>
  );
}
