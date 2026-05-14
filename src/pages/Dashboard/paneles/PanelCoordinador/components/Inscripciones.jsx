import { useMemo } from "react";
import { IconoAdmin } from "../utils/IconoAdmin";
import { normalizar, crearMapa, formatearFecha } from "../utils/helpers";

export function Inscripciones({
  inscripciones,
  busqueda,
  setBusqueda,
  abrirModal,
  obtenerEstado,
  clientes,
  talleres,
  cargando,
  renderBadgeEstado,
  renderAccionEliminar,
}) {
  const inscripcionesFiltradas = useMemo(() => {
    const texto = normalizar(busqueda);
    const clientePorCedula = crearMapa(clientes, "cedula");
    const tallerPorId = crearMapa(talleres, "id_taller");

    if (!texto) return inscripciones;
    return inscripciones.filter((inscripcion) => {
      const nombreCliente = `${clientePorCedula.get(String(inscripcion.cliente_cedula))?.nombres || ""} ${
        clientePorCedula.get(String(inscripcion.cliente_cedula))?.apellidos || ""
      }`.trim();
      const nombreTaller = tallerPorId.get(String(inscripcion.id_taller))?.nombre || `Taller ${inscripcion.id_taller}`;
      return [nombreCliente, nombreTaller, obtenerEstado(inscripcion.id_estado)].some((valor) =>
        normalizar(valor).includes(texto)
      );
    });
  }, [busqueda, inscripciones, obtenerEstado, clientes, talleres]);

  const renderVacio = (texto) => <p className="admin-empty">{cargando ? "Cargando información..." : texto}</p>;

  const clientePorCedula = useMemo(() => crearMapa(clientes, "cedula"), [clientes]);
  const tallerPorId = useMemo(() => crearMapa(talleres, "id_taller"), [talleres]);

  const obtenerNombreCliente = (cedula) =>
    `${clientePorCedula.get(String(cedula))?.nombres || ""} ${clientePorCedula.get(String(cedula))?.apellidos || ""}`.trim() ||
    clientePorCedula.get(String(cedula))?.username || cedula || "Sin nombre";

  const obtenerNombreTaller = (idTaller) => tallerPorId.get(String(idTaller))?.nombre || `Taller ${idTaller}`;

  return (
    <>
      <header className="admin-header admin-header-actions">
        <h2>Inscripciones</h2>
        <div className="admin-actions">
          <label className="admin-search">
            <IconoAdmin tipo="search" />
            <input value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="Buscar inscripciones..." />
          </label>
          <button type="button" className="admin-primary-button" onClick={() => abrirModal("inscripcion")}>
            <IconoAdmin tipo="plus" />
            Inscribir Cliente
          </button>
        </div>
      </header>

      <section className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Taller</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inscripcionesFiltradas.map((inscripcion) => (
              <tr key={inscripcion.id_inscripcion}>
                <td>
                  <strong>{obtenerNombreCliente(inscripcion.cliente_cedula)}</strong>
                  <span>{inscripcion.cliente_cedula}</span>
                </td>
                <td>{obtenerNombreTaller(inscripcion.id_taller)}</td>
                <td>{renderBadgeEstado(obtenerEstado(inscripcion.id_estado))}</td>
                <td>{formatearFecha(inscripcion.fecha_inscripcion)}</td>
                <td className="admin-table-actions">
                  {renderAccionEliminar("inscripcion", inscripcion.id_inscripcion, "Eliminar inscripción")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {inscripcionesFiltradas.length === 0 && renderVacio("No hay inscripciones para mostrar.")}
      </section>
    </>
  );
}
