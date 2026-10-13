import { useMemo, useState } from "react";
import ModalShell from "../coordinador/ModalShell";
import IconoAdmin from "../coordinador/IconoAdmin";
import { BadgeEstado } from "../coordinador/PanelComponentes";
import BitacoraCoach from "../coach/BitacoraCoach";
import AsistenciaTaller from "./AsistenciaTaller";
import { formatearRangoFechas, normalizar } from "./utils";

function ParticipantesTaller({ inscritos }) {
  const [busqueda, setBusqueda] = useState("");

  const visibles = useMemo(() => {
    const texto = normalizar(busqueda.trim());
    if (!texto) return inscritos;
    return inscritos.filter((i) => [i.nombre, i.cliente_cedula].some((valor) => normalizar(valor || "").includes(texto)));
  }, [busqueda, inscritos]);

  if (inscritos.length === 0) {
    return <p className="admin-empty">No hay participantes inscritos en este taller.</p>;
  }

  return (
    <>
      <div className="coach-participantes-toolbar">
        <span />
        <label className="admin-search coach-buscador">
          <IconoAdmin tipo="search" />
          <input value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="Buscar por nombre o cédula..." />
        </label>
      </div>
      <div className="coach-tabla-scroll">
        <table className="admin-table coach-tabla pc-tabla-participantes">
          <thead>
            <tr>
              <th>Participante</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {visibles.map((inscrito) => (
              <tr key={inscrito.id_inscripcion}>
                <td>
                  <strong>{inscrito.nombre || inscrito.cliente_cedula}</strong>
                  <span>{inscrito.cliente_cedula}</span>
                </td>
                <td><BadgeEstado estado={inscrito.estado} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {visibles.length === 0 && <p className="admin-empty coach-sin-resultados">Ningún participante coincide con la búsqueda.</p>}
      </div>
    </>
  );
}

function ContenidoTaller({ datos }) {
  const { tallerSeleccionado, detalleTaller, nota, setNota, guardandoNota, errorDetalle, enviarNota, recargarDetalle } = datos;
  const [pestana, setPestana] = useState("participantes");

  const pestanas = [
    { id: "participantes", etiqueta: `Participantes (${detalleTaller.clientes_inscritos.length})` },
    { id: "asistencia", etiqueta: "Asistencia" },
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
        {detalleTaller.coach && ` · Coach: ${detalleTaller.coach}`}
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

      {pestana === "participantes" && <ParticipantesTaller inscritos={detalleTaller.clientes_inscritos} />}

      {pestana === "asistencia" && (
        <AsistenciaTaller
          taller={detalleTaller.taller}
          onGuardada={() => recargarDetalle(tallerSeleccionado.id_taller).catch(() => {})}
        />
      )}

      {pestana === "bitacora" && (
        <>
          <form className="admin-form coach-actividad-form" onSubmit={enviarNota}>
            <label>
              Registrar actividad de apoyo
              <textarea
                value={nota}
                onChange={(event) => setNota(event.target.value)}
                placeholder="Describe el apoyo realizado: logística, materiales, acompañamiento a participantes..."
                required
              />
            </label>
            {errorDetalle && <p className="admin-alert admin-alert-error">{errorDetalle}</p>}
            <div className="admin-form-actions">
              <button type="submit" className="admin-primary-button" disabled={guardandoNota || !nota.trim()}>
                {guardandoNota ? "Guardando..." : "Registrar"}
              </button>
            </div>
          </form>
          <BitacoraCoach notas={detalleTaller.notas} />
        </>
      )}
    </div>
  );
}

function TallerDetalleModal({ datos }) {
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

export default TallerDetalleModal;
