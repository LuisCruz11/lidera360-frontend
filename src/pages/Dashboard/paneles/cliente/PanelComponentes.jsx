import IconoCliente from "./IconoCliente";
import { formatearFecha, formatearRangoFechas } from "./utils";

export function EncabezadoPanel({ titulo, subtitulo }) {
  return (
    <header className="cliente-panel-header">
      <h2>{titulo}</h2>
      <p>{subtitulo}</p>
    </header>
  );
}

export function TarjetaTaller({ taller }) {
  return (
    <article className="cliente-taller-card">
      <div className="cliente-taller-top">
        <span className="cliente-taller-icon">
          <IconoCliente tipo="book" />
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
            <IconoCliente tipo="calendar" />
            {formatearRangoFechas(taller.fecha_inicio, taller.fecha_fin)}
          </p>
        )}
        {taller.coach && (
          <p>
            <IconoCliente tipo="user" />
            Coach: {taller.coach}
          </p>
        )}
        {taller.estado && (
          <p>
            <IconoCliente tipo="clock" />
            {taller.estado}
          </p>
        )}
      </div>
      {taller.fecha_inscripcion && (
        <span className="cliente-inscrito-fecha">
          Inscrito el {formatearFecha(taller.fecha_inscripcion, "larga")}
        </span>
      )}
    </article>
  );
}
