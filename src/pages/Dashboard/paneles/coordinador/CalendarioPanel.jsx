import { formatearRangoFechas, ordenarPorFechaDesc } from "./utils";

function CalendarioPanel({ datos }) {
  const { talleres, obtenerTipo, obtenerEstado } = datos;

  return (
    <>
      <header className="admin-header">
        <h2>Calendario</h2>
      </header>
      <section className="admin-calendar-list">
        {ordenarPorFechaDesc(talleres, "fecha_inicio").map((taller) => (
          <article className="admin-calendar-item" key={`calendar-${taller.id_taller}`}>
            <time>{formatearRangoFechas(taller.fecha_inicio, taller.fecha_fin)}</time>
            <div>
              <strong>{taller.nombre}</strong>
              <span>{obtenerTipo(taller.id_tipo_taller) || "Sin tipo"} · {obtenerEstado(taller.id_estado) || "Sin estado"}</span>
            </div>
          </article>
        ))}
        {talleres.length === 0 && <p className="admin-empty">No hay talleres programados.</p>}
      </section>
    </>
  );
}

export default CalendarioPanel;
