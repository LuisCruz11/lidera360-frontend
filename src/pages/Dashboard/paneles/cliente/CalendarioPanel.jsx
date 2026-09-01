import { EncabezadoPanel } from "./PanelComponentes";
import { formateadorMes } from "./utils";

const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

function CalendarioPanel({ datos }) {
  const {
    nivelActual,
    fechaBaseCalendario,
    celdasCalendario,
    setDesplazamientoMes,
    inscribiendoId,
    manejarInscripcion,
  } = datos;

  return (
    <>
      <EncabezadoPanel
        titulo="Calendario de Talleres"
        subtitulo={
          nivelActual
            ? `Visualiza los talleres programados para tu nivel: ${nivelActual}`
            : "Visualiza los talleres programados a los que te puedes inscribir"
        }
      />
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
                  className={`cliente-calendar-event ${evento.nivel ? `cliente-nivel-${evento.nivel}` : ""}`}
                  key={`${celda.clave}-${evento.id_taller}`}
                  aria-label={`Inscribirse a ${evento.nombre}`}
                  disabled={inscribiendoId === evento.id_taller}
                  onClick={() => manejarInscripcion(evento.id_taller)}
                >
                  {evento.nombre}
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
      </div>
    </>
  );
}

export default CalendarioPanel;
