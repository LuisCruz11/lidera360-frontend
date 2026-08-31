import IconoAdmin from "./IconoAdmin";
import { AccionesFila, BadgeEstado, EstadoVacio } from "./PanelComponentes";
import { nombreCompleto } from "./utils";

function ClientesPanel({ datos }) {
  const {
    clientesFiltrados,
    busqueda,
    setBusqueda,
    abrirModalCrear,
    abrirModalEditar,
    eliminarRegistro,
    progresoPorCliente,
    obtenerTipo,
    obtenerEstado,
    cargando,
  } = datos;

  return (
    <>
      <header className="admin-header admin-header-actions">
        <h2>Clientes</h2>
        <div className="admin-actions">
          <label className="admin-search">
            <IconoAdmin tipo="search" />
            <input value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="Buscar clientes..." />
          </label>
          <button type="button" className="admin-primary-button" onClick={() => abrirModalCrear("cliente")}>
            <IconoAdmin tipo="plus" />
            Nuevo Cliente
          </button>
        </div>
      </header>

      <section className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Cédula</th>
              <th>Nombre</th>
              <th>Nivel</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map((cliente) => {
              const progreso = progresoPorCliente.get(String(cliente.cedula));
              return (
                <tr key={cliente.cedula}>
                  <td>{cliente.cedula}</td>
                  <td>{nombreCompleto(cliente)}</td>
                  <td>{obtenerTipo(progreso?.id_tipo_taller) || "Sin nivel"}</td>
                  <td><BadgeEstado estado={obtenerEstado(cliente.id_estado)} /></td>
                  <td className="admin-table-actions">
                    <AccionesFila
                      onEditar={() => abrirModalEditar("cliente", cliente)}
                      onEliminar={() => eliminarRegistro("cliente", cliente.cedula)}
                      etiqueta="cliente"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {clientesFiltrados.length === 0 && <EstadoVacio cargando={cargando} texto="No hay clientes para mostrar." />}
      </section>
    </>
  );
}

export default ClientesPanel;
