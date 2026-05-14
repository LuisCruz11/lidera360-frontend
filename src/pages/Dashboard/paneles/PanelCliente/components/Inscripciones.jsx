import { useMemo } from "react";
import { Icono } from "../utils/Icono";
import { obtenerGrupoEstado, obtenerEtiquetaEstado, formatearFecha } from "../utils/helpers";

export function Inscripciones({ talleresInscritos, estadisticas, renderEncabezado }) {
  return (
    <>
      {renderEncabezado("Mis Inscripciones", "Historial de talleres a los que te has inscrito")}
      {talleresInscritos.length > 0 && (
        <>
          <section className="cliente-stats-grid" aria-label="Resumen de inscripciones">
            <article className="cliente-stat-card cliente-stat-aprobado">
              <Icono tipo="check" />
              <strong>{estadisticas.aprobados}</strong>
              <span>Aprobadas</span>
            </article>
            <article className="cliente-stat-card cliente-stat-curso">
              <Icono tipo="clock" />
              <strong>{estadisticas.enCurso}</strong>
              <span>En Curso</span>
            </article>
            <article className="cliente-stat-card cliente-stat-no-aprobado">
              <Icono tipo="x" />
              <strong>{estadisticas.noAprobados}</strong>
              <span>No Aprobadas</span>
            </article>
          </section>
          <section className="cliente-inscripciones-lista">
            {talleresInscritos.map((taller) => {
              const grupo = obtenerGrupoEstado(taller.estado);
              return (
                <article className="cliente-inscripcion-row" key={`historial-${taller.id_taller}`}>
                  <div>
                    <h3>{taller.nombre}</h3>
                    {taller.fecha_inscripcion && <p>Inscrito: {formatearFecha(taller.fecha_inscripcion, "larga")}</p>}
                  </div>
                  {taller.estado && (
                    <span className={`cliente-chip cliente-chip-${grupo}`}>{obtenerEtiquetaEstado(taller.estado)}</span>
                  )}
                </article>
              );
            })}
          </section>
        </>
      )}
    </>
  );
}
