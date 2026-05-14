import { useMemo } from "react";
import { IconoAdmin } from "../utils/IconoAdmin";
import { normalizar, crearMapa, ordenarPorFechaDesc, formatearFecha } from "../utils/helpers";

export function Panel({ clientes, talleres, inscripciones, tiposTaller, progresos, estados, obtenerEstado }) {
  const estadisticas = useMemo(() => {
    const activos = clientes.filter((cliente) => normalizar(obtenerEstado(cliente.id_estado)).includes("activo")).length;
    const talleresActivos = talleres.filter((taller) => {
      const estado = normalizar(obtenerEstado(taller.id_estado));
      return estado && !estado.includes("finalizado") && !estado.includes("inactivo");
    }).length;

    const progresoPorCliente = new Map(progresos.map((progreso) => [String(progreso.cliente_cedula), progreso]));

    const niveles = tiposTaller.map((tipo) => ({
      id_tipo_taller: tipo.id_tipo_taller,
      nombre: tipo.nombre,
      total: clientes.filter((cliente) => {
        const progreso = progresoPorCliente.get(String(cliente.cedula));
        return String(progreso?.id_tipo_taller) === String(tipo.id_tipo_taller);
      }).length,
    }));

    return {
      totalClientes: clientes.length,
      clientesActivos: activos,
      talleresActivos,
      totalInscripciones: inscripciones.length,
      niveles,
    };
  }, [clientes, inscripciones.length, obtenerEstado, progresos, talleres, tiposTaller]);

  const inscripcionesRecientes = useMemo(
    () => ordenarPorFechaDesc(inscripciones, "fecha_inscripcion").slice(0, 5),
    [inscripciones]
  );

  const clientePorCedula = useMemo(() => crearMapa(clientes, "cedula"), [clientes]);
  const tallerPorId = useMemo(() => crearMapa(talleres, "id_taller"), [talleres]);

  const obtenerNombreCliente = (cedula) =>
    `${clientePorCedula.get(String(cedula))?.nombres || ""} ${clientePorCedula.get(String(cedula))?.apellidos || ""}`.trim() ||
    clientePorCedula.get(String(cedula))?.username || cedula || "Sin nombre";

  const obtenerNombreTaller = (idTaller) => tallerPorId.get(String(idTaller))?.nombre || `Taller ${idTaller}`;

  const renderVacio = (texto) => <p className="admin-empty">{texto}</p>;

  return (
    <>
      <header className="admin-header">
        <h2>Panel</h2>
      </header>

      <section className="admin-stat-grid" aria-label="Resumen general">
        <article className="admin-stat">
          <span>Total Clientes</span>
          <strong>{estadisticas.totalClientes}</strong>
          <small>{estadisticas.clientesActivos} activos actualmente</small>
        </article>
        <article className="admin-stat">
          <span>Talleres Activos</span>
          <strong>{estadisticas.talleresActivos}</strong>
          <small>En progreso o planificados</small>
        </article>
        <article className="admin-stat">
          <span>Total Inscripciones</span>
          <strong>{estadisticas.totalInscripciones}</strong>
          <small>Histórico general</small>
        </article>
      </section>

      <div className="admin-dashboard-grid">
        <section className="admin-panel-box">
          <h3>Inscripciones Recientes</h3>
          {inscripcionesRecientes.length === 0
            ? renderVacio("No hay inscripciones registradas.")
            : inscripcionesRecientes.map((inscripcion) => (
                <article className="admin-recent-row" key={inscripcion.id_inscripcion}>
                  <div>
                    <strong>{obtenerNombreCliente(inscripcion.cliente_cedula)}</strong>
                    <span>{obtenerNombreTaller(inscripcion.id_taller)}</span>
                  </div>
                  <time>{formatearFecha(inscripcion.fecha_inscripcion)}</time>
                </article>
              ))}
        </section>

        <section className="admin-panel-box">
          <h3>Niveles de Clientes</h3>
          {estadisticas.niveles.length === 0
            ? renderVacio("No hay niveles registrados.")
            : estadisticas.niveles.map((nivel) => (
                <article className="admin-level-row" key={nivel.id_tipo_taller}>
                  <span>{nivel.nombre}</span>
                  <strong>{nivel.total}</strong>
                </article>
              ))}
        </section>
      </div>
    </>
  );
}
