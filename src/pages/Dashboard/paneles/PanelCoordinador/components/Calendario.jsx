import { useMemo } from "react";
import { ordenarPorFechaDesc, formatearRangoFechas } from "../utils/helpers";

export function Calendario({ talleres, obtenerTipo, obtenerEstado, cargando }) {
  const renderVacio = (texto) => <p className="admin-empty">{cargando ? "Cargando información..." : texto}</p>;

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
        {talleres.length === 0 && renderVacio("No hay talleres programados.")}
      </section>
    </>
  );
}
