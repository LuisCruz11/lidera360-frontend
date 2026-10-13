import { useMemo, useState } from "react";
import IconoAdmin from "./IconoAdmin";
import { EstadoVacio } from "./PanelComponentes";
import { formatearFechaHora, normalizar } from "./utils";

const POR_PAGINA = 50;

const MODULOS = {
  clientes: "Clientes",
  taller: "Talleres",
  personal: "Personal",
  inscripcion: "Inscripciones",
  usuarios: "Usuarios",
  estados: "Estados",
  roles: "Roles",
  tipo_taller: "Niveles",
  progreso_cliente: "Progreso",
  taller_personal: "Asignaciones",
  reportes: "Reportes",
  asistencia: "Asistencia",
};

const ACCIONES = {
  crear: "Crear",
  actualizar: "Actualizar",
  eliminar: "Eliminar",
  generar: "Generar",
  nota: "Nota",
  actividad: "Actividad",
  evaluacion: "Evaluación",
  avance_nivel: "Avance de nivel",
  cancelacion: "Cancelación",
  asistencia: "Asistencia",
};

const nombreModulo = (tabla) => MODULOS[tabla] || tabla || "Sin módulo";
const nombreAccion = (accion) => ACCIONES[accion] || accion || "Sin acción";

function AuditoriaPanel({ datos }) {
  const { auditorias, cargando } = datos;
  const [busqueda, setBusqueda] = useState("");
  const [modulo, setModulo] = useState("");
  const [visibles, setVisibles] = useState(POR_PAGINA);

  const modulosDisponibles = useMemo(
    () => [...new Set(auditorias.map((registro) => registro.tabla).filter(Boolean))].sort(),
    [auditorias]
  );

  const filtradas = useMemo(() => {
    const texto = normalizar(busqueda.trim());
    return auditorias.filter((registro) => {
      if (modulo && registro.tabla !== modulo) return false;
      if (!texto) return true;
      return [registro.usuario, registro.rol, registro.descripcion, registro.taller, nombreAccion(registro.accion)]
        .some((valor) => normalizar(valor || "").includes(texto));
    });
  }, [auditorias, busqueda, modulo]);

  const reiniciarPaginas = () => setVisibles(POR_PAGINA);

  return (
    <>
      <header className="admin-header admin-header-actions">
        <div>
          <h2>Auditoría</h2>
        </div>
        <div className="admin-actions">
          <select
            className="auditoria-modulo"
            value={modulo}
            onChange={(event) => {
              setModulo(event.target.value);
              reiniciarPaginas();
            }}
            aria-label="Filtrar por módulo"
          >
            <option value="">Todos los módulos</option>
            {modulosDisponibles.map((tabla) => (
              <option value={tabla} key={tabla}>
                {nombreModulo(tabla)}
              </option>
            ))}
          </select>
          <label className="admin-search">
            <IconoAdmin tipo="search" />
            <input
              value={busqueda}
              onChange={(event) => {
                setBusqueda(event.target.value);
                reiniciarPaginas();
              }}
              placeholder="Buscar usuario o descripción..."
            />
          </label>
        </div>
      </header>

      <section className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Fecha y hora</th>
              <th>Usuario</th>
              <th>Módulo</th>
              <th>Acción</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.slice(0, visibles).map((registro) => (
              <tr key={registro.id_auditoria}>
                <td className="auditoria-fecha">{formatearFechaHora(registro.fecha)}</td>
                <td>
                  <strong>{registro.usuario || "Usuario eliminado"}</strong>
                  {registro.rol && <span>{registro.rol}</span>}
                </td>
                <td>{nombreModulo(registro.tabla)}</td>
                <td>
                  <span className={`auditoria-accion auditoria-accion-${registro.accion}`}>{nombreAccion(registro.accion)}</span>
                </td>
                <td className="auditoria-descripcion">
                  {registro.descripcion || "Sin descripción"}
                  {registro.taller && <span>Taller: {registro.taller}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtradas.length === 0 && <EstadoVacio cargando={cargando} texto="No hay registros de auditoría para mostrar." />}
      </section>

      {filtradas.length > visibles && (
        <div className="coach-ver-mas auditoria-ver-mas">
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

export default AuditoriaPanel;
