import { useMemo, useState } from "react";
import IconoAdmin from "../coordinador/IconoAdmin";
import { etiquetaRegistro, formatearFechaHora, normalizar } from "./utils";

const POR_PAGINA = 15;

const FILTROS = [
  { id: "todos", etiqueta: "Todo" },
  { id: "actividad", etiqueta: "Actividades" },
  { id: "evaluacion", etiqueta: "Evaluaciones" },
  { id: "avance_nivel", etiqueta: "Avances de nivel" },
  { id: "nota", etiqueta: "Apoyo" },
  { id: "asistencia", etiqueta: "Asistencia" },
  { id: "otros", etiqueta: "Otros" },
];

const TIPOS = ["actividad", "evaluacion", "avance_nivel", "nota", "asistencia"];

const tipoRegistro = (accion = "") => {
  const valor = normalizar(accion);
  return TIPOS.includes(valor) ? valor : "otros";
};

function BitacoraCoach({ notas }) {
  const [filtro, setFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [visibles, setVisibles] = useState(POR_PAGINA);

  const conteos = useMemo(() => {
    const totales = { todos: notas.length, otros: 0, ...Object.fromEntries(TIPOS.map((tipo) => [tipo, 0])) };
    notas.forEach((nota) => {
      totales[tipoRegistro(nota.accion)] += 1;
    });
    return totales;
  }, [notas]);

  const filtradas = useMemo(() => {
    const texto = normalizar(busqueda.trim());
    return notas.filter((nota) => {
      if (filtro !== "todos" && tipoRegistro(nota.accion) !== filtro) return false;
      if (!texto) return true;
      return [nota.descripcion, nota.usuario].some((valor) => normalizar(valor || "").includes(texto));
    });
  }, [busqueda, filtro, notas]);

  const cambiarFiltro = (nuevoFiltro) => {
    setFiltro(nuevoFiltro);
    setVisibles(POR_PAGINA);
  };

  const cambiarBusqueda = (valor) => {
    setBusqueda(valor);
    setVisibles(POR_PAGINA);
  };

  if (notas.length === 0) {
    return <p className="admin-empty">Aún no hay actividades registradas.</p>;
  }

  return (
    <>
      <div className="coach-participantes-toolbar">
        <div className="coach-filtros" role="group" aria-label="Filtrar bitácora por tipo">
          {FILTROS.filter((opcion) => opcion.id === "todos" || conteos[opcion.id] > 0).map((opcion) => (
            <button
              type="button"
              key={opcion.id}
              className={`coach-filtro ${filtro === opcion.id ? "coach-filtro-activo" : ""}`}
              aria-pressed={filtro === opcion.id}
              onClick={() => cambiarFiltro(opcion.id)}
            >
              {opcion.etiqueta} <span>{conteos[opcion.id]}</span>
            </button>
          ))}
        </div>
        <label className="admin-search coach-buscador">
          <IconoAdmin tipo="search" />
          <input value={busqueda} onChange={(event) => cambiarBusqueda(event.target.value)} placeholder="Buscar en la bitácora..." />
        </label>
      </div>

      {filtradas.length === 0 ? (
        <p className="admin-empty">Ningún registro coincide con la búsqueda.</p>
      ) : (
        <ul className="admin-notas-lista coach-bitacora-lista">
          {filtradas.slice(0, visibles).map((registro) => (
            <li key={registro.id_auditoria} className={`coach-registro coach-registro-${tipoRegistro(registro.accion)}`}>
              <p>{registro.descripcion}</p>
              <span>
                {etiquetaRegistro(registro.accion)} · {registro.usuario || "Usuario"} · {formatearFechaHora(registro.fecha)}
              </span>
            </li>
          ))}
        </ul>
      )}

      {filtradas.length > visibles && (
        <div className="coach-ver-mas">
          <span>
            Mostrando {visibles} de {filtradas.length}
          </span>
          <button type="button" className="admin-link-button" onClick={() => setVisibles((actual) => actual + POR_PAGINA)}>
            Ver más
          </button>
        </div>
      )}
    </>
  );
}

export default BitacoraCoach;
