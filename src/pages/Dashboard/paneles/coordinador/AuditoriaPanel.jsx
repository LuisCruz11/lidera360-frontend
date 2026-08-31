import { formatearFecha, ordenarPorFechaDesc } from "./utils";

function AuditoriaPanel({ datos }) {
  const { auditorias } = datos;

  return (
    <>
      <header className="admin-header">
        <h2>Auditoría</h2>
      </header>
      <section className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tabla</th>
              <th>Acción</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {ordenarPorFechaDesc(auditorias, "fecha").map((auditoria) => (
              <tr key={auditoria.id_auditoria}>
                <td>{formatearFecha(auditoria.fecha)}</td>
                <td>{auditoria.tabla || "Sin tabla"}</td>
                <td>{auditoria.accion || "Sin acción"}</td>
                <td>{auditoria.descripcion || "Sin descripción"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {auditorias.length === 0 && <p className="admin-empty">No hay auditoría registrada.</p>}
      </section>
    </>
  );
}

export default AuditoriaPanel;
