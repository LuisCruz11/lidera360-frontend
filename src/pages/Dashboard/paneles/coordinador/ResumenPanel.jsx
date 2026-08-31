import { EstadoVacio } from "./PanelComponentes";
import { formatearFecha } from "./utils";

function ResumenPanel({ datos }) {
  const { estadisticas, inscripcionesRecientes, obtenerNombreCliente, obtenerNombreTaller, cargando } = datos;

  return (
    <>
      <header className="admin-header">
        <h2>Panel</h2>
      </header>

      <section className="admin-stat-grid" aria-label="Resumen general">
        <article className="admin-stat">
          <span>Total Clientes</span>
          <strong>{estadisticas.totalClientes}</strong>
          <small>{estadisticas.clientesActivos} activos actualmente</small>
        </article>
        <article className="admin-stat">
          <span>Talleres Activos</span>
          <strong>{estadisticas.talleresActivos}</strong>
          <small>En progreso o planificados</small>
        </article>
        <article className="admin-stat">
          <span>Total Inscripciones</span>
          <strong>{estadisticas.totalInscripciones}</strong>
          <small>Histórico general</small>
        </article>
      </section>

      <div className="admin-dashboard-grid">
        <section className="admin-panel-box">
          <h3>Inscripciones Recientes</h3>
          {inscripcionesRecientes.length === 0
            ? <EstadoVacio cargando={cargando} texto="No hay inscripciones registradas." />
            : inscripcionesRecientes.map((inscripcion) => (
                <article className="admin-recent-row" key={inscripcion.id_inscripcion}>
                  <div>
                    <strong>{obtenerNombreCliente(inscripcion.cliente_cedula)}</strong>
                    <span>{obtenerNombreTaller(inscripcion.id_taller)}</span>
                  </div>
                  <time>{formatearFecha(inscripcion.fecha_inscripcion)}</time>
                </article>
              ))}
        </section>

        <section className="admin-panel-box">
          <h3>Niveles de Clientes</h3>
          {estadisticas.niveles.length === 0
            ? <EstadoVacio cargando={cargando} texto="No hay niveles registrados." />
            : estadisticas.niveles.map((nivel) => (
                <article className="admin-level-row" key={nivel.id_tipo_taller}>
                  <span>{nivel.nombre}</span>
                  <strong>{nivel.total}</strong>
                </article>
              ))}
        </section>
      </div>
    </>
  );
}

export default ResumenPanel;
