import ModalShell from "../coordinador/ModalShell";
import { BadgeEstado } from "../coordinador/PanelComponentes";
import { etiquetaRegistro, formatearFechaHora, formatearRangoFechas } from "./utils";

function TallerCoachModal({ datos }) {
  const {
    tallerSeleccionado,
    detalleTaller,
    cargandoDetalle,
    errorDetalle,
    mensajeDetalle,
    actividad,
    setActividad,
    guardandoActividad,
    estadosEvaluacion,
    evaluaciones,
    evaluandoId,
    cerrarDetalleTaller,
    enviarActividad,
    cambiarEvaluacion,
    guardarEvaluacion,
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

          {mensajeDetalle && <p className="admin-alert admin-alert-success">{mensajeDetalle}</p>}
          {errorDetalle && <p className="admin-alert admin-alert-error">{errorDetalle}</p>}

          <h4>Participantes ({detalleTaller.clientes_inscritos.length})</h4>
          {detalleTaller.clientes_inscritos.length === 0 ? (
            <p className="admin-empty">No hay participantes inscritos en este taller.</p>
          ) : (
            <ul className="admin-lista-simple">
              {detalleTaller.clientes_inscritos.map((inscrito) => {
                const evaluacion = evaluaciones[inscrito.id_inscripcion] || { id_estado: "", observacion: "" };
                const nombre = inscrito.nombre || inscrito.cliente_cedula;
                return (
                  <li key={inscrito.id_inscripcion} className="coach-participante">
                    <div className="coach-participante-info">
                      <span>{nombre}</span>
                      <small>{inscrito.cliente_cedula}</small>
                    </div>
                    <BadgeEstado estado={inscrito.estado} />
                    <div className="coach-evaluacion">
                      <select
                        aria-label={`Evaluación de ${nombre}`}
                        value={evaluacion.id_estado}
                        onChange={(event) => cambiarEvaluacion(inscrito.id_inscripcion, "id_estado", event.target.value)}
                      >
                        <option value="">Selecciona un estado</option>
                        {estadosEvaluacion.map((estado) => (
                          <option value={estado.id_estado} key={estado.id_estado}>
                            {estado.nombre}
                          </option>
                        ))}
                      </select>
                      <input
                        aria-label={`Observación para ${nombre}`}
                        value={evaluacion.observacion}
                        onChange={(event) => cambiarEvaluacion(inscrito.id_inscripcion, "observacion", event.target.value)}
                        placeholder="Observación (opcional)"
                        maxLength={250}
                      />
                      <button
                        type="button"
                        className="admin-primary-button"
                        disabled={!evaluacion.id_estado || evaluandoId === inscrito.id_inscripcion}
                        onClick={() => guardarEvaluacion(inscrito.id_inscripcion)}
                      >
                        {evaluandoId === inscrito.id_inscripcion ? "Guardando..." : "Evaluar"}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <h4>Bitácora del taller</h4>
          {detalleTaller.notas.length === 0 ? (
            <p className="admin-empty">Aún no hay actividades registradas.</p>
          ) : (
            <ul className="admin-notas-lista">
              {detalleTaller.notas.map((registro) => (
                <li key={registro.id_auditoria}>
                  <p>{registro.descripcion}</p>
                  <span>
                    {etiquetaRegistro(registro.accion)} · {registro.usuario || "Usuario"} · {formatearFechaHora(registro.fecha)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <form className="admin-form" onSubmit={enviarActividad}>
            <label>
              Registrar actividad
              <textarea
                value={actividad}
                onChange={(event) => setActividad(event.target.value)}
                placeholder="Describe la actividad realizada en la sesión: dinámica, tema o tarea asignada."
                required
              />
            </label>
            <div className="admin-form-actions">
              <button type="submit" className="admin-primary-button" disabled={guardandoActividad || !actividad.trim()}>
                {guardandoActividad ? "Guardando..." : "Registrar actividad"}
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

export default TallerCoachModal;
