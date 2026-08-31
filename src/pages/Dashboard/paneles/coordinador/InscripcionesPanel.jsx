import IconoAdmin from "./IconoAdmin";
import { AccionesFila, BadgeEstado, EstadoVacio } from "./PanelComponentes";
import { formatearFecha } from "./utils";

function InscripcionesPanel({ datos }) {
  const {
    inscripcionesFiltradas,
    busqueda,
    setBusqueda,
    abrirModalCrear,
    abrirModalEditar,
    eliminarRegistro,
    obtenerNombreCliente,
    obtenerNombreTaller,
    obtenerEstado,
    cargando,
  } = datos;

  return (
    <>
      <header className="admin-header admin-header-actions">
        <h2>Inscripciones</h2>
        <div className="admin-actions">
          <label className="admin-search">
            <IconoAdmin tipo="search" />
            <input value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="Buscar inscripciones..." />
          </label>
          <button type="button" className="admin-primary-button" onClick={() => abrirModalCrear("inscripcion")}>
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
                <td><BadgeEstado estado={obtenerEstado(inscripcion.id_estado)} /></td>
                <td>{formatearFecha(inscripcion.fecha_inscripcion)}</td>
                <td className="admin-table-actions">
                  <AccionesFila
                    onEditar={() => abrirModalEditar("inscripcion", inscripcion)}
                    onEliminar={() => eliminarRegistro("inscripcion", inscripcion.id_inscripcion)}
                    etiqueta="inscripción"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {inscripcionesFiltradas.length === 0 && <EstadoVacio cargando={cargando} texto="No hay inscripciones para mostrar." />}
      </section>
    </>
  );
}

export default InscripcionesPanel;
