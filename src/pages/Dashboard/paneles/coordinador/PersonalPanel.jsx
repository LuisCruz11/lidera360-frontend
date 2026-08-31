import IconoAdmin from "./IconoAdmin";
import { AccionesFila, BadgeEstado, EstadoVacio } from "./PanelComponentes";
import { nombreCompleto } from "./utils";

function PersonalPanel({ datos }) {
  const {
    personalFiltrado,
    busqueda,
    setBusqueda,
    abrirModalCrear,
    abrirModalEditar,
    eliminarRegistro,
    usuarioPorPersonal,
    obtenerRol,
    cargando,
  } = datos;

  return (
    <>
      <header className="admin-header admin-header-actions">
        <h2>Personal</h2>
        <div className="admin-actions">
          <label className="admin-search">
            <IconoAdmin tipo="search" />
            <input value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="Buscar personal..." />
          </label>
          <button type="button" className="admin-primary-button" onClick={() => abrirModalCrear("personal")}>
            <IconoAdmin tipo="plus" />
            Nuevo Personal
          </button>
        </div>
      </header>

      <section className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Contacto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {personalFiltrado.map((persona) => {
              const usuarioPersonal = usuarioPorPersonal.get(String(persona.cedula));
              return (
                <tr key={persona.cedula}>
                  <td>{nombreCompleto(persona)}</td>
                  <td>{usuarioPersonal?.username || "Sin usuario"}</td>
                  <td><BadgeEstado estado={obtenerRol(persona.id_rol)} /></td>
                  <td>
                    <strong>{persona.correo || "Sin correo"}</strong>
                    <span>{persona.telefono || "Sin teléfono"}</span>
                  </td>
                  <td className="admin-table-actions">
                    <AccionesFila
                      onEditar={() => abrirModalEditar("personal", persona)}
                      onEliminar={() => eliminarRegistro("personal", persona.cedula)}
                      etiqueta="personal"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {personalFiltrado.length === 0 && <EstadoVacio cargando={cargando} texto="No hay personal para mostrar." />}
      </section>
    </>
  );
}

export default PersonalPanel;
