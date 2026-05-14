import { useMemo } from "react";
import { Icono } from "../utils/Icono";
import { formatearRangoFechas, obtenerGrupoEstado } from "../utils/helpers";

export function MisTalleres({ talleresEnCurso, renderEncabezado }) {
  const renderTarjetaTaller = (taller) => (
    <article className="cliente-taller-card" key={taller.id_taller}>
      <div className="cliente-taller-top">
        <span className="cliente-taller-icon">
          <Icono tipo="book" />
        </span>
        <div>
          <h3>{taller.nombre}</h3>
          {taller.categoria && <p>{taller.categoria}</p>}
        </div>
        <span className="cliente-status-badge">Inscrito</span>
      </div>
      <div className="cliente-taller-info">
        {(taller.fecha_inicio || taller.fecha_fin) && (
          <p>
            <Icono tipo="calendar" />
            {formatearRangoFechas(taller.fecha_inicio, taller.fecha_fin)}
          </p>
        )}
        {taller.coach && (
          <p>
            <Icono tipo="user" />
            Coach: {taller.coach}
          </p>
        )}
        {taller.estado && (
          <p>
            <Icono tipo="clock" />
            {taller.estado}
          </p>
        )}
      </div>
      {taller.fecha_inscripcion && (
        <span className="cliente-inscrito-fecha">
          Inscrito el {taller.fecha_inscripcion}
        </span>
      )}
    </article>
  );

  return (
    <>
      {renderEncabezado("Mis Talleres", "Talleres en los que estás inscrito")}
      <div className="cliente-talleres-grid">
        {talleresEnCurso.map(renderTarjetaTaller)}
      </div>
    </>
  );
}
