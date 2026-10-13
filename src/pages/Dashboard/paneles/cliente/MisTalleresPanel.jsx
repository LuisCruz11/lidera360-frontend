import { EncabezadoPanel, EstadoVacioCliente, TarjetaTaller } from "./PanelComponentes";

function MisTalleresPanel({ datos }) {
  const { talleresEnCurso, cargando, programaCompletado, setSeccionActiva, setTallerPorCancelar } = datos;

  return (
    <>
      <EncabezadoPanel titulo="Mis Talleres" subtitulo="Talleres en los que estás inscrito" />
      {talleresEnCurso.length === 0 ? (
        programaCompletado ? (
          <EstadoVacioCliente
            cargando={cargando}
            titulo="¡Completaste el programa!"
            texto="Aprobaste todos los niveles de Lidera360. Puedes ver tu historial en Inscripciones."
            accion={{ etiqueta: "Ver inscripciones", onClick: () => setSeccionActiva("inscripciones") }}
          />
        ) : (
          <EstadoVacioCliente
            cargando={cargando}
            titulo="Aún no estás inscrito en ningún taller"
            texto="Revisa el calendario para ver los talleres disponibles para tu nivel e inscríbete."
            accion={{ etiqueta: "Ver calendario", onClick: () => setSeccionActiva("calendario") }}
          />
        )
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
