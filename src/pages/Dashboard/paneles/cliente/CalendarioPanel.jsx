import { EncabezadoPanel } from "./PanelComponentes";
import { formateadorMes } from "./utils";

const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

function CalendarioPanel({ datos }) {
  const {
    nivelActual,
    fechaBaseCalendario,
    celdasCalendario,
    setDesplazamientoMes,
    talleresDisponibles,
    cargando,
    setTallerPorInscribir,
  } = datos;

  return (
    <>
      <EncabezadoPanel
        titulo="Calendario de Talleres"
        subtitulo={
          nivelActual
            ? `Talleres programados para tu nivel: ${nivelActual}. Haz clic en uno para inscribirte.`
            : "Visualiza los talleres programados a los que te puedes inscribir"
        }
      />
      {!cargando && talleresDisponibles.length === 0 && (
        <p className="cliente-aviso">
          No hay talleres disponibles para tu nivel en este momento. Te avisaremos cuando se programen nuevos.
        </p>
      )}
      <section className="cliente-calendar-card">
        <div className="cliente-calendar-toolbar">
          <button type="button" aria-label="Mes anterior" onClick={() => setDesplazamientoMes((mes) => mes - 1)}>
            ‹
          </button>
          <h3>{formateadorMes.format(fechaBaseCalendario)}</h3>
          <button type="button" aria-label="Mes siguiente" onClick={() => setDesplazamientoMes((mes) => mes + 1)}>
            ›
          </button>
        </div>
        <div className="cliente-calendar-weekdays">
          {diasSemana.map((dia) => (
            <span key={dia}>{dia}</span>
          ))}
        </div>
        <div className="cliente-calendar-grid">
          {celdasCalendario.map((celda) => (
            <div className={`cliente-calendar-day ${celda.dia ? "" : "cliente-calendar-empty"}`} key={celda.clave}>
              {celda.dia && <span className="cliente-calendar-number">{celda.dia}</span>}
              {celda.eventos.slice(0, 2).map((evento) => (
                <button
                  type="button"
                  className={`cliente-calendar-event ${evento.nivel ? `cliente-nivel-${evento.nivel}` : ""} ${
                    evento.inscrito ? "cliente-calendar-inscrito" : ""
                  }`}
                  key={`${celda.clave}-${evento.id_taller}`}
                  title={evento.inscrito ? `${evento.nombre} (ya inscrito)` : `Inscribirse a ${evento.nombre}`}
                  disabled={evento.inscrito}
                  onClick={() => setTallerPorInscribir(evento)}
                >
                  {evento.inscrito ? `✓ ${evento.nombre}` : evento.nombre}
                </button>
              ))}
              {celda.eventos.length > 2 && <span className="cliente-calendar-more">+ {celda.eventos.length - 2} más</span>}
            </div>
          ))}
        </div>
      </section>
      <div className="cliente-calendar-legend">
        <span><i className="cliente-legend-basico" />Básico</span>
        <span><i className="cliente-legend-avanzado" />Avanzado</span>
        <span><i className="cliente-legend-pl" />PL</span>
        <span><i className="cliente-legend-inscrito" />Ya inscrito</span>
      </div>
    </>
  );
}

export default CalendarioPanel;
