import IconoAdmin from "../coordinador/IconoAdmin";
import { BadgeEstado, EstadoVacio } from "../coordinador/PanelComponentes";
import { formatearRangoFechas } from "./utils";

function TalleresPanel({ datos }) {
  const { talleresFiltrados, busqueda, setBusqueda, estadisticas, abrirDetalleTaller, cargando } = datos;

  return (
    <>
      <header className="admin-header admin-header-actions">
        <h2>Mis Talleres</h2>
        <div className="admin-actions">
          <label className="admin-search">
            <IconoAdmin tipo="search" />
            <input value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="Buscar talleres..." />
          </label>
        </div>
      </header>

      <section className="admin-stat-grid" aria-label="Resumen del personal capacitado">
        <article className="admin-stat">
          <span>Talleres asignados</span>
          <strong>{estadisticas.totalTalleres}</strong>
          <small>Donde apoyas la ejecución</small>
        </article>
        <article className="admin-stat">
          <span>Participantes</span>
          <strong>{estadisticas.totalParticipantes}</strong>
          <small>Inscritos en tus talleres</small>
        </article>
      </section>

      <section className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Fechas</th>
              <th>Participantes</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {talleresFiltrados.map((taller) => (
              <tr key={taller.id_taller}>
                <td>{taller.nombre}</td>
                <td>{taller.tipo_taller || "Sin tipo"}</td>
                <td>{formatearRangoFechas(taller.fecha_inicio, taller.fecha_fin)}</td>
                <td>
                  <span className="admin-count-pill">{taller.total_inscritos || 0}</span>
                </td>
                <td><BadgeEstado estado={taller.estado} /></td>
                <td className="admin-table-actions">
                  <button type="button" className="admin-link-button" onClick={() => abrirDetalleTaller(taller)}>
                    Gestionar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {talleresFiltrados.length === 0 && (
          <EstadoVacio cargando={cargando} texto="No tienes talleres asignados. El coordinador debe asignarte a un taller." />
        )}
      </section>
    </>
  );
}

export default TalleresPanel;
