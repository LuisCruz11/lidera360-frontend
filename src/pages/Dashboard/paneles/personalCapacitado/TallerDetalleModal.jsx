import ModalShell from "../coordinador/ModalShell";
import { BadgeEstado } from "../coordinador/PanelComponentes";
import { formatearFechaHora, formatearRangoFechas } from "./utils";

function TallerDetalleModal({ datos }) {
  const {
    tallerSeleccionado,
    detalleTaller,
    cargandoDetalle,
    nota,
    setNota,
    guardandoNota,
    errorDetalle,
    cerrarDetalleTaller,
    enviarNota,
  } = datos;

  if (!tallerSeleccionado) return null;

  return (
    <ModalShell titulo={tallerSeleccionado.nombre} onCerrar={cerrarDetalleTaller}>
      {cargandoDetalle && <p className="admin-empty">Cargando información del taller...</p>}

      {!cargandoDetalle && detalleTaller && (
        <div className="admin-detalle">
          <p className="admin-detalle-meta">
            {detalleTaller.taller.tipo_taller || "Sin tipo"}
            {" · "}
            {detalleTaller.taller.estado || "Sin estado"}
            {" · "}
            {formatearRangoFechas(detalleTaller.taller.fecha_inicio, detalleTaller.taller.fecha_fin)}
          </p>

          <div className="admin-detalle-grid">
            <div>
              <span className="admin-detalle-label">Coach</span>
              <strong>{detalleTaller.coach || "Sin asignar"}</strong>
            </div>
            <div>
              <span className="admin-detalle-label">Coordinador</span>
              <strong>{detalleTaller.coordinador || "Sin asignar"}</strong>
            </div>
          </div>

          <h4>Clientes inscritos ({detalleTaller.clientes_inscritos.length})</h4>
          {detalleTaller.clientes_inscritos.length === 0 ? (
            <p className="admin-empty">No hay clientes inscritos en este taller.</p>
          ) : (
            <ul className="admin-lista-simple">
              {detalleTaller.clientes_inscritos.map((cliente) => (
                <li key={cliente.id_inscripcion}>
                  <span>{cliente.nombre || cliente.cliente_cedula}</span>
                  <BadgeEstado estado={cliente.estado} />
                </li>
              ))}
            </ul>
          )}

          <h4>Notas de seguimiento</h4>
          {detalleTaller.notas.length === 0 ? (
            <p className="admin-empty">Aún no hay notas registradas.</p>
          ) : (
            <ul className="admin-notas-lista">
              {detalleTaller.notas.map((nota_) => (
                <li key={nota_.id_auditoria}>
                  <p>{nota_.descripcion}</p>
                  <span>
                    {nota_.usuario || "Usuario"} · {formatearFechaHora(nota_.fecha)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <form className="admin-form" onSubmit={enviarNota}>
            <label>
              Nueva nota
              <textarea
                value={nota}
                onChange={(event) => setNota(event.target.value)}
                placeholder="Escribe una nota de seguimiento sobre este taller..."
                required
              />
            </label>
            {errorDetalle && <p className="admin-alert admin-alert-error">{errorDetalle}</p>}
            <div className="admin-form-actions">
              <button type="submit" className="admin-primary-button" disabled={guardandoNota || !nota.trim()}>
                {guardandoNota ? "Guardando..." : "Agregar nota"}
              </button>
            </div>
          </form>
        </div>
      )}

      {!cargandoDetalle && !detalleTaller && errorDetalle && (
        <p className="admin-alert admin-alert-error">{errorDetalle}</p>
      )}
    </ModalShell>
  );
}

export default TallerDetalleModal;
