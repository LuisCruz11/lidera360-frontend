import { EncabezadoPanel, EstadoVacioCliente, TarjetaTaller } from "./PanelComponentes";

function MisTalleresPanel({ datos }) {
  const { talleresEnCurso, cargando, setSeccionActiva, setTallerPorCancelar } = datos;

  return (
    <>
      <EncabezadoPanel titulo="Mis Talleres" subtitulo="Talleres en los que estás inscrito" />
      {talleresEnCurso.length === 0 ? (
        <EstadoVacioCliente
          cargando={cargando}
          titulo="Aún no estás inscrito en ningún taller"
          texto="Revisa el calendario para ver los talleres disponibles para tu nivel e inscríbete."
          accion={{ etiqueta: "Ver calendario", onClick: () => setSeccionActiva("calendario") }}
        />
      ) : (
        <div className="cliente-talleres-grid">
          {talleresEnCurso.map((taller) => (
            <TarjetaTaller key={taller.id_taller} taller={taller} onCancelar={setTallerPorCancelar} />
          ))}
        </div>
      )}
    </>
  );
}

export default MisTalleresPanel;
