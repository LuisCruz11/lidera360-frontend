import IconoAdmin from "../coordinador/IconoAdmin";
import { BadgeEstado, EstadoVacio } from "../coordinador/PanelComponentes";
import { formatearRangoFechas } from "./utils";

function TalleresPanel({ datos }) {
  const { talleresFiltrados, busqueda, setBusqueda, obtenerTipo, obtenerEstado, abrirDetalleTaller, cargando } = datos;

  return (
    <>
      <header className="admin-header admin-header-actions">
        <h2>Talleres</h2>
        <div className="admin-actions">
          <label className="admin-search">
            <IconoAdmin tipo="search" />
            <input value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="Buscar talleres..." />
          </label>
        </div>
      </header>

      <section className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Fechas</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {talleresFiltrados.map((taller) => (
              <tr key={taller.id_taller}>
                <td>{taller.nombre}</td>
                <td>{obtenerTipo(taller.id_tipo_taller) || "Sin tipo"}</td>
                <td>{formatearRangoFechas(taller.fecha_inicio, taller.fecha_fin)}</td>
                <td><BadgeEstado estado={obtenerEstado(taller.id_estado)} /></td>
                <td className="admin-table-actions">
                  <button type="button" className="admin-link-button" onClick={() => abrirDetalleTaller(taller)}>
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {talleresFiltrados.length === 0 && <EstadoVacio cargando={cargando} texto="No hay talleres para mostrar." />}
      </section>
    </>
  );
}

export default TalleresPanel;
