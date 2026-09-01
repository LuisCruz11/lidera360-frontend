import { EncabezadoPanel, TarjetaTaller } from "./PanelComponentes";

function MisTalleresPanel({ datos }) {
  const { talleresEnCurso } = datos;

  return (
    <>
      <EncabezadoPanel titulo="Mis Talleres" subtitulo="Talleres en los que estás inscrito" />
      <div className="cliente-talleres-grid">
        {talleresEnCurso.map((taller) => (
          <TarjetaTaller key={taller.id_taller} taller={taller} />
        ))}
      </div>
    </>
  );
}

export default MisTalleresPanel;
