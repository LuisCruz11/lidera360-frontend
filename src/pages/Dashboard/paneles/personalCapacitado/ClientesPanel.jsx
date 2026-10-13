import IconoAdmin from "../coordinador/IconoAdmin";
import { BadgeEstado, EstadoVacio } from "../coordinador/PanelComponentes";
import { nombreCompleto } from "./utils";

function ClientesPanel({ datos }) {
  const { clientesFiltrados, busqueda, setBusqueda, cargando } = datos;

  return (
    <>
      <header className="admin-header admin-header-actions">
        <h2>Mis Participantes</h2>
        <div className="admin-actions">
          <label className="admin-search">
            <IconoAdmin tipo="search" />
            <input value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="Buscar participantes..." />
          </label>
        </div>
      </header>

      <section className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Participante</th>
              <th>Contacto</th>
              <th>Talleres</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map((cliente) => (
              <tr key={cliente.cedula}>
                <td>
                  <strong>{nombreCompleto(cliente)}</strong>
                  <span>{cliente.cedula}</span>
                </td>
                <td>
                  <strong>{cliente.correo || "Sin correo"}</strong>
                  <span>{cliente.telefono || "Sin teléfono"}</span>
                </td>
                <td>{cliente.talleres || "Sin talleres"}</td>
                <td><BadgeEstado estado={cliente.estado} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {clientesFiltrados.length === 0 && (
          <EstadoVacio cargando={cargando} texto="No hay participantes inscritos en tus talleres." />
        )}
      </section>
    </>
  );
}

export default ClientesPanel;
