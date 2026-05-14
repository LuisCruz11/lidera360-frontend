import { useMemo } from "react";
import { IconoAdmin } from "../utils/IconoAdmin";
import { normalizar, formatearRangoFechas } from "../utils/helpers";

export function Talleres({
  talleres,
  busqueda,
  setBusqueda,
  abrirModal,
  obtenerTipo,
  obtenerEstado,
  asignacionesPorTaller,
  obtenerRol,
  personalPorCedula,
  cargando,
  renderBadgeEstado,
  renderAccionEliminar,
}) {
  const talleresFiltrados = useMemo(() => {
    const texto = normalizar(busqueda);
    if (!texto) return talleres;
    return talleres.filter((taller) =>
      [taller.nombre, obtenerTipo(taller.id_tipo_taller), obtenerEstado(taller.id_estado)].some((valor) =>
        normalizar(valor).includes(texto)
      )
    );
  }, [busqueda, obtenerEstado, obtenerTipo, talleres]);

  const renderVacio = (texto) => <p className="admin-empty">{cargando ? "Cargando información..." : texto}</p>;

  const nombreCompleto = (persona = {}) =>
    `${persona.nombres || ""} ${persona.apellidos || ""}`.trim() || persona.username || persona.cedula || "Sin nombre";

  const obtenerPersonalAsignado = (idTaller, rolBuscado) => {
    const asignaciones = asignacionesPorTaller.get(String(idTaller)) || [];
    return asignaciones
      .filter((asignacion) => normalizar(obtenerRol(asignacion.id_rol)).includes(normalizar(rolBuscado)))
      .map((asignacion) => nombreCompleto(personalPorCedula.get(String(asignacion.cedula_personal)) || asignacion))
      .join(", ");
  };

  return (
    <>
      <header className="admin-header admin-header-actions">
        <h2>Talleres</h2>
        <div className="admin-actions">
          <label className="admin-search">
            <IconoAdmin tipo="search" />
            <input value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="Buscar talleres..." />
          </label>
          <button type="button" className="admin-primary-button" onClick={() => abrirModal("taller")}>
            <IconoAdmin tipo="plus" />
            Nuevo Taller
          </button>
        </div>
      </header>

      <section className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Fechas</th>
              <th>Coach / Coord</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {talleresFiltrados.map((taller) => {
              const coach = obtenerPersonalAsignado(taller.id_taller, "coach");
              const coordinador = obtenerPersonalAsignado(taller.id_taller, "coordinador");
              return (
                <tr key={taller.id_taller}>
                  <td>{taller.nombre}</td>
                  <td>{obtenerTipo(taller.id_tipo_taller) || "Sin tipo"}</td>
                  <td>{formatearRangoFechas(taller.fecha_inicio, taller.fecha_fin)}</td>
                  <td>
                    <strong>{coach || "Sin coach"}</strong>
                    <span>{coordinador || "Sin coordinador"}</span>
                  </td>
                  <td>{renderBadgeEstado(obtenerEstado(taller.id_estado))}</td>
                  <td className="admin-table-actions">{renderAccionEliminar("taller", taller.id_taller, "Eliminar taller")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {talleresFiltrados.length === 0 && renderVacio("No hay talleres para mostrar.")}
      </section>
    </>
  );
}
