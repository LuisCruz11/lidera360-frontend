import { useMemo, useState } from "react";
import IconoAdmin from "../coordinador/IconoAdmin";
import { BadgeEstado } from "../coordinador/PanelComponentes";
import { normalizar } from "./utils";

const FILTROS = [
  { id: "todos", etiqueta: "Todos" },
  { id: "pendientes", etiqueta: "Por evaluar" },
  { id: "aprobados", etiqueta: "Aprobados" },
  { id: "no-aprobados", etiqueta: "No aprobados" },
];

const grupoEstado = (estado = "") => {
  const texto = normalizar(estado);
  if (texto.includes("no aprob") || texto.includes("reprob")) return "no-aprobados";
  if (texto.includes("aprob")) return "aprobados";
  return "pendientes";
};

function ParticipantesCoach({ inscritos, estadosEvaluacion, evaluaciones, evaluandoId, cambiarEvaluacion, guardarEvaluacion }) {
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("todos");

  const conteos = useMemo(() => {
    const totales = { todos: inscritos.length, pendientes: 0, aprobados: 0, "no-aprobados": 0 };
    inscritos.forEach((inscrito) => {
      totales[grupoEstado(inscrito.estado)] += 1;
    });
    return totales;
  }, [inscritos]);

  const visibles = useMemo(() => {
    const texto = normalizar(busqueda.trim());
    return inscritos.filter((inscrito) => {
      if (filtro !== "todos" && grupoEstado(inscrito.estado) !== filtro) return false;
      if (!texto) return true;
      return [inscrito.nombre, inscrito.cliente_cedula].some((valor) => normalizar(valor || "").includes(texto));
    });
  }, [busqueda, filtro, inscritos]);

  if (inscritos.length === 0) {
    return <p className="admin-empty">No hay participantes inscritos en este taller.</p>;
  }

  return (
    <>
      <div className="coach-participantes-toolbar">
        <div className="coach-filtros" role="group" aria-label="Filtrar participantes por estado">
          {FILTROS.map((opcion) => (
            <button
              type="button"
              key={opcion.id}
              className={`coach-filtro ${filtro === opcion.id ? "coach-filtro-activo" : ""}`}
              aria-pressed={filtro === opcion.id}
              onClick={() => setFiltro(opcion.id)}
            >
              {opcion.etiqueta} <span>{conteos[opcion.id]}</span>
            </button>
          ))}
        </div>
        <label className="admin-search coach-buscador">
          <IconoAdmin tipo="search" />
          <input
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            placeholder="Buscar por nombre o cédula..."
          />
        </label>
      </div>

      <div className="coach-tabla-scroll">
        <table className="admin-table coach-tabla">
          <thead>
            <tr>
              <th>Participante</th>
              <th>Estado actual</th>
              <th>Evaluación</th>
              <th>Observación</th>
              <th aria-label="Acción" />
            </tr>
          </thead>
          <tbody>
            {visibles.map((inscrito) => {
              const evaluacion = evaluaciones[inscrito.id_inscripcion] || { id_estado: "", observacion: "" };
              const nombre = inscrito.nombre || inscrito.cliente_cedula;
              const sinCambios = String(evaluacion.id_estado) === String(inscrito.id_estado ?? "") && !evaluacion.observacion;
              return (
                <tr key={inscrito.id_inscripcion}>
                  <td>
                    <strong>{nombre}</strong>
                    <span>{inscrito.cliente_cedula}</span>
                  </td>
                  <td><BadgeEstado estado={inscrito.estado} /></td>
                  <td>
                    <select
                      aria-label={`Evaluación de ${nombre}`}
                      value={evaluacion.id_estado}
                      onChange={(event) => cambiarEvaluacion(inscrito.id_inscripcion, "id_estado", event.target.value)}
                    >
                      <option value="">Selecciona</option>
                      {estadosEvaluacion.map((estado) => (
                        <option value={estado.id_estado} key={estado.id_estado}>
                          {estado.nombre}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      aria-label={`Observación para ${nombre}`}
                      value={evaluacion.observacion}
                      onChange={(event) => cambiarEvaluacion(inscrito.id_inscripcion, "observacion", event.target.value)}
                      placeholder="Opcional"
                      maxLength={250}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="admin-primary-button coach-evaluar"
                      disabled={!evaluacion.id_estado || sinCambios || evaluandoId === inscrito.id_inscripcion}
                      onClick={() => guardarEvaluacion(inscrito.id_inscripcion)}
                    >
                      {evaluandoId === inscrito.id_inscripcion ? "Guardando..." : "Guardar"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {visibles.length === 0 && <p className="admin-empty coach-sin-resultados">Ningún participante coincide con la búsqueda.</p>}
      </div>
    </>
  );
}

export default ParticipantesCoach;
