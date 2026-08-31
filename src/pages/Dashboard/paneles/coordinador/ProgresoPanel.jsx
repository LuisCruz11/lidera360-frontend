import { BadgeEstado, EstadoVacio } from "./PanelComponentes";
import { nombreCompleto } from "./utils";

function ProgresoPanel({ datos }) {
  const { resumenProgreso, cargando } = datos;

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
                <td><BadgeEstado estado={fila.estado} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {resumenProgreso.length === 0 && <EstadoVacio cargando={cargando} texto="No hay progreso para mostrar." />}
      </section>
    </>
  );
}

export default ProgresoPanel;
