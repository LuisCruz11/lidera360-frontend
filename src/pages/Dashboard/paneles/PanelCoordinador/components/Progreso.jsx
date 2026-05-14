import { useMemo } from "react";
import { normalizar, crearMapa, ordenarPorFechaDesc } from "../utils/helpers";

export function Progreso({ clientes, inscripciones, obtenerEstado, obtenerNombreTaller, obtenerTipo, progresos, cargando, renderBadgeEstado }) {
  const renderVacio = (texto) => <p className="admin-empty">{cargando ? "Cargando información..." : texto}</p>;

  const nombreCompleto = (persona = {}) =>
    `${persona.nombres || ""} ${persona.apellidos || ""}`.trim() || persona.username || persona.cedula || "Sin nombre";

  const progresoPorCliente = useMemo(
    () => new Map(progresos.map((progreso) => [String(progreso.cliente_cedula), progreso])),
    [progresos]
  );

  const resumenProgreso = useMemo(() => {
    return clientes.map((cliente) => {
      const inscripcionesCliente = inscripciones.filter((inscripcion) => inscripcion.cliente_cedula === cliente.cedula);
      const inscripcionesOrdenadas = ordenarPorFechaDesc(inscripcionesCliente, "fecha_inscripcion");
      const progreso = progresoPorCliente.get(String(cliente.cedula));
      const completados = inscripcionesCliente.filter((inscripcion) =>
        normalizar(obtenerEstado(inscripcion.id_estado)).includes("finalizado")
      ).length;
      const activas = inscripcionesCliente.filter((inscripcion) => {
        const estado = normalizar(obtenerEstado(inscripcion.id_estado));
        return estado && !estado.includes("finalizado") && !estado.includes("inactivo");
      }).length;

      return {
        cliente,
        nivel: obtenerTipo(progreso?.id_tipo_taller),
        completados,
        activas,
        ultimoTaller: obtenerNombreTaller(inscripcionesOrdenadas[0]?.id_taller),
        estado: obtenerEstado(cliente.id_estado),
      };
    });
  }, [clientes, inscripciones, obtenerEstado, obtenerNombreTaller, obtenerTipo, progresoPorCliente]);

  return (
    <>
      <header className="admin-header">
        <h2>Progreso de Clientes</h2>
        <p>Visión general del avance de cada cliente en el programa.</p>
      </header>

      <section className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Nivel Actual</th>
              <th>Talleres Completados</th>
              <th>Inscripciones Activas</th>
              <th>Último Taller</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {resumenProgreso.map((fila) => (
              <tr key={fila.cliente.cedula}>
                <td>
                  <strong>{nombreCompleto(fila.cliente)}</strong>
                  <span>{fila.cliente.cedula}</span>
                </td>
                <td>{fila.nivel || "Sin nivel"}</td>
                <td>
                  <span className="admin-count-pill">{fila.completados}</span>
                </td>
                <td>
                  <span className="admin-count-pill admin-count-active">{fila.activas}</span>
                </td>
                <td>{fila.ultimoTaller || "Sin taller"}</td>
                <td>{renderBadgeEstado(fila.estado)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {resumenProgreso.length === 0 && renderVacio("No hay progreso para mostrar.")}
      </section>
    </>
  );
}
