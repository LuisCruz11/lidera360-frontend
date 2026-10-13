import { useState } from "react";
import ModalShell from "../coordinador/ModalShell";
import ParticipantesCoach from "./ParticipantesCoach";
import BitacoraCoach from "./BitacoraCoach";
import { formatearRangoFechas } from "./utils";

function ContenidoTaller({ datos }) {
  const {
    detalleTaller,
    errorDetalle,
    mensajeDetalle,
    actividad,
    setActividad,
    guardandoActividad,
    estadosEvaluacion,
    evaluaciones,
    evaluandoId,
    enviarActividad,
    cambiarEvaluacion,
    guardarEvaluacion,
  } = datos;
  const [pestana, setPestana] = useState("participantes");

  const pestanas = [
    { id: "participantes", etiqueta: `Participantes (${detalleTaller.clientes_inscritos.length})` },
    { id: "bitacora", etiqueta: `Bitácora (${detalleTaller.notas.length})` },
  ];

  return (
    <div className="admin-detalle">
      <p className="admin-detalle-meta">
        {detalleTaller.taller.tipo_taller || "Sin tipo"}
        {" · "}
        {detalleTaller.taller.estado || "Sin estado"}
        {" · "}
        {formatearRangoFechas(detalleTaller.taller.fecha_inicio, detalleTaller.taller.fecha_fin)}
      </p>

      <div className="coach-pestanas" role="tablist">
        {pestanas.map((opcion) => (
          <button
            type="button"
            role="tab"
            key={opcion.id}
            aria-selected={pestana === opcion.id}
            className={`coach-pestana ${pestana === opcion.id ? "coach-pestana-activa" : ""}`}
            onClick={() => setPestana(opcion.id)}
          >
            {opcion.etiqueta}
          </button>
        ))}
      </div>

      {mensajeDetalle && <p className="admin-alert admin-alert-success">{mensajeDetalle}</p>}
      {errorDetalle && <p className="admin-alert admin-alert-error">{errorDetalle}</p>}

      {pestana === "participantes" ? (
        <ParticipantesCoach
          inscritos={detalleTaller.clientes_inscritos}
          estadosEvaluacion={estadosEvaluacion}
          evaluaciones={evaluaciones}
          evaluandoId={evaluandoId}
          cambiarEvaluacion={cambiarEvaluacion}
          guardarEvaluacion={guardarEvaluacion}
        />
      ) : (
        <>
          <form className="admin-form coach-actividad-form" onSubmit={enviarActividad}>
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

          <BitacoraCoach notas={detalleTaller.notas} />
        </>
      )}
    </div>
  );
}

function TallerCoachModal({ datos }) {
  const { tallerSeleccionado, detalleTaller, cargandoDetalle, errorDetalle, cerrarDetalleTaller } = datos;

  if (!tallerSeleccionado) return null;

  return (
    <ModalShell titulo={tallerSeleccionado.nombre} onCerrar={cerrarDetalleTaller} className="coach-modal">
      {cargandoDetalle && <p className="admin-empty">Cargando información del taller...</p>}

      {!cargandoDetalle && detalleTaller && <ContenidoTaller key={tallerSeleccionado.id_taller} datos={datos} />}

      {!cargandoDetalle && !detalleTaller && errorDetalle && (
        <p className="admin-alert admin-alert-error">{errorDetalle}</p>
      )}
    </ModalShell>
  );
}

export default TallerCoachModal;
