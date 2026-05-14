import { useMemo } from "react";
import { IconoAdmin } from "../utils/IconoAdmin";
import { normalizar, crearMapa } from "../utils/helpers";

export function Clientes({
  clientes,
  busqueda,
  setBusqueda,
  abrirModal,
  obtenerTipo,
  obtenerEstado,
  progresoPorCliente,
  cargando,
  renderBadgeEstado,
  renderAccionEliminar,
}) {
  const clientesFiltrados = useMemo(() => {
    const texto = normalizar(busqueda);
    if (!texto) return clientes;
    return clientes.filter((cliente) =>
      [cliente.cedula, cliente.nombres, cliente.apellidos, cliente.correo].some((valor) => normalizar(valor).includes(texto))
    );
  }, [busqueda, clientes]);

  const renderVacio = (texto) => <p className="admin-empty">{cargando ? "Cargando información..." : texto}</p>;

  const nombreCompleto = (persona = {}) =>
    `${persona.nombres || ""} ${persona.apellidos || ""}`.trim() || persona.username || persona.cedula || "Sin nombre";

  return (
    <>
      <header className="admin-header admin-header-actions">
        <h2>Clientes</h2>
        <div className="admin-actions">
          <label className="admin-search">
            <IconoAdmin tipo="search" />
            <input value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="Buscar clientes..." />
          </label>
          <button type="button" className="admin-primary-button" onClick={() => abrirModal("cliente")}>
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
                  <td>{renderBadgeEstado(obtenerEstado(cliente.id_estado))}</td>
                  <td className="admin-table-actions">{renderAccionEliminar("cliente", cliente.cedula, "Eliminar cliente")}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {clientesFiltrados.length === 0 && renderVacio("No hay clientes para mostrar.")}
      </section>
    </>
  );
}
