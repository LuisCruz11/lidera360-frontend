import IconoAdmin from "./IconoAdmin";
import { AccionesFila, BadgeEstado, EstadoVacio } from "./PanelComponentes";
import { formatearRangoFechas } from "./utils";

function TalleresPanel({ datos }) {
  const {
    talleresFiltrados,
    busqueda,
    setBusqueda,
    abrirModalCrear,
    abrirModalEditar,
    eliminarRegistro,
    obtenerTipo,
    obtenerEstado,
    obtenerPersonalAsignado,
    cargando,
  } = datos;

  return (
    <>
      <header className="admin-header admin-header-actions">
        <h2>Talleres</h2>
        <div className="admin-actions">
          <label className="admin-search">
            <IconoAdmin tipo="search" />
            <input value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="Buscar talleres..." />
          </label>
          <button type="button" className="admin-primary-button" onClick={() => abrirModalCrear("taller")}>
            <IconoAdmin tipo="plus" />
            Nuevo Taller
          </button>
        </div>
      </header>

      <section className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Fechas</th>
              <th>Coach / Coord</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {talleresFiltrados.map((taller) => {
              const coach = obtenerPersonalAsignado(taller.id_taller, "coach");
              const coordinador = obtenerPersonalAsignado(taller.id_taller, "coordinador");
              return (
                <tr key={taller.id_taller}>
                  <td>{taller.nombre}</td>
                  <td>{obtenerTipo(taller.id_tipo_taller) || "Sin tipo"}</td>
                  <td>{formatearRangoFechas(taller.fecha_inicio, taller.fecha_fin)}</td>
                  <td>
                    <strong>{coach || "Sin coach"}</strong>
                    <span>{coordinador || "Sin coordinador"}</span>
                  </td>
                  <td><BadgeEstado estado={obtenerEstado(taller.id_estado)} /></td>
                  <td className="admin-table-actions">
                    <AccionesFila
                      onEditar={() => abrirModalEditar("taller", taller)}
                      onEliminar={() => eliminarRegistro("taller", taller.id_taller)}
                      etiqueta="taller"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {talleresFiltrados.length === 0 && <EstadoVacio cargando={cargando} texto="No hay talleres para mostrar." />}
      </section>
    </>
  );
}

export default TalleresPanel;
