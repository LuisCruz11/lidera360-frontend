import IconoAdmin from "../coordinador/IconoAdmin";
import { BadgeEstado, EstadoVacio } from "../coordinador/PanelComponentes";
import { nombreCompleto } from "./utils";

function ClientesPanel({ datos }) {
  const { clientesFiltrados, busqueda, setBusqueda, obtenerEstado, cargando } = datos;

  return (
    <>
      <header className="admin-header admin-header-actions">
        <h2>Clientes</h2>
        <div className="admin-actions">
          <label className="admin-search">
            <IconoAdmin tipo="search" />
            <input value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="Buscar clientes..." />
          </label>
        </div>
      </header>

      <section className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Cédula</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map((cliente) => (
              <tr key={cliente.cedula}>
                <td>{cliente.cedula}</td>
                <td>{nombreCompleto(cliente)}</td>
                <td>{cliente.correo || "Sin correo"}</td>
                <td><BadgeEstado estado={obtenerEstado(cliente.id_estado)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {clientesFiltrados.length === 0 && <EstadoVacio cargando={cargando} texto="No hay clientes para mostrar." />}
      </section>
    </>
  );
}

export default ClientesPanel;
