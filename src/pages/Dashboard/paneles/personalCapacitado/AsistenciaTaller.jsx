import { useCallback, useEffect, useMemo, useState } from "react";
import { obtenerAsistenciaTaller, registrarAsistenciaTaller } from "../../../../api/personalCapacitadoApi";
import IconoAdmin from "../coordinador/IconoAdmin";
import { formatearFecha, normalizar } from "./utils";

const fechaLocalISO = (fecha = new Date()) => {
  const desfase = fecha.getTimezoneOffset() * 60000;
  return new Date(fecha.getTime() - desfase).toISOString().slice(0, 10);
};

// Fecha por defecto: hoy, ajustada al rango del taller. Null si el taller aún no comienza.
const fechaInicial = (inicio, fin) => {
  const hoy = fechaLocalISO();
  if (inicio && hoy < inicio) return null;
  if (fin && hoy > fin) return fin;
  return hoy;
};

function AsistenciaTaller({ taller, onGuardada }) {
  const inicio = (taller.fecha_inicio || "").slice(0, 10);
  const fin = (taller.fecha_fin || "").slice(0, 10);
  const hoy = fechaLocalISO();
  const maximo = fin && fin < hoy ? fin : hoy;

  const [fecha, setFecha] = useState(() => fechaInicial(inicio, fin));
  const [participantes, setParticipantes] = useState([]);
  const [marcas, setMarcas] = useState({});
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const cargar = useCallback(async () => {
    if (!fecha) return;
    setCargando(true);
    setError("");
    try {
      const respuesta = await obtenerAsistenciaTaller(taller.id_taller, fecha);
      const lista = respuesta.data?.participantes || [];
      setParticipantes(lista);
      setMarcas(Object.fromEntries(lista.map((p) => [p.id_inscripcion, p.asistio ?? true])));
    } catch (err) {
      setParticipantes([]);
      setError(err.response?.data?.mensaje || "No se pudo cargar la asistencia.");
    } finally {
      setCargando(false);
    }
  }, [fecha, taller.id_taller]);

  useEffect(() => {
    queueMicrotask(cargar);
  }, [cargar]);

  const yaRegistrada = participantes.some((p) => p.asistio !== null);
  const presentes = participantes.filter((p) => marcas[p.id_inscripcion]).length;

  const visibles = useMemo(() => {
    const texto = normalizar(busqueda.trim());
    if (!texto) return participantes;
    return participantes.filter((p) => [p.nombre, p.cliente_cedula].some((valor) => normalizar(valor || "").includes(texto)));
  }, [busqueda, participantes]);

  const marcarTodos = (valor) => {
    setMarcas(Object.fromEntries(participantes.map((p) => [p.id_inscripcion, valor])));
  };

  const guardar = async () => {
    if (guardando || participantes.length === 0) return;
    setGuardando(true);
    setMensaje("");
    setError("");
    try {
      const respuesta = await registrarAsistenciaTaller(taller.id_taller, {
        fecha,
        registros: participantes.map((p) => ({ id_inscripcion: p.id_inscripcion, asistio: Boolean(marcas[p.id_inscripcion]) })),
      });
      setMensaje(`Asistencia del ${formatearFecha(fecha)} guardada: ${respuesta.data.presentes} de ${respuesta.data.total} presentes.`);
      await cargar();
      onGuardada?.();
    } catch (err) {
      setError(err.response?.data?.mensaje || "No se pudo guardar la asistencia.");
    } finally {
      setGuardando(false);
    }
  };

  if (!fecha) {
    return (
      <p className="admin-empty">
        El taller comienza el {formatearFecha(inicio)}. Podrás registrar asistencia desde ese día.
      </p>
    );
  }

  return (
    <>
      <div className="coach-participantes-toolbar">
        <label className="pc-fecha-sesion">
          Fecha de la sesión
          <input
            type="date"
            value={fecha}
            min={inicio || undefined}
            max={maximo}
            onChange={(event) => {
              setMensaje("");
              if (event.target.value) setFecha(event.target.value);
            }}
          />
        </label>
        <label className="admin-search coach-buscador">
          <IconoAdmin tipo="search" />
          <input value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="Buscar participante..." />
        </label>
      </div>

      {mensaje && <p className="admin-alert admin-alert-success">{mensaje}</p>}
      {error && <p className="admin-alert admin-alert-error">{error}</p>}

      {cargando ? (
        <p className="admin-empty">Cargando asistencia...</p>
      ) : participantes.length === 0 ? (
        !error && <p className="admin-empty">No hay participantes inscritos en este taller.</p>
      ) : (
        <>
          <div className="pc-asistencia-resumen">
            <span>
              {yaRegistrada ? "Asistencia registrada para este día" : "Aún no se registra la asistencia de este día"}
              {" · "}
              <strong>
                {presentes} de {participantes.length} presentes
              </strong>
            </span>
            <div>
              <button type="button" className="coach-filtro" onClick={() => marcarTodos(true)}>
                Todos presentes
              </button>
              <button type="button" className="coach-filtro" onClick={() => marcarTodos(false)}>
                Todos ausentes
              </button>
            </div>
          </div>

          <div className="coach-tabla-scroll">
            <table className="admin-table coach-tabla pc-tabla-asistencia">
              <thead>
                <tr>
                  <th>Participante</th>
                  <th>Asistencia acumulada</th>
                  <th>¿Asistió?</th>
                </tr>
              </thead>
              <tbody>
                {visibles.map((p) => {
                  const porcentaje = p.sesiones > 0 ? Math.round((p.asistencias / p.sesiones) * 100) : null;
                  return (
                    <tr key={p.id_inscripcion}>
                      <td>
                        <strong>{p.nombre || p.cliente_cedula}</strong>
                        <span>{p.cliente_cedula}</span>
                      </td>
                      <td>
                        {porcentaje === null ? (
                          "Sin sesiones registradas"
                        ) : (
                          <>
                            <strong>{porcentaje}%</strong>
                            <span>
                              {p.asistencias} de {p.sesiones} sesiones
                            </span>
                          </>
                        )}
                      </td>
                      <td>
                        <label className="pc-check">
                          <input
                            type="checkbox"
                            checked={Boolean(marcas[p.id_inscripcion])}
                            onChange={(event) =>
                              setMarcas((actuales) => ({ ...actuales, [p.id_inscripcion]: event.target.checked }))
                            }
                          />
                          {marcas[p.id_inscripcion] ? "Presente" : "Ausente"}
                        </label>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {visibles.length === 0 && <p className="admin-empty coach-sin-resultados">Ningún participante coincide con la búsqueda.</p>}
          </div>

          <div className="admin-form-actions">
            <button type="button" className="admin-primary-button" onClick={guardar} disabled={guardando}>
              {guardando ? "Guardando..." : yaRegistrada ? "Actualizar asistencia" : "Guardar asistencia"}
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default AsistenciaTaller;
